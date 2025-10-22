import json

from decimal import Decimal, getcontext
from datetime import datetime, timedelta

from django.db import transaction
from django.conf import settings
from django.utils import timezone

from apps.trip.utils.ors_utils import get_ors_route
from apps.trip.models.trip_models import Trip
from apps.trip.models.trip_log_models import TripLog
from apps.trip.models.trip_route_models import TripRoute


getcontext().prec = 50


def parse_coordinates(coord_string):
    coords = [c.strip() for c in coord_string.split(',')]
    if len(coords) != 2:
        raise ValueError(f'Invalid coordinates format: {coord_string}')

    try:
        return Decimal(coords[0]), Decimal(coords[1])
    except Exception as e:
        raise ValueError(e)


class ELDTripPlanner:
    """
    Service for generating FMCSA-compliant trip routes with automatic stop planning.
    Handles HOS rules for property-carrying drivers (70hrs/8days).
    """

    def __init__(self, get_ors_route_func):
        """
        Initialize planner with ORS route function.

        Args:
            get_ors_route_func: Function to call ORS API
        """
        self.get_ors_route = get_ors_route_func

    def create_trip_plan(
        self,
        current_coords: tuple[float, float],
        pickup_coords: tuple[float, float],
        dropoff_coords: tuple[float, float],
        current_cycle_used: Decimal,
        current_location: str,
        pickup_location: str,
        dropoff_location: str,
    ) -> dict:
        """
        Generate complete trip plan with routes and stops.

        Returns:
            dict with trip data, trip_routes, and daily_logs
        """
        # Validate cycle hours
        available_cycle = settings.MAX_CYCLE_HOURS - current_cycle_used
        if available_cycle <= 0:
            raise ValueError('Driver has reached 70-hour/8-day cycle.')

        # Get routes for both legs
        leg1_route = self.get_ors_route(current_coords, pickup_coords)
        leg2_route = self.get_ors_route(pickup_coords, dropoff_coords)

        total_distance = leg1_route['distance_miles'] + leg2_route['distance_miles']

        # Generate stop sequence
        start_time = self._get_next_start_time()
        stops = self._generate_stops(
            current_coords=current_coords,
            current_location=current_location,
            pickup_coords=pickup_coords,
            pickup_location=pickup_location,
            dropoff_coords=dropoff_coords,
            dropoff_location=dropoff_location,
            leg1_route=leg1_route,
            leg2_route=leg2_route,
            start_time=start_time,
            current_cycle_used=current_cycle_used,
        )

        # Generate daily logs from stops
        daily_logs = self._generate_daily_logs(stops, start_time)

        # Calculate totals
        total_driving_hrs = sum(
            s['duration_hours'] for s in stops if s['stop_type'] == 'DRIVING'
        )

        # Create GeoJSON LineString from both route geometries
        from openrouteservice import convert

        decoded_geometry1 = convert.decode_polyline(leg1_route['geometry'])[
            'coordinates'
        ]
        decoded_geometry2 = convert.decode_polyline(leg2_route['geometry'])[
            'coordinates'
        ]
        full_geometry = decoded_geometry1 + decoded_geometry2
        geojson_linestring = json.dumps(
            {'type': 'LineString', 'coordinates': full_geometry}
        )

        return {
            'trip_data': {
                'current_location': current_location,
                'current_coordinates': f'{current_coords[0]},{current_coords[1]}',
                'pickup_location': pickup_location,
                'pickup_coordinates': f'{pickup_coords[0]},{pickup_coords[1]}',
                'dropoff_location': dropoff_location,
                'dropoff_coordinates': f'{dropoff_coords[0]},{dropoff_coords[1]}',
                'current_cycle_used': current_cycle_used,
                'route_data': geojson_linestring,
                'total_trip_miles': total_distance,
                'total_driving_hrs': total_driving_hrs,
            },
            'trip_routes': stops,
            'daily_logs': daily_logs,
            'raw_routes': {
                'leg1': leg1_route,
                'leg2': leg2_route,
            },
        }

    def _get_next_start_time(self) -> datetime:
        """Get next 7:00 AM start time."""
        now = timezone.now()
        start = now.replace(
            hour=settings.START_TIME_HOUR, minute=0, second=0, microsecond=0
        )
        if now.hour >= settings.START_TIME_HOUR:
            start += timedelta(days=1)
        return start

    def _generate_stops(
        self,
        current_coords,
        current_location,
        pickup_coords,
        pickup_location,
        dropoff_coords,
        dropoff_location,
        leg1_route,
        leg2_route,
        start_time,
        current_cycle_used,
    ) -> list[dict]:
        """
        Generate all stops including fuel, rest, and sleeper berth.
        """

        stops = []
        order = 0
        current_time = start_time
        daily_driving = Decimal('0.0')
        daily_on_duty = Decimal('0.0')
        consecutive_driving = Decimal('0.0')
        cycle_used = current_cycle_used
        miles_since_fuel = Decimal('0.0')

        # Process Leg 1: Current to Pickup
        (
            current_time,
            order,
            daily_driving,
            daily_on_duty,
            consecutive_driving,
            cycle_used,
            miles_since_fuel,
        ) = self._process_leg(
            stops,
            order,
            current_time,
            current_coords,
            current_location,
            pickup_coords,
            pickup_location,
            leg1_route,
            daily_driving,
            daily_on_duty,
            consecutive_driving,
            cycle_used,
            miles_since_fuel,
            is_pickup=True,
        )

        # Process Leg 2: Pickup to Dropoff
        (
            current_time,
            order,
            daily_driving,
            daily_on_duty,
            consecutive_driving,
            cycle_used,
            miles_since_fuel,
        ) = self._process_leg(
            stops,
            order,
            current_time,
            pickup_coords,
            pickup_location,
            dropoff_coords,
            dropoff_location,
            leg2_route,
            daily_driving,
            daily_on_duty,
            consecutive_driving,
            cycle_used,
            miles_since_fuel,
            is_pickup=False,
        )

        return stops

    def _process_leg(
        self,
        stops,
        order,
        current_time,
        start_coords,
        start_location,
        end_coords,
        end_location,
        route_data,
        daily_driving,
        daily_on_duty,
        consecutive_driving,
        cycle_used,
        miles_since_fuel,
        is_pickup,
    ):
        """Process a single leg of the journey with HOS compliance."""
        remaining_distance = route_data['distance_miles']
        current_coords = start_coords

        while remaining_distance > 0:
            # Check mandatory rest break
            # 30 min after 8 hrs
            if consecutive_driving >= settings.REQUIRED_BREAK_AFTER_HOURS:
                stops.append(
                    {
                        'stop_order': order,
                        'stop_type': 'REST',
                        'location_name': 'Rest Area (30-min break)',
                        'latitude': current_coords[1],
                        'longitude': current_coords[0],
                        'estimated_arrival': current_time,
                        'estimated_departure': current_time
                        + timedelta(hours=float(settings.REQUIRED_BREAK_DURATION)),
                        'duration_hours': settings.REQUIRED_BREAK_DURATION,
                        'notes': 'Mandatory 30-minute break after 8 hours driving',
                    }
                )
                order += 1
                current_time += timedelta(hours=float(settings.REQUIRED_BREAK_DURATION))
                daily_on_duty += settings.REQUIRED_BREAK_DURATION
                consecutive_driving = Decimal('0.0')

            # Check sleeper berth
            # 10 hrs after 14 hrs on-duty or 11 hrs driving
            if (
                daily_on_duty >= settings.MAX_ON_DUTY_HOURS_PER_DAY
                or daily_driving >= settings.MAX_DRIVING_HOURS_PER_DAY
            ):
                stops.append(
                    {
                        'stop_order': order,
                        'stop_type': 'SLEEPER',
                        'location_name': 'Sleeper Berth/Rest Stop',
                        'latitude': current_coords[1],
                        'longitude': current_coords[0],
                        'estimated_arrival': current_time,
                        'estimated_departure': current_time
                        + timedelta(hours=float(settings.REQUIRED_OFF_DUTY_HOURS)),
                        'duration_hours': settings.REQUIRED_OFF_DUTY_HOURS,
                        'notes': '10-hour off-duty rest period',
                    }
                )
                order += 1
                current_time += timedelta(hours=float(settings.REQUIRED_OFF_DUTY_HOURS))
                daily_driving = Decimal('0.0')
                daily_on_duty = Decimal('0.0')
                consecutive_driving = Decimal('0.0')

            # Check fuel stops after 1000 miles
            if miles_since_fuel >= settings.FUELING_INTERVAL_MILES:
                stops.append(
                    {
                        'stop_order': order,
                        'stop_type': 'FUEL',
                        'location_name': 'Fuel Stop',
                        'latitude': current_coords[1],
                        'longitude': current_coords[0],
                        'estimated_arrival': current_time,
                        'estimated_departure': current_time
                        + timedelta(hours=float(settings.FUELING_DURATION_HOURS)),
                        'duration_hours': settings.FUELING_DURATION_HOURS,
                        'notes': 'Fueling stop',
                    }
                )
                order += 1
                current_time += timedelta(hours=float(settings.FUELING_DURATION_HOURS))
                daily_on_duty += settings.FUELING_DURATION_HOURS
                miles_since_fuel = Decimal('0.0')

            # Check cycle limit
            if cycle_used >= settings.MAX_CYCLE_HOURS:
                raise ValueError('70-hour/8-day cycle limit reached. Cannot continue.')

            # Calculate driving time available in this segment
            available_driving = min(
                settings.MAX_DRIVING_HOURS_PER_DAY - daily_driving,
                settings.MAX_ON_DUTY_HOURS_PER_DAY - daily_on_duty,
                settings.REQUIRED_BREAK_AFTER_HOURS - consecutive_driving,
                settings.MAX_CYCLE_HOURS - cycle_used,
            )

            drive_distance = min(
                remaining_distance,
                available_driving * settings.AVERAGE_SPEED_MPH,
                settings.FUELING_INTERVAL_MILES - miles_since_fuel,
            )

            drive_time = drive_distance / settings.AVERAGE_SPEED_MPH
            mile_segment = round(float(drive_distance), 1)

            # Add driving segment
            stops.append(
                {
                    'stop_order': order,
                    'stop_type': 'DRIVING',
                    'location_name': f'Driving segment ({mile_segment} miles)',
                    'latitude': current_coords[1],
                    'longitude': current_coords[0],
                    'estimated_arrival': current_time,
                    'estimated_departure': current_time
                    + timedelta(hours=float(drive_time)),
                    'duration_hours': drive_time,
                    'notes': f'Driving {float(drive_distance):.1f} miles',
                }
            )

            order += 1
            current_time += timedelta(hours=float(drive_time))
            daily_driving += drive_time
            daily_on_duty += drive_time
            consecutive_driving += drive_time
            cycle_used += drive_time
            remaining_distance -= drive_distance
            miles_since_fuel += drive_distance

        # Add pickup or dropoff stop
        stop_type = 'PICKUP' if is_pickup else 'DROPOFF'
        stops.append(
            {
                'stop_order': order,
                'stop_type': stop_type,
                'location_name': end_location,
                'latitude': end_coords[1],
                'longitude': end_coords[0],
                'estimated_arrival': current_time,
                'estimated_departure': current_time
                + timedelta(hours=float(settings.PICKUP_DROPOFF_DURATION)),
                'duration_hours': settings.PICKUP_DROPOFF_DURATION,
                'notes': f'{stop_type.title()} location - 1 hour',
            }
        )
        order += 1
        current_time += timedelta(hours=float(settings.PICKUP_DROPOFF_DURATION))
        daily_on_duty += settings.PICKUP_DROPOFF_DURATION

        return (
            current_time,
            order,
            daily_driving,
            daily_on_duty,
            consecutive_driving,
            cycle_used,
            miles_since_fuel,
        )

    def _generate_daily_logs(
        self, stops: list[dict], start_time: datetime
    ) -> list[dict]:
        """Generate daily logs from stop data."""
        daily_logs = {}

        for stop in stops:
            arrival = stop['estimated_arrival']
            duration = stop['duration_hours']
            log_date = arrival.date()

            if log_date not in daily_logs:
                daily_logs[log_date] = {
                    'log_date': log_date,
                    'driving_hrs': Decimal('0.0'),
                    'on_duty_not_driving_hrs': Decimal('0.0'),
                    'sleeper_berth_hrs': Decimal('0.0'),
                    'off_duty_hrs': Decimal('0.0'),
                    'notes': [],
                }

            log = daily_logs[log_date]

            if stop['stop_type'] == 'DRIVING':
                log['driving_hrs'] += duration
            elif stop['stop_type'] == 'SLEEPER':
                log['sleeper_berth_hrs'] += duration
                log['off_duty_hrs'] += duration
            elif stop['stop_type'] in ['PICKUP', 'DROPOFF', 'FUEL', 'REST']:
                log['on_duty_not_driving_hrs'] += duration

            if stop.get('notes'):
                log['notes'].append(stop['notes'])

        # Convert notes list to string
        for log in daily_logs.values():
            log['notes'] = '; '.join(log['notes']) if log['notes'] else ''

        return list(daily_logs.values())


