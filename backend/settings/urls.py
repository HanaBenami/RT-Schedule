from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_routes),
    path("list", views.get_system_settings),
    path("update/<str:setting_key>", views.update_setting),
]
