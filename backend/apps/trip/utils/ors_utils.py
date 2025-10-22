from decimal import Decimal

import certifi
import openrouteservice as ors

from django.conf import settings
from rest_framework.exceptions import APIException
from openrouteservice.exceptions import ApiError


ORS_CLIENT = ors.Client(
    key=settings.ORS_API_KEY,
    requests_kwargs={
        'verify': certifi.where(),
    },
)


def get_ors_route(start_coords, end_coords):
    """Calls the ORS Directions API for an HGV route and returns key data."""
    try:
        coords = [
            [float(start_coords[0]), float(start_coords[1])],
            [float(end_coords[0]), float(end_coords[1])],
        ]
        route = ORS_CLIENT.directions(
            coordinates=coords,
            profile='driving-hgv',
            units='m',
            instructions=True,
            geometry_simplify=False,
        )
        route_info = route['routes'][0]

        distance_miles = (
            Decimal(route_info['summary']['distance']) * settings.METERS_TO_MILES
        )
        duration_hours = (
            Decimal(route_info['summary']['duration']) * settings.SECONDS_TO_HOURS
        )

        return {
            'distance_miles': distance_miles,
            'duration_hours': duration_hours,
            'geometry': route_info['geometry'],
            'segments': route_info['segments'][0]['steps'],
        }
    except ApiError as e:
        # ORS library raises ApiError with the response data
        raise APIException(e.message['error']['message'])

    except Exception as e:
        print(f'ORS Routing Error: {e}')

        raise ValueError(f'Failed to get route from ORS: {e}')
