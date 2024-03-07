from .models import CustomUser
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
            "spotify_id",
            "spotify_token",
            "youtube_key",
            "youtube_credentials",
        ]
