from django.db import models

from api.models.base_model import BaseModelMixin

from .trip_models import Trip


class TripLog(BaseModelMixin):
    trip = models.ForeignKey(Trip, related_name='daily_logs', on_delete=models.CASCADE)
    log_date = models.DateField()
    off_duty_hrs = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
    )
    sleeper_berth_hrs = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
    )
    driving_hrs = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
    )
    on_duty_not_driving_hrs = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
    )
    notes = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['trip', 'log_date'],
                name='unique_daily_log_per_trip',
            )
        ]
        ordering = ['log_date', 'created_at']

    def __str__(self):
        return f'Log for Trip {self.trip.id} on {self.log_date}'
