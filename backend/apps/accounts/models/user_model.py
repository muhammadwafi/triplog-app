import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='user_created_by_related',
        blank=True,
        null=True,
    )
    updated_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='user_updated_by_related',
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(editable=False, auto_now_add=True)
    updated_at = models.DateTimeField(editable=False, auto_now=True)
