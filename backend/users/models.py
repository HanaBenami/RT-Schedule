from typing import Any
from django.db import models
import requests
from http_constants.headers import HttpHeaders
from http_constants.status import HttpStatus
from django.utils import timezone
import json
import logging
from datetime import timedelta

from django.conf import settings
from . import permissions
from utils.httpMethod import HTTPMethod
from settings.models import SystemSetting

logger = logging.getLogger(__name__)


class Permission(models.Model):
    ALL_PERMISSIONS = permissions.ALL_PERMISSIONS
    DEFAULT_PERMISSIONS = list(
        filter(
            lambda permission: permission.lower().startswith("read"), ALL_PERMISSIONS
        )
    ) + [permissions.UPDATE_MY_CALLS_PERMISSION, permissions.ADD_MY_CALLS_PERMISSION]

    scope_name = models.CharField(max_length=100, null=False, blank=False, unique=True)

    def __str__(self):
        return self.scope_name


# TODO
class Auth0RemoteUser:
    def __init__(self) -> None:
        pass


class User(models.Model):
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

    TEMPORARY_USER_ROLE_NAME = "TemporaryUser"
    TEMPORARY_USER_ROLE_ID = None
    DELETE_TEMP_USER_X_DAYS_POST_LAST_LOGIN = SystemSetting(
        key="DELETE_TEMP_USER_X_DAYS_POST_LAST_LOGIN",
        default_value=7,
        description="כמה ימים אחרי ההתחברות האחרונה יש למחוק משתמש זמני? (0 = לעולם לא)",
    )

    remote_user_id = models.CharField(
        max_length=100, null=True, blank=True, unique=True
    )
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
    def is_blocked(self):
        return not self.is_active

    @property
    def nickname(self):
        return f"{self.first_name} {self.last_name}"

    def __setattr__(self, __name: str, __value: Any) -> None:
        if __name == "permissions":
            for scope_name in __value:
                assert scope_name in Permission.ALL_PERMISSIONS
            self.permissions.set(
                [
                    Permission.objects.get_or_create(scope_name=scope_name)[0].pk
                    for scope_name in __value  # Lazy initialization of the permission objects
                ]
            )
        else:
            return super().__setattr__(__name, __value)

    def __str__(self):
        return self.nickname

    def list_user_details(self):
        return {
            key: value
            for (key, value) in self.__dict__.items()
            if not key.startswith("_")
        }

    @classmethod
    def __getRemoteUsersApiAccessToken(cls):
        headers = {
            HttpHeaders.CONTENT_TYPE: "application/x-www-form-urlencoded",
        }
        data = {
            "grant_type": "client_credentials",
            "client_id": settings.JWT_AUTH["MANAGMENT_API_CLIENT_ID"],
            "client_secret": settings.JWT_AUTH["MANAGMENT_API_CLIENT_SECRET"],
            "audience": f"{settings.JWT_AUTH['JWT_ISSUER']}api/v2/",
        }
        url = f"{settings.JWT_AUTH['JWT_ISSUER']}oauth/token"
        response = requests.request(
            method=HTTPMethod.POST.name,
            headers=headers,
            data="&".join([f"{key}={value}" for (key, value) in data.items()]),
            url=url,
        )
        return response.json()["access_token"]

    @classmethod
    def __executeRemoeUsersApiRequest(
        cls,
        httpMethod: HTTPMethod,
        urlSuffix: str,
        data: dict = None,
        expectedStatusCodes: list = [
            HttpStatus.OK,
            HttpStatus.CREATED,
            HttpStatus.ACCEPTED,
            HttpStatus.NO_CONTENT,
        ],
    ):
        url = f"{settings.JWT_AUTH['JWT_ISSUER']}api/v2/{urlSuffix}"
        request = {
            "method": httpMethod.name,
            "data": json.dumps(data) if data else None,
            "url": url,
        }
        logger.debug(f"Auth0 API request: {request}")
        headers = {
            HttpHeaders.CONTENT_TYPE: "application/json",
            HttpHeaders.AUTHORIZATION: f"Bearer {cls.__getRemoteUsersApiAccessToken()}",
        }
        request["headers"] = headers
        response = requests.request(**request)
        logger.debug(f"Auth0 API response: {response.__dict__}")
        if response.status_code not in expectedStatusCodes:
            raise Exception(response.reason)
        return response

    @classmethod
    def getRemoteUsers(cls):
        fields = [
            "user_id",
            "email",
            "name",
            "last_login",
            "created_at",
            "blocked",
        ]
        urlSuffix = f"users?fields={','.join(fields)}"
        return cls.__executeRemoeUsersApiRequest(HTTPMethod.GET, urlSuffix).content

    def getRemoteUserPermissions(self):
        urlSuffix = f"users/{self.remote_user_id}/permissions"
        return self.__executeRemoeUsersApiRequest(HTTPMethod.GET, urlSuffix).content

    def getRemoteUserRoles(self):
        urlSuffix = f"users/{self.remote_user_id}/roles"
        return [
            role["name"]
            for role in self.__executeRemoeUsersApiRequest(
                HTTPMethod.GET, urlSuffix
            ).json()
        ]

    @classmethod
    def initRemoteUsers(cls):
        remote_users = json.loads(cls.getRemoteUsers())
        local_users = cls.objects.all()
        if local_users:
            logger.info(
                "Not going to create ay user - This method should be used before any user is being created locally, "
                "in order to have all the remote users as a starting point"
            )
        else:
            cls.UPDATE_AUTH0_USER_DURING_SAVE = False
            for remote_user in remote_users:
                first_name, last_name = remote_user["name"].split(" ", 2)
                local_user = User(
                    remote_user_id=remote_user["user_id"],
                    email=remote_user["email"],
                    first_name=first_name,
                    last_name=last_name,
                    is_active=not remote_user["blocked"],
                    created_at=remote_user["created_at"],
                    last_login_update=timezone.now(),
                    last_login=(
                        remote_user["last_login"]
                        if "last_login" in remote_user
                        else None
                    ),
                )
                local_user.save()
                local_user.is_temporary = (
                    cls.TEMPORARY_USER_ROLE_NAME in local_user.getRemoteUserRoles()
                )
                local_user.save()
                local_user.permissions = [
                    permission["permission_name"]
                    for permission in json.loads(local_user.getRemoteUserPermissions())
                ]
                local_user.save()
            logger.info(
                f"The following remote users was created locally:\n"
                f"{[local_user.list_user_details() for local_user in cls.objects.all()]}"
            )
            cls.UPDATE_AUTH0_USER_DURING_SAVE = True

    @classmethod
    def syncRemoteUsers(cls):
        remote_users = json.loads(cls.getRemoteUsers())
        local_users = cls.objects.all()
        errors = []
        for remote_user in remote_users:
            remote_user_id = remote_user["user_id"]
            try:
                local_user = local_users.get(remote_user_id=remote_user_id)
                local_users = local_users.exclude(remote_user_id=remote_user_id)
                # Make sure the user data in auth0 is the same
                if (
                    local_user.email != remote_user["email"]
                    or local_user.nickname != remote_user["name"]
                    or local_user.is_active == remote_user["blocked"]
                ):
                    raise Exception(
                        f"User data mismatch!\nLocal user: {local_user.list_user_details()}\nRemote user: {remote_user}"
                    )
                # Make sure the permissions are also the same
                remote_user_permissions = [
                    permission["permission_name"]
                    for permission in json.loads(local_user.getRemoteUserPermissions())
                ]
                local_user_permissions = [
                    permission.scope_name for permission in local_user.permissions.all()
                ]
                if set(local_user_permissions) != set(remote_user_permissions):
                    raise Exception(
                        f"User permissions mismatch!\nLocal user: {local_user_permissions}\nRemote user: {remote_user_permissions}"
                    )
                # Update last login
                if "last_login" in remote_user:
                    local_user.last_login = remote_user["last_login"]
                local_user.last_login_update = timezone.now()
                local_user.save()
            except Exception as e:
                errors.append(
                    f"{remote_user['email']}: Error while syncing user data: {e}\n"
                )

        # Checking for users that exist only locally
        if local_users:
            local_users_details = "\n".join(
                [str(local_user.list_user_details()) for local_user in local_users]
            )
            errors.append(
                f"The following users exist only locally:" f"\n{local_users_details}\n"
            )

        # Log errors
        logger.error(f"Errors while syncing remote users: {errors}")
        return errors

    @classmethod
    def deleteInactiveTemporaryUsers(cls):
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
                user.deleteRemoteUser()
                user.delete()
                pass
            logger.info(f"{len(users_to_delete)} users were deleted: {users_to_delete}")
        return [user.list_user_details() for user in users_to_delete]

    def deleteRemoteUser(self):
        urlSuffix = f"users/{self.remote_user_id}"
        response = self.__executeRemoeUsersApiRequest(HTTPMethod.DELETE, urlSuffix)
        return response

    def updateRemoteUser(self):
        data = {
            "connection": "email",
            "email": self.email,
            "email_verified": True,
            "name": self.nickname,
            "blocked": self.is_blocked,
        }
        urlSuffix = "users"
        if self.remote_user_id is None:
            response = self.__executeRemoeUsersApiRequest(
                HTTPMethod.POST, urlSuffix, data
            )
        else:
            urlSuffix += f"/{self.remote_user_id}"
            response = self.__executeRemoeUsersApiRequest(
                HTTPMethod.PATCH, urlSuffix, data
            )
        return response

    def updateRemoteUserPermissions(self):
        response = None
        for i in range(2):  # delete all the permissions => assign permissions again
            data = {
                "permissions": [
                    {
                        "resource_server_identifier": settings.JWT_AUTH["JWT_AUDIENCE"],
                        "permission_name": permission,
                    }
                    for permission in (
                        Permission.ALL_PERMISSIONS
                        if i == 0
                        else [
                            permission.scope_name
                            for permission in self.permissions.all()
                        ]
                    )
                ]
            }
            urlSuffix = f"users/{self.remote_user_id}/permissions"
            response = self.__executeRemoeUsersApiRequest(
                HTTPMethod.DELETE if i == 0 else HTTPMethod.POST, urlSuffix, data
            )
            if not self.permissions.all():
                break
        return response

    @classmethod
    def getRemoteUsersRoles(cls):
        urlSuffix = "roles"
        response = cls.__executeRemoeUsersApiRequest(HTTPMethod.GET, urlSuffix)
        return response.json()

    def updateRemoteUserIsTemporary(self):
        if not self.TEMPORARY_USER_ROLE_ID:
            roles = self.getRemoteUsersRoles()
            self.TEMPORARY_USER_ROLE_ID = [
                role for role in roles if role["name"] == "TemporaryUser"
            ][0]["id"]

        response = None
        data = {"roles": [self.TEMPORARY_USER_ROLE_ID]}
        urlSuffix = f"users/{self.remote_user_id}/roles"
        response = self.__executeRemoeUsersApiRequest(
            HTTPMethod.POST if self.is_temporary else HTTPMethod.DELETE, urlSuffix, data
        )
        return response
