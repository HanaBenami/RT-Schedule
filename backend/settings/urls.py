from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("list", views.getSystemSettings, name="settingsList"),
    path("update/<str:setting_key>", views.updateSetting, name="updateSetting"),
]
