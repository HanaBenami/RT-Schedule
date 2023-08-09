from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("list", views.getUsers, name="usersList"),
    path("create/", views.createUser, name="createUser"),
    path("create/basic/", views.createBasicUser, name="createBasicUser"),
    path("update/<int:pk>", views.updateUser, name="updateUser"),
]
