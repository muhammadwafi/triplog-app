from django.db import models

from api.models.base_model import BaseModelMixin

from .trip_models import Trip


class TripRoute(BaseModelMixin):
    STOP_CHOICES = (
        ('PICKUP', 'Pickup'),
        ('DROPOFF', 'Dropoff'),
        ('FUEL', 'Fueling'),
        ('REST', 'Required Rest/Break (30 Min)'),
        ('SLEEPER', 'Sleeper Berth/Off Duty (10 Hrs)'),
        ('DRIVING', 'Driving Segment'),
    )

    trip = models.ForeignKey(Trip, related_name='trip_routes', on_delete=models.CASCADE)
    stop_order = models.IntegerField()
    stop_type = models.CharField(max_length=50, choices=STOP_CHOICES)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    estimated_arrival = models.DateTimeField()
    estimated_departure = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['stop_order']

    def __str__(self):
        return (
            f'{self.stop_order}. {self.get_stop_type_display()} at {self.location_name}'
        )
