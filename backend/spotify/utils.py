from users.models import CustomUser
import base64
import os
import requests
import json


def refresh_token(user: CustomUser):
    response = requests.post(
        url="https://accounts.spotify.com/api/token",
        data={"grant_type": "refresh_token", "refresh_token": user.spotify_refresh},
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
    data = response.json()
    print("", data)
    try:
        user.spotify_token = data["access_token"]
        user.save()
        return True
    except Exception:
        print(Exception)
        return False


def get_details(user: CustomUser):
    return spotify_request("https://api.spotify.com/v1/me", user)


def spotify_request(url, user):
    return requests.get(
        url=url,
        headers={"Authorization": "Bearer {}".format(user.spotify_token)},
    ).json()
