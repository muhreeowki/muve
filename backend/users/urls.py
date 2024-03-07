from django.urls import path
from users.views import GetUser

urlpatterns = [
    path("get/", GetUser.as_view()),
]
