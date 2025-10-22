from decimal import Decimal

from django.http import Http404, JsonResponse
from rest_framework import status, viewsets
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from apps.trip.utils.trip_utils import run_trip_calculation
from apps.trip.models.trip_models import Trip
from apps.trip.serializers.trip_serializer import TripSerializer


class TripView(viewsets.ModelViewSet):
    model = Trip
    serializer_class = TripSerializer

    def get_queryset(self):
        return self.model.objects.all().order_by('-created_at')

    def get_object(self):
        return get_object_or_404(self.model, id=self.kwargs['uid'])

    # Custom action to trigger the complex calculation logic
    @action(detail=False, methods=['post'], url_path='calculate')
    def calculate_trip(self, request):
        """
        Custom endpoint to trigger the full trip calculation.
        Inputs: current_location, pickup_location, dropoff_location,
        current_cycle_used_hrs.
        Outputs: A full Trip object with nested RouteStops and DailyLogs.
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            # Perform HOS and routing logic
            trip_instance = run_trip_calculation(
                current_location=data.get('current_location'),
                current_coordinates=data.get('current_coordinates'),
                pickup_location=data.get('pickup_location'),
                pickup_coordinates=data.get('pickup_coordinates'),
                dropoff_location=data.get('dropoff_location'),
                dropoff_coordinates=data.get('dropoff_coordinates'),
                current_cycle_used_hrs=data.get('current_cycle_used'),
            )

            data_serializer = TripSerializer(trip_instance)

            return Response(data_serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as ve:
            return Response(
                {'error': 'Calculation error', 'detail': str(ve)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            # Handle potential failures from the map API or calculation errors
            print(f'Calculation service error: {e}')
            return Response(
                {'error': 'Trip calculation failed.', 'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TripSummaryView(APIView):
    def _get_status_type(self, stop_type):
        """
        Convert stop type to ELD status.
        """
        status_map = {
            'DRIVING': 'DRIVING',
            'PICKUP': 'ON_DUTY',
            'DROPOFF': 'ON_DUTY',
            'FUEL': 'ON_DUTY',
            'REST': 'ON_DUTY',
            'SLEEPER': 'SLEEPER_BERTH',
        }
        return status_map.get(stop_type, 'OFF_DUTY')

    def _get_activity_description(self, route):
        activity_map = {
            'DRIVING': f'Driving - {route.location_name}',
            'PICKUP': f'Pickup at {route.location_name}',
            'DROPOFF': f'Dropoff at {route.location_name}',
            'FUEL': f'Fueling at {route.location_name}',
            'REST': f'Rest Break - {route.location_name}',
            'SLEEPER': f'Sleeper Berth - {route.location_name}',
        }

        return activity_map.get(route.stop_type, route.location_name)

    def get(self, request, uid):
        try:
            trip = get_object_or_404(Trip, id=uid)
        except Http404:
            return JsonResponse(
                {'status': 'error', 'message': 'Trip not found'}, status=404
            )

        # Get all trip routes ordered by stop_order
        trip_routes = trip.trip_routes.all().order_by('stop_order')

        if not trip_routes.exists():
            return Response(
                {'detail': 'No route data found for this trip.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        timeline = []
        cumulative_duty_hrs = Decimal('0.0')

        for route in trip_routes:
            # Calculate duration in hours
            duration = route.estimated_departure - route.estimated_arrival
            duration_hrs = Decimal(str(duration.total_seconds() / 3600))

            # Determine status based on stop type
            status_type = self._get_status_type(route.stop_type)

            # Update cumulative duty hours (only for on-duty activities)
            if status_type in ['DRIVING', 'ON_DUTY']:
                cumulative_duty_hrs += duration_hrs

            # Create timeline entry
            timeline_entry = {
                'time': route.estimated_arrival.isoformat(),
                'duty_hrs': float(cumulative_duty_hrs),
                'status': status_type,
                'activity': self._get_activity_description(route),
                'duration_hrs': float(duration_hrs),
            }

            timeline.append(timeline_entry)

        response_data = {
            'status': 'success',
            'data': {
                **TripSerializer(trip).data,
                'timeline': timeline,
                'geojson': trip.route_data,
            },
        }

        return Response(response_data, status=status.HTTP_200_OK)
