from django.contrib import admin
from django.urls import include, path
from users.views import Login, SignUp

urlpatterns = [
    path("admin/", admin.site.urls),
    path("sign-up/", SignUp.as_view()),
    path("login/", Login.as_view()),
    path("spotify/", include("spotify.urls")),
    path("users/", include("users.urls")),
    path("youtube/", include("youtube.urls")),
]
