from rest_framework import serializers

from .models import User, Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = (
            "pk",
            "scope_name",
        )


class UserSerializer(serializers.ModelSerializer):
    last_login = serializers.SerializerMethodField()
    last_login_update = serializers.SerializerMethodField()
    added_at = serializers.SerializerMethodField()
    permissions = PermissionSerializer(many=True)

    def get_date(self, user, date_attribute_name):
        value = user.__getattribute__(date_attribute_name)
        return value.strftime("%d/%m/%y") if value else None

    def get_last_login(self, user):
        return self.get_date(user, "last_login")

    def get_last_login_update(self, user):
        return self.get_date(user, "last_login_update")

    def get_added_at(self, user):
        return self.get_date(user, "added_at")

    class Meta:
        model = User
        fields = (
            "pk",
            "email",
            "first_name",
            "last_name",
            "nickname",
            "is_active",
            "last_login",
            "last_login_update",
            "added_at",
            "permissions",
        )
