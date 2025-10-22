from django.forms import ValidationError
from rest_framework import status
from allauth.account import app_settings as allauth_settings
from django.shortcuts import get_object_or_404
from allauth.account.utils import complete_signup
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.accounts.filters.user_filter import UserFilter
from apps.accounts.serializers.user_serializer import (
    UserSerializer,
    UserAddSerializer,
    CustomUserDetailSerializer,
)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    model = serializer_class.Meta.model
    lookup_field = 'id'
    lookup_url_kwarg = 'id'
    filterset_class = UserFilter
    order_by = ['-date_joined']
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomUserDetailSerializer
        if self.action == 'update' or self.action == 'create':
            return UserAddSerializer
        return super().get_serializer_class()

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        return self.model.objects.all().order_by('-date_joined')

    def get_object(self):
        user_uid = self.kwargs['uid']
        return get_object_or_404(self.model, pk=user_uid)

    def list(self, request):
        return super().list(self, request)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        if user:
            response = Response(
                'User has been added',
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            response = Response(status=status.HTTP_204_NO_CONTENT, headers=headers)

        return response

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        complete_signup(
            self.request._request,
            user,
            allauth_settings.EMAIL_VERIFICATION,
            None,
        )
        return user

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except ValidationError:
            return Response('User not found!', status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path=r'delete/bulk/')
    def bulk_delete(self, request):
        success_all_msg = '{} users has been deleted'
        success_some_msg = '{} from {} users has been deleted'
        not_found_msg = '({}) users data not found'
        error_msg = 'Cannot delete data'

        try:
            data = request.data.get('uid')
            instance = self.model.objects.filter(pk__in=data)
            data_found = instance.count()

            if data_found > 0:
                instance.delete()

                # All data has been successfully deleted
                if data_found == len(data):
                    return Response(
                        success_all_msg.format(data_found), status=status.HTTP_200_OK
                    )
                # Some data is not found
                else:
                    return Response(
                        success_some_msg.format(data_found, len(data)),
                        status=status.HTTP_200_OK,
                    )

            return Response(
                not_found_msg.format(len(data)), status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
