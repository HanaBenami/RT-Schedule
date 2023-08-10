from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import logging

from .models import Call, Contact
from .serializers import CallSerializer
from users.models import User
from users.utils import api_requires_scope, has_scope, get_user, unauthorizedResponse
from users.permissions import *
from utils.apiExceptionHandler import api_exception_handler
from utils.httpMethod import HTTPMethod


logger = logging.getLogger(__name__)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@permission_classes([AllowAny])
def get_routes(request):
    """
    Get all routes available for this module.

    Usage:
    GET /api/calls/
    """
    routes = [
        "/api/calls/list",
        "/api/calls/update/<id>",
    ]
    return Response(routes)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@api_requires_scope(READ_MY_CALLS_PERMISSION)
def get_calls(request):
    """
    Get a list of all the calls in the database.
    If the user that sent the request has the relevant permission, he will get a list of all the calls, includes calls assigned to others.
    If not, he will get a list of only is own calls.

    Usage:
    GET /api/calls/list
    """
    calls = Call.objects.all()
    user = get_user(request)
    calls = (
        Call.objects.all()
        if has_scope(request, READ_OTHER_CALLS_PERMISSION)
        else Call.objects.filter(driver_email=user.email)
    )
    seializer = CallSerializer(calls, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(UPDATE_MY_CALLS_PERMISSION)
def update_call(request, external_id):
    """
    Update the call details.

    Usage:
    POST /api/calls/update/888
    {
        "external_id":888,
        "driver_notes":"סתם הערה",
        "is_done":false
    }
    """
    assert request.data.pop("external_id") == external_id
    call: Call = Call.objects.get(external_id=external_id)
    user = get_user(request)
    logger.debug(
        f"{user} request to update {call}."
        f"\nCurrent data: {call.get_details()}"
        f"\nRequest data: {request.data}"
    )

    if not (
        user == call.driverUser or has_scope(request, UPDATE_OTHER_CALLS_PERMISSION)
    ):
        return unauthorizedResponse(
            request=request,
            message="You don't have permission to update a call assigned to anotheruser",
        )

    for key, value in request.data.items():
        setattr(call, key, value)
    call.save()

    logger.info(f"{call} was updated by {user}")
    seializer = CallSerializer(call, many=False)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(ADD_MY_CALLS_PERMISSION)
def add_calls(request):
    """
    Add or update a batch of calls.

    Usage:
    POST /api/calls/add
    Payload example is available at add_calls_payload_example API.
    """

    user = get_user(request)
    requested_calls = request.data["calls"]
    logger.debug(f"{user} request to add calls." f"\nRequest data: {request.data}")

    if not has_scope(request, UPDATE_OTHER_CALLS_PERMISSION):
        drivers_email = set(
            [requested_call["driver_email"] for requested_call in requested_calls]
        )
        if any([driver_email != user.email for driver_email in drivers_email]):
            return unauthorizedResponse(
                request=request,
                message="You cannot add calls for others. Please use only your own email address.",
            )

    calls = []
    for requested_call in requested_calls:
        call = Call.objects.filter(external_id=requested_call["external_id"])
        requested_contacts = requested_call.pop("contacts")

        if call:
            call = call.first()
            for key, value in requested_call.items():
                setattr(call, key, value)
        else:
            call = Call(**requested_call)
        call.save()

        contacts = []
        for existing_contact in call.contacts.all():
            existing_contact.delete()
        for requested_contact in requested_contacts:
            contact = Contact(call=call, **requested_contact)
            contact.save()
            contacts.append(contact)
        call.contacts.set(contacts)

        calls.append(call)

    seializer = CallSerializer(calls, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@api_requires_scope(ADD_MY_CALLS_PERMISSION)
def add_calls_payload_example(request):
    """
    Get payload example for add_calls API.
    """

    payload_example = """
    {
        "calls": [{
            "external_id": 888,
            "customer": "אבי ובניו",
            "type": "טיפול שנתי",
            "description": "",
            "vehicle": "מכסת טורו '19",
            "address": "סוקולוב 60, הרצליה",
            "contacts": [{"name": "בני", "phone": "04-6490641"}, {"name": "אלי"}],
            "driver_email": "avi.cohen@gmail.com",
            "scheduled_date": "2023-08-03",
            "scheduled_order": 1
        }, {
            "external_id": 7,
            "customer": "ימית 2000",
            "type": "תקלה",
            "description": "לא מניע",
            "vehicle": "קלאבקאר",
            "address": "ימית 2000, חולון",
            "contacts": [{"name": "בני", "phone": "04-6490641"}],
            "driver_email": "avi.cohen@gmail.com",
            "scheduled_date": "2023-08-03",
            "scheduled_order": 2
        }]
    }
    """
    return Response(payload_example)
