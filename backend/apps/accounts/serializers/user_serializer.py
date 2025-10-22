from rest_framework import serializers
from allauth.account.utils import setup_user_email
from django.core.exceptions import ValidationError
from allauth.account.adapter import get_adapter
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer

from apps.accounts.models.user_model import User
from apps.accounts.models.profile_model import Profile


class UserProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    added_by = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = User
        exclude = ('password',)


class CustomUserDetailSerializer(UserDetailsSerializer):
    # profile = UserProfileDetailSerializer(read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    gender = serializers.CharField(source='profile.gender', read_only=True)
    address = serializers.CharField(source='profile.address', read_only=True)
    date_of_birth = serializers.DateField(
        format='%d-%m-%Y', source='profile.date_of_birth', read_only=True
    )
    profile_picture = serializers.ImageField(
        source='profile.profile_picture', read_only=True
    )
    phone = serializers.ImageField(source='profile.phone', read_only=True)
    profile_last_update = serializers.DateTimeField(
        source='profile.last_update', read_only=True
    )
    added_by = serializers.CharField(source='added_by.username', read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = [
            'id',
            'username',
            'email',
            'added_by',
            'is_superuser',
            'is_staff',
            'full_name',
            'gender',
            'address',
            'date_of_birth',
            'profile_picture',
            'phone',
            'last_login',
            'date_joined',
            'profile_last_update',
        ]


class UserAddSerializer(RegisterSerializer):
    is_superuser = serializers.BooleanField(source='user.is_staff')
    is_staff = serializers.ReadOnlyField(source='user.is_staff', read_only=True)
    added_by = serializers.ReadOnlyField(source='user', read_only=True)

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user = adapter.save_user(request, user, self, commit=False)
        is_superuser = request.data.get('is_superuser')

        if 'password1' in self.cleaned_data:
            try:
                adapter.clean_password(self.cleaned_data['password1'], user=user)
            except ValidationError as exc:
                raise serializers.ValidationError(
                    detail=serializers.as_serializer_error(exc)
                )

        user.is_staff = True
        user.is_superuser = True if is_superuser == 'true' else False
        user.created_by = request.user
        user.save()
        self.custom_signup(request, user)
        setup_user_email(request, user, [])

        return user


class UserAuthSerializer(UserDetailsSerializer):
    profile_picture = serializers.ImageField(
        source='profile.profile_picture', read_only=True
    )

    class Meta(UserDetailsSerializer.Meta):
        fields = [
            'id',
            'username',
            'email',
            'is_superuser',
            'profile_picture',
        ]