# filter TripRoute fields
def prepare_trip_route_data(route_data):
    trip_route_fields = [
        'stop_order',
        'stop_type',
        'location_name',
        'latitude',
        'longitude',
        'estimated_arrival',
        'estimated_departure',
        'notes',
    ]
    return {k: v for k, v in route_data.items() if k in trip_route_fields}


@transaction.atomic
def run_trip_calculation(
    current_location,
    current_coordinates,
    pickup_location,
    pickup_coordinates,
    dropoff_location,
    dropoff_coordinates,
    current_cycle_used_hrs,
):
    planner = ELDTripPlanner(get_ors_route)

    current_lat, current_lon = parse_coordinates(current_coordinates)
    pickup_lat, pickup_lon = parse_coordinates(pickup_coordinates)
    dropoff_lat, dropoff_lon = parse_coordinates(dropoff_coordinates)

    plan = planner.create_trip_plan(
        current_coords=(current_lon, current_lat),
        pickup_coords=(pickup_lon, pickup_lat),
        dropoff_coords=(dropoff_lon, dropoff_lat),
        current_cycle_used=current_cycle_used_hrs,
        current_location=current_location,
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
    )

    # Create Trip instance
    trip_instance = Trip.objects.create(
        current_location=current_location,
        current_coordinates=current_coordinates,
        pickup_location=pickup_location,
        pickup_coordinates=pickup_coordinates,
        dropoff_location=dropoff_location,
        dropoff_coordinates=dropoff_coordinates,
        current_cycle_used=current_cycle_used_hrs,
        route_data=plan['trip_data']['route_data'],
        total_trip_miles=plan['trip_data']['total_trip_miles'],
        total_driving_hrs=plan['trip_data']['total_driving_hrs'],
    )

    # Create TripRoute instances
    for route_data in plan['trip_routes']:
        clean_route_data = prepare_trip_route_data(route_data)
        TripRoute.objects.create(trip=trip_instance, **clean_route_data)

    # Create TripLog instances
    for log_data in plan['daily_logs']:
        TripLog.objects.create(trip=trip_instance, **log_data)

    return trip_instance
