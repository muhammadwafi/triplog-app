from django.urls import path

from apps.accounts.views.user_view import UserViewSet


user_list = UserViewSet.as_view({'get': 'list', 'post': 'create'})
user_detail = UserViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    path('', user_list, name='user_list'),
    # path('delete/bulk/', user_bulk, name='user_bulk_delete'),
    # path('<uuid:uid>/', user_detail, name='user_detail'),
    # path('profile/<uuid:uid>/', ProfileView.as_view(), name='user_profile'),
]
