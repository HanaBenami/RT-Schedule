from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("list", views.getCalls, name="callsList"),
    path("add", views.addCalls, name="addCalls"),
    path("add/example", views.addCallsPayloadExample, name="addCallsPayloadExample"),
    path("update/<int:externalId>", views.updateCall, name="updateCall"),
]
