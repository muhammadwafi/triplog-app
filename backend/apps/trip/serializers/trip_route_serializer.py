from rest_framework import serializers

from apps.trip.models.trip_route_models import TripRoute


class TripRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRoute
        fields = '__all__'
        read_only_fields = [
            'trip',
            'stop_order',
            'stop_type',
            'location_name',
            'latitude',
            'longitude',
            'estimated_arrival',
            'estimated_departure',
        ]
