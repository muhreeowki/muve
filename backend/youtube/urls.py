from django.urls import path
from .views import ConvertSPPlaylist, ListPlaylists, GetPlaylist

urlpatterns = [
    path("playlists/", ListPlaylists.as_view()),
    path("get-playlist/", GetPlaylist.as_view()),
    path("convert/", ConvertSPPlaylist.as_view()),
]
