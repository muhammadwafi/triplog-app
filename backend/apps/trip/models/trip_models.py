from django.db import models

from api.models.base_model import BaseModelMixin


class Trip(BaseModelMixin):
    current_location = models.CharField(max_length=255)
    current_coordinates = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    pickup_coordinates = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    dropoff_coordinates = models.CharField(max_length=255)
    current_cycle_used = models.DecimalField(max_digits=4, decimal_places=2)
    route_data = models.JSONField(default=dict)
    total_trip_miles = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        null=True,
        blank=True,
    )
    total_driving_hrs = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f'Trip from {self.pickup_location} to {self.dropoff_location}'
