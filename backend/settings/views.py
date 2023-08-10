from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import logging

from users.utils import api_requires_scope, get_user
from users.permissions import *
from utils.apiExceptionHandler import api_exception_handler
from utils.httpMethod import HTTPMethod
from .models import SystemSetting
from .serializers import SystemSettingSerializer


logger = logging.getLogger(__name__)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@permission_classes([AllowAny])
def get_routes(request) -> Response:
    """
    Get all routes available for this module.

    Usage:
    GET /api/settings/
    """
    routes = [
        "/api/settings/list",
        "/api/settings/update/<key>",
    ]
    return Response(routes)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@api_requires_scope(READ_SYSTEM_SETTINGS_PERMISSION)
def get_system_settings(request) -> Response:
    """
    Get a list of all the system settings and thier current values.

    Usage:
    GET /api/settings/list
    """
    systemSettings = SystemSetting.ALL_SETTINGS.values()
    seializer = SystemSettingSerializer(systemSettings, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(UPDATE_SYSTEM_SETTINGS_PERMISSION)
def update_setting(request, setting_key: str) -> Response:
    """
    Update the value of a system setting.add()

    Usage:
    POST /api/settings/update/DELETE_CALL_X_DAYS_POST_SCHEDULED_ORDER
    {"new_value":"40"}
    """
    system_setting: SystemSetting = SystemSetting.ALL_SETTINGS[setting_key]
    user = get_user(request)
    new_value_key = "new_value"
    if not request.data.keys() == [new_value_key]:
        logger.warning(
            f"System setting update request should include only the key {new_value_key}"
        )
    logger.debug(
        f"{user} request to update system setting: {system_setting.key}."
        f"\nCurrent value: {system_setting.current_value}"
        f"\nRequested value: {request.data[new_value_key]}"
    )
    system_setting.update_setting(new_value=request.data[new_value_key])
    logger.info(f"System setting {system_setting.key} was updated by {user}")
    seializer = SystemSettingSerializer(system_setting, many=False)
    return Response(seializer.data)
