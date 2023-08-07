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
def getRoutes(request):
    routes = [
        "/api/calls/list",
        "/api/calls/update/<id>",
    ]
    return Response(routes)


@api_exception_handler
@api_view([HTTPMethod.GET.name])
@api_requires_scope(READ_MY_CALLS_PERMISSION)
def getCalls(request):
    calls = Call.objects.all()
    user = get_user(request)
    calls = (
        Call.objects.all()
        if has_scope(request, READ_OTHER_CALLS_PERMISSION)
        else Call.objects.filter(driverEmail=user.email)
    )
    seializer = CallSerializer(calls, many=True)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(UPDATE_MY_CALLS_PERMISSION)
def updateCall(request, externalId):
    assert request.data.pop("externalId") == externalId
    call: Call = Call.objects.get(externalId=externalId)
    user = get_user(request)
    logger.debug(
        f"{user} request to update {call}."
        f"\nCurrent data: {call.list_call_details()}"
        f"\nRequest data: {request.data}"
    )
    if not (
        user == call.driverUser or has_scope(request, UPDATE_OTHER_CALLS_PERMISSION)
    ):
        return unauthorizedResponse()
    for key, value in request.data.items():
        setattr(call, key, value)
    call.save()
    logger.info(f"{call} was updated by {user}")
    seializer = CallSerializer(call, many=False)
    return Response(seializer.data)


@api_exception_handler
@api_view([HTTPMethod.POST.name])
@api_requires_scope(ADD_MY_CALLS_PERMISSION)
def addCalls(request):
    """
    {
        "calls": [{
            "externalId": 888,
            "customer": "אבי ובניו",
            "type": "טיפול שנתי",
            "description": "",
            "vehicle": "מכסת טורו '19",
            "address": "סוקולוב 60, הרצליה",
            "contacts": [{"name": "בני", "phone": "04-6490641"}, {"name": "אלי"}],
            "driverEmail": "avi.cohen@gmail.com",
            "scheduledDate": "2023-08-03",
            "scheduledOrder": 1
        }, {
            "externalId": 7,
            "customer": "ימית 2000",
            "type": "תקלה",
            "description": "לא מניע",
            "vehicle": "קלאבקאר",
            "address": "ימית 2000, חולון",
            "contacts": [{"name": "בני", "phone": "04-6490641"}],
            "driverEmail": "avi.cohen@gmail.com",
            "scheduledDate": "2023-08-03",
            "scheduledOrder": 2
        }]
    }
    """

    user = get_user(request)
    requested_calls = request.data["calls"]
    logger.debug(f"{user} request to add calls." f"\nRequest data: {request.data}")

    if not has_scope(request, UPDATE_OTHER_CALLS_PERMISSION):
        drivers_email = set(
            [requested_call["driverEmail"] for requested_call in requested_calls]
        )
        if any([driver_email != user.email for driver_email in drivers_email]):
            return unauthorizedResponse()

    calls = []
    for requested_call in requested_calls:
        call = Call.objects.filter(externalId=requested_call["externalId"])
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
def addCallsPayloadExample(request):
    return Response(addCalls.__doc__)
