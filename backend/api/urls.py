"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from drf_yasg import openapi
from django.conf import settings
from django.http import JsonResponse
from django.urls import path, include
from drf_yasg.views import get_schema_view
from django.conf.urls.static import static
from rest_framework.permissions import AllowAny


schema_view = get_schema_view(
    openapi.Info(
        title='TripLog API',
        default_version='v1',
        description='TripLog api docs',
    ),
    public=True,
    permission_classes=(AllowAny,),
)


def health_check(request):
    return JsonResponse({'message': 'ok'})


urlpatterns = [
    path('', health_check, name='root'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/trips/', include('apps.trip.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns.append(
        path(
            'docs/',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui',
        ),
    )
