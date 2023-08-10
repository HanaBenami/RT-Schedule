from typing import Any, List
from django.utils import timezone
from datetime import timedelta
from django.db import models
import json
import logging

from django.conf import settings
from utils.nameable import Nameable
from settings.models import SystemSetting
from . import permissions
from .auth0 import Auth0User, Auth0Permission

logger = logging.getLogger(__name__)


class Permission(Nameable, models.Model):
    ALL_PERMISSIONS = permissions.ALL_PERMISSIONS

    DEFAULT_PERMISSIONS = list(
        filter(
            lambda permission: permission.lower().startswith("read"), ALL_PERMISSIONS
        )
    ) + [permissions.UPDATE_MY_CALLS_PERMISSION, permissions.ADD_MY_CALLS_PERMISSION]

    name = models.CharField(max_length=100, null=False, blank=False, unique=True)


class User(Nameable, models.Model):
    BASIC_UPDATEABLE_FIELDS = (
        "first_name",
        "last_name",
        "email",
    )
    UPDATEABLE_FIELDS = BASIC_UPDATEABLE_FIELDS + (
        "is_active",
        "is_temporary",
        "permissions",
    )
    UPDATE_AUTH0_USER_DURING_SAVE = True

    DELETE_TEMP_USER_X_DAYS_POST_LAST_LOGIN = SystemSetting(
        key="DELETE_TEMP_USER_X_DAYS_POST_LAST_LOGIN",
        default_value=7,
        description="כמה ימים אחרי ההתחברות האחרונה יש למחוק משתמש זמני? (0 = לעולם לא)",
    )

    auth0_user_id = models.CharField(max_length=100, null=True, blank=True, unique=True)
    email = models.EmailField(
        max_length=100,
        null=False,
        blank=False,
        unique=True,
    )
    first_name = models.CharField(max_length=100, null=False, blank=False)
    last_name = models.CharField(max_length=100, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_temporary = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    last_login_update = models.DateTimeField(null=True, blank=True)
    permissions = models.ManyToManyField(Permission, blank=True)

    class Meta:
        unique_together = ["first_name", "last_name"]

    @property
    def is_blocked(self) -> bool:
        return not self.is_active

    @property
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def auth0_user(self) -> Auth0User:
        return (
            Auth0User.getUserFromAuth0(user_id=self.auth0_user_id)
            if self.auth0_user_id
            else None
        )

    @auth0_user.setter
    def auth0_user(self, auth0_user: Auth0User) -> None:
        self.auth0_user_id = auth0_user.user_id

    def __setattr__(self, __name: str, __value: Any) -> None:
        if __name == "permissions":
            requested_permissions_names = __value
            for permission_name in requested_permissions_names:
                assert permission_name in Permission.ALL_PERMISSIONS
            self.permissions.set(
                [
                    # Lazy initialization of the permission objects
                    Permission.objects.get_or_create(name=permission_name)[0].pk
                    for permission_name in requested_permissions_names
                ]
            )
        else:
            return super().__setattr__(__name, __value)

    def update_auth0_user_without_permissions(self) -> None:
        if self.auth0_user:
            self.auth0_user.email = self.email
            self.auth0_user.name = self.name
            self.auth0_user.blocked = self.is_blocked
            self.auth0_user.is_temporary = self.is_temporary
        else:
            self.auth0_user = Auth0User(
                email=self.email,
                name=self.name,
                blocked=self.is_blocked,
            )
            self.auth0_user.is_temporary = self.is_temporary

    def update_auth0_user_permissions(self):
        self.auth0_user.permissions = {
            Auth0Permission(name=permission.name)
            for permission in self.permissions.all()
        }

    @classmethod
    def init_local_users_according_to_auth0_users(cls) -> None:
        auth0_users = Auth0User.getAllUsersFromAuth0()
        local_users = cls.objects.all()
        if local_users:
            logger.info(
                "Not going to create ay user - This method should be used before any user is being created locally, "
                "in order to have all auth0 users as a starting point"
            )
        else:
            cls.UPDATE_AUTH0_USER_DURING_SAVE = False
            for auth0_user in auth0_users:
                first_name, last_name = auth0_user.name.split(" ", 2)
                local_user = User(
                    auth0_user_id=auth0_user.user_id,
                    email=auth0_user.email,
                    first_name=first_name,
                    last_name=last_name,
                    is_active=not auth0_user.blocked,
                    is_temporary=auth0_user.is_temporary,
                    created_at=auth0_user.created_at,
                    last_login_update=timezone.now(),
                    last_login=auth0_user.last_login,
                )
                local_user.save()
                local_user.permissions = [
                    permission.name for permission in auth0_user.permissions
                ]
                local_user.save()
            logger.info(
                f"The following auth0 users was created locally:\n"
                f"{[local_user.get_details() for local_user in cls.objects.all()]}"
            )
            cls.UPDATE_AUTH0_USER_DURING_SAVE = True

    @classmethod
    def sync_auth0_and_local_users(cls) -> List[str]:
        auth0_users = Auth0User.getAllUsersFromAuth0()
        local_users = cls.objects.all()
        errors = []
        for auth0_user in auth0_users:
            auth0_user_id = auth0_user.user_id
            try:
                local_user = local_users.get(auth0_user_id=auth0_user_id)
                local_users = local_users.exclude(auth0_user_id=auth0_user_id)
                # Make sure the user data in auth0 is the same
                if (
                    local_user.email != auth0_user.email
                    or local_user.name != auth0_user.name
                    or local_user.is_temporary != auth0_user.is_temporary
                    or local_user.is_active == auth0_user.blocked
                ):
                    raise Exception(
                        f"""
                        User data mismatch!
                        \nLocal user: {local_user.get_details()}
                        \nauth0 user: {auth0_user.get_details()}
                    """
                    )
                # Make sure the permissions are also the same
                auth0_user_permissions_names = [
                    permission.name for permission in auth0_user.permissions
                ]
                local_user_permissions_names = [
                    permission.name for permission in local_user.permissions.all()
                ]
                if set(auth0_user_permissions_names) != set(
                    local_user_permissions_names
                ):
                    raise Exception(
                        f"""
                        User permissions mismatch!
                                    \nLocal user: {local_user_permissions_names}
                                    \nauth0 user: {auth0_user_permissions_names}"
                    """
                    )
                # Update last login
                if auth0_user.last_login != local_user.last_login:
                    local_user.last_login = auth0_user.last_login
                local_user.last_login_update = timezone.now()
                local_user.save()
            except Exception as e:
                errors.append(
                    f"{auth0_user.email}: Error while syncing user data: {e}\n"
                )

        # Checking for users that exist only locally
        if local_users:
            local_users_details = "\n".join(
                [str(local_user.get_details()) for local_user in local_users]
            )
            errors.append(
                f"The following users exist only locally:" f"\n{local_users_details}\n"
            )

        # Log errors
        logger.error(f"Errors while syncing auth0 users: {errors}")
        return errors

    @classmethod
    def delete_inactive_temporary_users(cls) -> List[str]:
        days = cls.DELETE_TEMP_USER_X_DAYS_POST_LAST_LOGIN.current_value
        users_to_delete = []
        if days:
            logger.debug(
                f"Going to delete temporary users that didn't logged in in the last {days} days"
            )
            temporary_users = cls.objects.filter(is_temporary=True)
            users_to_delete = (
                temporary_users.filter(
                    last_login__isnull=False,
                    last_login__lt=(timezone.now() + timedelta(days=-days)),
                )
                | temporary_users.filter(
                    last_login__isnull=True,
                    created_at__lt=(timezone.now() + timedelta(days=-days)),
                )
            ).distinct()
            for user in users_to_delete:
                user.auth0_user.delete()
                user.delete()
            logger.info(f"{len(users_to_delete)} users were deleted: {users_to_delete}")
        return [user.get_details() for user in users_to_delete]
