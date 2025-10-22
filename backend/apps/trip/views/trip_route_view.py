from rest_framework import viewsets

from apps.trip.models.trip_route_models import TripRoute
from apps.trip.serializers.trip_route_serializer import TripRouteSerializer


class TripRouteView(viewsets.ReadOnlyModelViewSet):
    queryset = TripRoute.objects.all()
    serializer_class = TripRouteSerializer
