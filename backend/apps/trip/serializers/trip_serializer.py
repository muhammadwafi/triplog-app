from rest_framework import serializers

from apps.trip.models.trip_models import Trip
from apps.trip.serializers.trip_log_serializer import TripLogSerializer
from apps.trip.serializers.trip_route_serializer import TripRouteSerializer


class TripSerializer(serializers.ModelSerializer):
    daily_logs = TripLogSerializer(many=True, read_only=True)
    trip_routes = TripRouteSerializer(many=True, read_only=True)
    trip_name = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'trip_name',
            'current_location',
            'current_coordinates',
            'pickup_location',
            'pickup_coordinates',
            'dropoff_location',
            'dropoff_coordinates',
            'current_cycle_used',
            'total_trip_miles',
            'total_driving_hrs',
            'created_at',
            'daily_logs',
            'trip_routes',
        ]

        read_only_fields = [
            'total_trip_miles',
            'total_driving_hrs',
            'route_data',
        ]

    def get_trip_name(self, obj):
        def get_location_name(location_str):
            if not location_str:
                return 'Unknown'

            parts = location_str.split(',')

            return parts[0].strip()

        current_loc = get_location_name(obj.current_location)
        pickup_loc = get_location_name(obj.pickup_location)
        dropoff_loc = get_location_name(obj.dropoff_location)

        return f'{current_loc} - {pickup_loc} - {dropoff_loc}'
