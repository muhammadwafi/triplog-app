from rest_framework import viewsets

from apps.trip.models.trip_log_models import TripLog
from apps.trip.serializers.trip_log_serializer import TripLogSerializer


class TripLogView(viewsets.ReadOnlyModelViewSet):
    # This ViewSet is mainly for reading log sheets, potentially nested under a Trip ID
    queryset = TripLog.objects.all()
    serializer_class = TripLogSerializer
