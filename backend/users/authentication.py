from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser


class QueryParameterTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Retrieve the token from the query parameters
        auth_token = request.query_params.get("auth_token")

        if not auth_token:
            return None

        # Validate the token and get the user
        try:
            user = CustomUser.objects.get(
                auth_token=auth_token
            )  # Adjust this based on how you store tokens in your application
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        return (user, None)
