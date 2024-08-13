from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import json
import os


def getUserCreds(user):
    SCOPES = [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtubepartner",
        "https://www.googleapis.com/auth/youtube.force-ssl",
    ]

    creds = None

    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    try:
        if user.youtube_credentials:
            user_info = json.loads(user.youtube_credentials)
            creds = Credentials.from_authorized_user_info(user_info, SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            # if creds and creds.expired and creds.refresh_token:
            #     creds.refresh(Request())
            # else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "{}".format(os.getenv("YT_CREDENTIALS_PATH")), SCOPES
            )
            creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            user.youtube_credentials = creds.to_json()
            user.save()
    except Exception as e:
        print("FAILED TO GET USER CREDS: \n", e)

    return creds
