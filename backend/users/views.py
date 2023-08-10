from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import logging

from .utils import api_requires_scope, get_user
from .models import User, Permission
from .serializers import UserSerializer
from .permissions import *
from utils.httpMethod import HTTPMethod
from utils.apiExceptionHandler import api_exception_handler


logger = logging.getLogger(__name__)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@permission_classes([AllowAny])
def get_routes(request) -> Response:
    """
    Get all routes available for this module.

    Usage:
    GET /api/users/
    """
    routes = [
        "/api/users/list",
        "/api/users/create/",
        "/api/users/update/<email>",
    ]
    return Response(routes)


@api_exception_handler
@api_requires_scope(READ_USERS_PERMISSION)
@api_view([HTTPMethod.GET.name])
def get_users(request) -> Response:
    """
    Returns details of all the users.

    Usage:
    GET /api/users/list/
    """
    users = User.objects.all()
    seializer = UserSerializer(users, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(UPDATE_USERS_PERMISSION)
def update_user(request, pk) -> Response:
    """
    Update the user with the given data.
    The payload might include the following fields: first_name, last_name, email, is_active, is_temporary and permissions.

    Usage:
    POST /api/users/update/3
    {
        "first_name":"שחר",
        "last_name":"אוליבר",
        "email":"xxx@gmail.com",
        "is_active":true,
        "is_temporary":true,
        "permissions":["read:other_calls","add:my_calls","update:my_calls","read:my_calls","read:users","read:settings","add:other_calls"]
    }
    """
    request_user = get_user(request)
    user_to_update = User.objects.get(pk=pk)
    logger.debug(
        f"{request_user} request to update {user_to_update}."
        f"\nCurrent data: {user_to_update.get_details()}"
        f"\nRequest data: {request.data}"
    )
    for key, value in request.data.items():
        if (
            key not in User.UPDATEABLE_FIELDS
            and value != user_to_update.__getattribute__(key)
        ):
            raise Exception(f"The {key} of the user cannot be changed")
        setattr(user_to_update, key, value)
    user_to_update.save()
    logger.info(f"The user {user_to_update} was updated by {request_user}")
    seializer = UserSerializer(user_to_update, many=False)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(ADD_USERS_PERMISSION)
def create_user(request) -> Response:
    """
    Create a temporary active user with the given data.
    The payload should include the following fields: first_name, last_name and email.
    It might also include: is_active, is_temporary and permissions.

    Usage:
    POST /api/users/create/
    {
        "first_name":"שחר",
        "last_name":"אוליבר",
        "email":"xxx@gmail.com",
        "is_active":true,
        "is_temporary":true,
        "permissions":["read:my_calls","read:other_calls","read:users","read:settings","update:my_calls","add:my_calls"]
    }
    """
    request_user = get_user(request)
    logger.debug(
        f"{request_user} request to create a new user."
        f"\nRequest data: {request.data}"
    )
    for key in request.data.keys():
        if key not in User.UPDATEABLE_FIELDS:
            raise Exception(f"The {key} of the user cannot be changed")
    permissions = request.data.pop("permissions", None)
    new_user = User.objects.create(**request.data)
    new_user.save()
    if permissions:
        new_user.permissions = Permission.DEFAULT_PERMISSIONS
        new_user.save()
    logger.info(f"The user {new_user} was created by {request_user}")
    seializer = UserSerializer(new_user, many=False)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@authentication_classes([])
@permission_classes([])
def create_basic_user(request) -> Response:
    """
    Create a temporary active user with the given data.
    The payload should include the following fields: first_name, last_name and email.

    Usage:
    POST /api/users/create/basic/
    {
        "first_name":"שחר",
        "last_name":"אוליבר",
        "email":"xxx@gmail.com",
    }
    """
    logger.debug(
        f"A request to create a new temporary user was recieved."
        f"\nRequest data: {request.data}"
    )
    for key in request.data.keys():
        if key not in User.BASIC_UPDATEABLE_FIELDS:
            raise Exception(f"The {key} of the user cannot be changed")

    new_user = User.objects.create(**request.data, is_active=True, is_temporary=True)
    new_user.save()
    new_user.permissions = Permission.DEFAULT_PERMISSIONS
    new_user.save()
    logger.info(f"The user {new_user} was created")
    seializer = UserSerializer(new_user, many=False)
    return Response(seializer.data)
