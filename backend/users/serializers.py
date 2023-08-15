from rest_framework import serializers

from .models import User, Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = (
            "pk",
            "name",
        )


class UserSerializer(serializers.ModelSerializer):
    nickname = serializers.SerializerMethodField()
    last_login = serializers.SerializerMethodField()
    last_login_update = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    permissions = (
        serializers.SerializerMethodField()  # serializers.PermissionSerializer(many=True)
    )

    def get_nickname(self, user: User):
        return user.name

    def get_date(self, user: User, date_attribute_name: str):
        value = user.__getattribute__(date_attribute_name)
        return value.strftime("%d/%m/%y %H:%M") if value else None

    def get_last_login(self, user: User):
        return self.get_date(user, "last_login")

    def get_last_login_update(self, user: User):
        return self.get_date(user, "last_login_update")

    def get_created_at(self, user: User):
        return self.get_date(user, "created_at")

    def get_permissions(self, user: User):
        return [permission.name for permission in user.permissions.all()]

    class Meta:
        model = User
        fields = (
            "pk",
            "email",
            "first_name",
            "last_name",
            "nickname",
            "is_active",
            "is_temporary",
            "last_login",
            "last_login_update",
            "created_at",
            "permissions",
        )
