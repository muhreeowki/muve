from rest_framework.response import Response
from rest_framework.views import APIView, status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect
from .utils import getUserCreds
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import json


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


@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
class ConvertSPPlaylist(APIView):
    def post(self, request, format=None):
        sp_playlist = request.data["sp_playlist"]
        yt_items = []
        creds = getUserCreds(request.user)
        try:
            # Get playlist Items for the selected playlist
            youtube = build("youtube", "v3", credentials=creds)
            print("\n\n\nGETTING PLAYLIST ITEMS FOR SELECTED PLAYLIST.... \n\n")
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

            # Add The songs to the playlist
            response = {}
            for video in yt_items:
                response = (
                    youtube.playlistItems()
                    .insert(
                        part="snippet",
                        body={
                            "snippet": {
                                "playlistId": new_playlist["id"],
                                "resourceId": video["id"],
                            }
                        },
                    )
                    .execute()
                )
            return Response(
                {
                    "message": "success",
                    "url": "https://www.youtube.com/playlist?list={}".format(
                        new_playlist["id"]
                    ),
                },
                status=status.HTTP_200_OK,
            )
        except HttpError as err:
            print("\n\n\nFAILED TO GET PLAYLIST ITEMS!\n\n", err)
            return Response(
                {"message": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
