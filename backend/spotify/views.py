from django.http.response import ResponseHeaders
from rest_framework.response import Response
from rest_framework.views import APIView, status  # , status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from dotenv import load_dotenv
from django.shortcuts import get_object_or_404, redirect
from users.models import CustomUser
from users.authentication import QueryParameterTokenAuthentication
from .utils import refresh_token, get_details, spotify_request
import requests
import urllib.parse
import os
import time
import base64
import json
import re

load_dotenv()


@authentication_classes([QueryParameterTokenAuthentication])
@permission_classes([IsAuthenticated])
class SpotifyLogin(APIView):
    def get(self, request, format=None):
        # Create a url query
        url_query = urllib.parse.urlencode(
            {
                "response_type": "code",
                "client_id": os.getenv("CLIENT_ID"),
                "redirect_uri": os.getenv("REDIRECT_URI"),
                "scope": "playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative",
                "state": str(request.user),
            }
        )
        # Send the get request to spotify for an access token
        return redirect(f"https://accounts.spotify.com/authorize?{url_query}")


class SpotifyCallback(APIView):
    def get(self, request, format=None):
        # Check if user authorized spotify permissions
        code = request.GET.get("code")
        state = request.GET.get("state")
        error = request.GET.get("error")
        if error:
            print(error)
            return Response({"error": error})
        # Check if the token that was returned is valid
        if state:
            # Store the spotify auth code in the user object in spotify_id field.
            user = get_object_or_404(CustomUser, username=state)
            user.spotify_id = code
            user.save()
            # Request for an access token
            response = requests.post(
                url="https://accounts.spotify.com/api/token",
                data={
                    "code": code,
                    "redirect_uri": os.getenv("REDIRECT_URI"),
                    "grant_type": "authorization_code",
                },
                headers={
                    "content-type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic "
                    + base64.b64encode(
                        bytes(
                            f"{os.getenv('CLIENT_ID')}:{os.getenv('CLIENT_SECRET')}",
                            "utf-8",
                        )
                    ).decode("utf-8"),
                },
                json=True,
            )

            try:
                data = response.json()
                user.spotify_token = data["access_token"]
                user.spotify_refresh = data["refresh_token"]
                user.save()
                return redirect("http://localhost:5173/dashboard")
            except Exception as error:
                print(error)
                return Response(
                    {"detail": "Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response({"detail": "Bad Data"}, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GetPlaylists(APIView):
    def get(self, request, format=None):
        user = request.user
        refresh_token(user)
        return Response(
            spotify_request("https://api.spotify.com/v1/me/playlists", user)
        )


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GetPlaylistItems(APIView):
    def post(self, request, format=None):
        user = request.user
        refresh_token(user)
        return Response(spotify_request(request.data["tracks_url"], user))


# CONVERTING A YOUTUBE PLAYLIST TO A SPOTIFY PLAYLIST
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class ConvertToSpotify(APIView):
    def post(self, request, format=None):
        spotify_song_uris = []
        songs_not_found = []
        yt_playlist = request.data["yt_playlist"]
        user = request.user

        # Loop through the list of yt songs
        refresh_token(user)
        print("\n\n\nSEARCHING SPOTIFY FOR SONGS....\n\n")
        for item in yt_playlist:
            # Search spotify for each song
            clean_string = filter(
                lambda x: x.isalnum() or x.isspace() or x in ["(", ")", "[", "]"],
                "{} {}".format(
                    item["snippet"]["title"], item["snippet"]["videoOwnerChannelTitle"]
                ),
            )

            # Removing anything that is inside of parenthesis or brackets
            query = " ".join(
                re.sub("[\(\[].*?[\)\]]", "", "".join(clean_string)).lower().split()
            )

            url = "https://api.spotify.com/v1/search?" + urllib.parse.urlencode(
                {
                    "q": query,
                    "type": "track",
                    "limit": 7,
                }
            )
            response = spotify_request(url, user)  # Add the song uri to the uri list
            if len(response["tracks"]["items"]) >= 1:
                print(
                    "\tSEARCHING FOR: {} BY {}:".format(
                        item["snippet"]["title"],
                        item["snippet"]["videoOwnerChannelTitle"],
                    )
                )
                for track in response["tracks"]["items"]:
                    raw_artist = filter(
                        lambda x: x.isalnum() or x.isspace() or x in ["(", ")"],
                        track["artists"][0]["name"].lower(),
                    )
                    artist = " ".join(
                        re.sub("\[\([].*?[\)\]]", "", "".join(raw_artist))
                        .lower()
                        .split()
                    )
                    if (
                        artist in item["snippet"]["videoOwnerChannelTitle"].lower()
                        or artist in query
                        or item["snippet"]["videoOwnerChannelTitle"].lower() in artist
                        or "".join(
                            item["snippet"]["videoOwnerChannelTitle"].lower().split()
                        )
                        in "".join(artist.split())
                        or "".join(artist.split())
                        in "".join(
                            item["snippet"]["videoOwnerChannelTitle"].lower().split()
                        )
                    ):
                        print("\t\tFound!!!: {} by {}".format(track["name"], artist))
                        spotify_song_uris.append(track["uri"])
                        break
            else:
                songs_not_found.append(item["snippet"]["title"])

        # Create a new playlist
        print("CREATING NEW PLAYLIST....")
        spotify_user_id = get_details(request.user)["id"]
        url = f"https://api.spotify.com/v1/users/{spotify_user_id}/playlists"
        new_playlist = requests.post(
            url=url,
            data=json.dumps(
                {
                    "name": request.data["new_playlist_name"],
                    "public": False,
                }
            ),
            headers={
                "Authorization": "Bearer {}".format(user.spotify_token),
            },
            json=True,
        ).json()
        playlist_id = new_playlist["id"]

        # Add The songs to the playlist
        print("ADDING SONGS TO NEW PLAYLIST....")
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        response = requests.post(
            url=url,
            data=json.dumps({"uris": spotify_song_uris, "position": 0}),
            headers={
                "Authorization": "Bearer {}".format(user.spotify_token),
            },
            json=True,
        ).json()
        print("DONE CONVERTING TO SPOTIFY!")
        return Response({"message": "success", "playlist": new_playlist})
