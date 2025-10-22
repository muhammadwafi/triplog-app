from rest_framework.serializers import ModelSerializer

from apps.accounts.models.profile_model import Profile


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ProfileUpdateSerializer(ModelSerializer):
    class Meta:
        model = Profile
        exclude = ('user',)
