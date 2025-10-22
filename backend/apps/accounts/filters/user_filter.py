from django.conf import settings
from django_filters import OrderingFilter, DateTimeFromToRangeFilter
from django_filters import rest_framework as filters

from apps.accounts.models.user_model import User


class UserFilter(filters.FilterSet):
    date_joined = DateTimeFromToRangeFilter()
    last_login = DateTimeFromToRangeFilter()

    ordering = OrderingFilter(
        fields=(
            ('id', 'id'),
            ('username', 'username'),
            ('email', 'email'),
            ('is_superuser', 'is_superuser'),
            ('last_login', 'last_login'),
            ('date_joined', 'date_joined'),
        )
    )

    class Meta:
        settings.USE_TZ = True
        model = User
        fields = {
            'id': ['contains', 'in'],
            'username': ['icontains'],
            'email': ['exact', 'contains'],
            'is_superuser': ['exact'],
            'last_login': ['gte', 'lte', 'exact', 'gt', 'lt'],
            'date_joined': ['gte', 'lte', 'exact', 'gt', 'lt'],
        }
