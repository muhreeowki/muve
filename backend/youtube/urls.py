from django.urls import path
from .views import ConvertSpotifyToYoutube, ListPlaylists, GetPlaylist

urlpatterns = [
    path("playlists/", ListPlaylists.as_view()),
    path("get-playlist/", GetPlaylist.as_view()),
    path("convert/", ConvertSpotifyToYoutube.as_view()),
]
