from rest_framework.decorators import api_view, permission_classes
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
def getRoutes(request):
    routes = [
        "/api/users/list",
        "/api/users/create/",
        "/api/users/update/<email>",
    ]
    return Response(routes)


@api_exception_handler
@api_requires_scope(READ_USERS_PERMISSION)
@api_view([HTTPMethod.GET.name])
def getUsers(request):
    users = User.objects.all()
    seializer = UserSerializer(users, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(UPDATE_USERS_PERMISSION)
def updateUser(request, pk):
    request_user = get_user(request)
    user_to_update = User.objects.get(pk=pk)
    logger.debug(
        f"{request_user} request to update {user_to_update}."
        f"\nCurrent data: {user_to_update.list_user_details()}"
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
def createUser(request):
    request_user = get_user(request)
    logger.debug(
        f"{request_user} request to create a new user."
        f"\nRequest data: {request.data}"
    )
    for key in request.data.keys()():
        if key not in User.UPDATEABLE_FIELDS:
            raise Exception(f"The {key} of the user cannot be changed")
    new_user = User.objects.create(**request.data)
    new_user.save()
    logger.info(f"The user {new_user} was created by {request_user}")
    seializer = UserSerializer(new_user, many=False)
    return Response(seializer.data)
