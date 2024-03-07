from django.shortcuts import get_object_or_404, render
from rest_framework.exceptions import status
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class SignUp(APIView):
    def post(self, request, format=None):
        # Serialize the request data
        serializer = CustomUserSerializer(data=request.data)

        if serializer.is_valid():
            # Save the User instance into the db
            serializer.save()
            user = CustomUser.objects.get(username=request.data["username"])
            user.set_password(request.data["password"])
            user.save()
            token = Token.objects.create(user=user)
            return Response(
                {"token": token.key, "user": CustomUserSerializer(instance=user).data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Login(APIView):
    def post(self, request, format=None):
        user = get_object_or_404(CustomUser, username=request.data["username"])
        if user.check_password(request.data["password"]):
            serializer = CustomUserSerializer(instance=user)
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "token": token.key,
                    "user": CustomUserSerializer(instance=user).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"detail": "Not Found: Invalid Password"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
class GetUser(APIView):
    def get(self, request, format=None):
        return Response(
            {
                "user": CustomUserSerializer(instance=request.user).data,
            },
            status=status.HTTP_302_FOUND,
        )
