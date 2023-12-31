from django.contrib import admin

from .models import User, Permission


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_active",
        "is_temporary",
        "last_login",
        "created_at",
    )
