from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_routes),
    path("list", views.get_calls),
    path("add", views.add_calls),
    path("add/example", views.add_calls_payload_example),
    path("update/<int:external_id>", views.update_call),
]
