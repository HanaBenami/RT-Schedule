from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_routes),
    path("list", views.get_users),
    path("create/", views.create_user),
    path("create/basic/", views.create_basic_user),
    path("update/<int:pk>", views.update_user),
]
