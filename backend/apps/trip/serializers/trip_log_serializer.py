from rest_framework import serializers

from apps.trip.models.trip_log_models import TripLog


class TripLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripLog
        fields = '__all__'
        read_only_fields = [
            'trip',
            'log_date',
            'off_duty_hrs',
            'sleeper_berth_hrs',
            'driving_hrs',
            'on_duty_not_driving_hrs',
        ]
