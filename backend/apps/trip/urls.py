from django.urls import path

from apps.trip.views.trip_view import TripView, TripSummaryView


trip_list = TripView.as_view({'get': 'list'})
trip_calc = TripView.as_view({'post': 'calculate_trip'})
trip_delete = TripView.as_view({'delete': 'destroy'})

urlpatterns = [
    path('', trip_list, name='trip_list'),
    path('<uuid:uid>/', trip_delete, name='trip_delete'),
    path('<uuid:uid>/summary/', TripSummaryView.as_view(), name='trip_summary'),
    path('calculate', trip_calc, name='trip_calc'),
]
