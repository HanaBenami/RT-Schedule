import requests
from http_constants.headers import HttpHeaders
from http_constants.status import HttpStatus
from datetime import datetime
from collections import defaultdict
from functools import lru_cache
from typing import List, Set
import dataclasses
import json
import logging

from django.conf import settings
from utils.httpMethod import HTTPMethod
from utils.nameable import Nameable

logger = logging.getLogger(__name__)


def getApiAccessToken() -> str:
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


def executeApiRequest(
    httpMethod: HTTPMethod,
    urlSuffix: str,
    data: dict = None,
    expectedStatusCodes: List[HttpStatus] = [
        HttpStatus.OK,
        HttpStatus.CREATED,
        HttpStatus.ACCEPTED,
        HttpStatus.NO_CONTENT,
    ],
) -> requests.Response:
    url = f"{settings.JWT_AUTH['JWT_ISSUER']}api/v2/{urlSuffix}"
    request = {
        "method": httpMethod.name,
        "data": json.dumps(data) if data else None,
        "url": url,
    }
    logger.debug(f"Auth0 API request: {request}")
    headers = {
        HttpHeaders.CONTENT_TYPE: "application/json",
        HttpHeaders.AUTHORIZATION: f"Bearer {getApiAccessToken()}",
    }
    request["headers"] = headers
    response = requests.request(**request)
    logger.debug(f"Auth0 API response: {response.__dict__}")
    if response.status_code not in expectedStatusCodes:
        raise Exception(response.reason)
    return response


@dataclasses.dataclass(frozen=True)
class Auth0Permission(Nameable):
    name: str

    @classmethod
    def deserialize(cls, permission_data):
        return cls(name=permission_data["permission_name"])


@dataclasses.dataclass(frozen=True)
class Auth0Role(Nameable):
    name: str
    id: str

    @classmethod
    def deserialize(cls, role_data):
        return cls(id=role_data["id"], name=role_data["name"])

    @classmethod
    @lru_cache()
    def getAllAvailableRoles(cls) -> List["Auth0Role"]:
        urlSuffix = "roles"
        response = executeApiRequest(HTTPMethod.GET, urlSuffix)
        return [cls.deserialize(role_data) for role_data in response.json()]

    @classmethod
    @lru_cache()
    def getRoleByName(cls, name: str) -> "Auth0Role":
        return next(
            filter(lambda role: role.name == name, cls.getAllAvailableRoles()), None
        )

    @classmethod
    @property
    @lru_cache()
    def TEMPORARY_USER_ROLE(cls) -> "Auth0Role":
        return cls.getRoleByName("TemporaryUser")


