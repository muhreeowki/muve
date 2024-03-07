from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    spotify_id = models.CharField(max_length=500, null=True)
    spotify_token = models.CharField(max_length=500, null=True)
    spotify_refresh = models.CharField(max_length=500, null=True)
    youtube_key = models.CharField(max_length=500, null=True)
    youtube_credentials = models.TextField(null=True)
