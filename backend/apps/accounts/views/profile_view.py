from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.models.profile_model import Profile
from apps.accounts.serializers.profile_serializer import (
    ProfileSerializer,
    ProfileUpdateSerializer,
)


class ProfileView(APIView):
    model = Profile
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(self.model, pk=pk)

    def get(self, request, uid, format=None):
        user_profile = self.get_object(uid)
        serializer = ProfileSerializer(user_profile)
        return Response(serializer.data)

    def put(self, request, uid, format=None):
        instance = self.get_object(uid)
        if (
            request.user
            and not request.user.is_superuser
            and request.user.id != instance.created_by.id
        ):
            return Response('Forbidden action', status=status.HTTP_403_FORBIDDEN)

        serializer = ProfileUpdateSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
