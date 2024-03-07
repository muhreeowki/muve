from django.urls import path
from .views import (
    GetPlaylistItems,
    GetPlaylists,
    SpotifyLogin,
    SpotifyCallback,
    ConvertToSpotify,
)

urlpatterns = [
    path("login/", SpotifyLogin.as_view()),
    path("callback/", SpotifyCallback.as_view()),
    path("get-playlists/", GetPlaylists.as_view()),
    path("get-playlist-items/", GetPlaylistItems.as_view()),
    path("convert/", ConvertToSpotify.as_view()),
]