@dataclasses.dataclass
class Auth0User(Nameable):
    _email: str
    _name: str
    _blocked: bool = False
    _user_id: str = None
    _created_at: datetime = None
    _last_login: datetime = None

    def __init__(
        self,
        email: str,
        name: str,
        blocked: bool = False,
        user_id: str = None,
        created_at: datetime = None,
        last_login: datetime = None,
    ):
        self._email = email
        self._name = name
        self._blocked = blocked
        self._user_id = user_id
        self._created_at = created_at
        self._last_login = last_login
        if self.user_id is None:
            self.__commit_user_creation_to_auth0()

    @classmethod
    def deserialize(cls, user_data):
        return cls(**user_data)

    @classmethod
    def getAllUsersFromAuth0(cls) -> List["Auth0User"]:
        fields = dataclasses.fields(cls)
        urlSuffix = f"users?fields={','.join([field.name.replace('_', '', 1) for field in fields])}"
        response = executeApiRequest(HTTPMethod.GET, urlSuffix).json()
        users = [cls.deserialize(user_data) for user_data in response]
        return users

    @classmethod
    def getUserFromAuth0(cls, user_id: str) -> "Auth0User":
        return next(
            filter(lambda user: user.user_id == user_id, cls.getAllUsersFromAuth0()),
            None,
        )

    @property
    def user_id(self) -> str:
        return self._user_id

    @user_id.setter
    def user_id(self, new_value: str) -> None:
        self._user_id = new_value

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, new_value: str) -> None:
        self.__field_setter_impl("email", new_value)

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, new_value: str) -> None:
        self.__field_setter_impl("name", new_value)

    @property
    def blocked(self) -> bool:
        return self._blocked

    @blocked.setter
    def blocked(self, new_value: bool) -> None:
        self.__field_setter_impl("blocked", new_value)

    @property
    def created_at(self) -> datetime:
        return self._created_at

    @property
    def last_login(self) -> str:
        return self._last_login

    @property
    def permissions(self) -> Set[Auth0Permission]:
        urlSuffix = f"users/{self.user_id}/permissions"
        return {
            Auth0Permission.deserialize(permission_data)
            for permission_data in executeApiRequest(HTTPMethod.GET, urlSuffix).json()
        }

    @permissions.setter
    def permissions(self, new_permissions: Set[Auth0Permission]) -> None:
        current_permissions = self.permissions
        permissions_to_delete: Set[Auth0Role] = current_permissions - new_permissions
        permissions_to_add: Set[Auth0Role] = new_permissions - current_permissions

        permissions_changes = {
            HTTPMethod.DELETE: permissions_to_delete,
            HTTPMethod.POST: permissions_to_add,
        }
        for httpMethod, permissions in permissions_changes.items():
            if permissions:
                data = {
                    "permissions": [
                        {
                            "resource_server_identifier": settings.JWT_AUTH[
                                "JWT_AUDIENCE"
                            ],
                            "permission_name": permission.name,
                        }
                        for permission in permissions
                    ]
                }
                urlSuffix = f"users/{self.user_id}/permissions"
                executeApiRequest(httpMethod, urlSuffix, data)

    @property
    def roles(self) -> Set[Auth0Role]:
        urlSuffix = f"users/{self.user_id}/roles"
        return {
            Auth0Role.deserialize(role_data)
            for role_data in executeApiRequest(HTTPMethod.GET, urlSuffix).json()
        }

    @roles.setter
    def roles(self, new_roles: Set[Auth0Role]) -> None:
        current_roles = self.roles
        roles_to_delete: Set[Auth0Role] = current_roles - new_roles
        roles_to_add: Set[Auth0Role] = new_roles - current_roles

        roles_changes = {
            HTTPMethod.DELETE: roles_to_delete,
            HTTPMethod.POST: roles_to_add,
        }
        for httpMethod, roles in roles_changes.items():
            if roles:
                data = {"roles": [role.id for role in roles]}
                urlSuffix = f"users/{self.user_id}/roles"
                executeApiRequest(httpMethod, urlSuffix, data)

    @property
    def is_temporary(self) -> bool:
        return Auth0Role.TEMPORARY_USER_ROLE in self.roles

    @is_temporary.setter
    def is_temporary(self, is_temporary: bool) -> None:
        if is_temporary:
            self.roles = self.roles.union({Auth0Role.TEMPORARY_USER_ROLE})
        else:
            self.roles = self.roles.difference({Auth0Role.TEMPORARY_USER_ROLE})

    def __commit_user_creation_to_auth0(self) -> None:
        assert self.user_id is None
        data = {
            "connection": "email",
            "email_verified": True,
            "email": self.email,
            "name": self.name,
            "blocked": self.blocked,
        }
        urlSuffix = "users"
        response = executeApiRequest(HTTPMethod.POST, urlSuffix, data)
        self.user_id = response.json()["user_id"]

    def __field_setter_impl(self, field, new_value) -> None:
        if self.__getattribute__(field) != new_value:
            self.__setattr__(f"_{field}", new_value)
            self.__commit_field_change_to_auth0(field, new_value)

    def __commit_field_change_to_auth0(self, field, new_value) -> None:
        assert self.user_id is not None
        data = {field: new_value}
        urlSuffix = f"users/{self.user_id}"
        executeApiRequest(HTTPMethod.PATCH, urlSuffix, data)

    def delete(self) -> None:
        urlSuffix = f"users/{self.user_id}"
        executeApiRequest(HTTPMethod.DELETE, urlSuffix)
