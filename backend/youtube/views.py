from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, status

from .utils import getUserCreds


@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
class ListPlaylists(APIView):
    def get(self, request, format=None):
        creds = getUserCreds(request.user)
        try:
            # Get a list of all the users playlists
            youtube = build("youtube", "v3", credentials=creds)

            response = (
                youtube.playlists()
                .list(part="snippet,contentDetails", maxResults=30, mine=True)
                .execute()
            )
            print("\n\n\nGETTING USER YOUTUBE PLAYLISTS....\n\n", response)
            return Response(response)
        except HttpError as err:
            print("\n\n\nFAILED TO GET USER YOUTUBE PLAYLISTS!\n\n", err)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
class GetPlaylist(APIView):
    def post(self, request, format=None):
        playlist = request.data["playlist"]
        creds = getUserCreds(request.user)
        try:
            # Get playlist Items for the selected playlist
            youtube = build("youtube", "v3", credentials=creds)

            # Call the People API
            response = (
                youtube.playlistItems()
                .list(
                    part="snippet,contentDetails",
                    maxResults=50,
                    playlistId=playlist["id"],
                )
                .execute()
            )
            print(
                "\n\n\nGETTING PLAYLIST ITEMS FOR SELECTED PLAYLIST.... \n\n", response
            )
            return Response(response)
        except HttpError as err:
            print("\n\n\nFAILED TO GET PLAYLIST ITEMS!\n\n", err)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# CONVERTS A SPOTIFY PLAYLIST INTO A YOUTUBE PLAYLIST
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
class ConvertSpotifyToYoutube(APIView):
    def post(self, request, format=None):
        sp_playlist = request.data["sp_playlist"]
        yt_items = []
        failed_songs = []
        creds = getUserCreds(request.user)
        try:
            # Get playlist Items for the selected playlist
            youtube = build("youtube", "v3", credentials=creds)
            print("GETTING PLAYLIST ITEMS FOR SELECTED PLAYLIST....")
            # Find each song on youtube
            for item in sp_playlist:
                video = (
                    youtube.search()
                    .list(
                        part="snippet",
                        q="{} {}".format(
                            item["track"]["name"], item["track"]["artists"][0]["name"]
                        ),
                    )
                    .execute()
                )
                yt_items.append(video["items"][0])
                print("FOUND: {}".format(video["items"][0]["snippet"]["title"]))
        except HttpError as err:
            print("failed to search songs!", err)
            return Response(
                {"message": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            # Create a playlist
            new_playlist = (
                youtube.playlists()
                .insert(
                    part="snippet",
                    body={"snippet": {"title": request.data["new_playlist_name"]}},
                )
                .execute()
            )
            print(
                "CREATE NEW PLAYLIST: {} \n".format(new_playlist["snippet"]["title"]),
                new_playlist,
            )
        except HttpError as err:
            print("failed to search songs!", err)
            return Response(
                {"message": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Add The songs to the playlist
        for video in yt_items:
            try:
                youtube.playlistItems().insert(
                    part="snippet",
                    body={
                        "snippet": {
                            "playlistId": new_playlist["id"],
                            "resourceId": {
                                "kind": video["id"]["kind"],
                                "videoId": video["id"]["videoId"],
                            },
                        }
                    },
                ).execute()
            except Exception as e:
                failed_songs.append(video["snippet"]["title"])
                continue
        return Response(
            {
                "message": "success",
                "url": "https://www.youtube.com/playlist?list={}".format(
                    new_playlist["id"]
                ),
                "failed_songs": {},
            },
            status=status.HTTP_200_OK,
        )
