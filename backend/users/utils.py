from django.contrib.auth import authenticate
from functools import wraps
from django.http import JsonResponse
import jwt
import json
import requests

from django.conf import settings
from users.models import User


def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    issuer = settings.JWT_AUTH["JWT_ISSUER"]

    jwks = requests.get(f"{issuer}.well-known/jwks.json").json()
    public_key = None
    for jwk in jwks["keys"]:
        if jwk["kid"] == header["kid"]:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception("Public key not found.")

    return jwt.decode(
        token,
        public_key,
        audience=settings.JWT_AUTH["JWT_AUDIENCE"],
        issuer=issuer,
        algorithms=["RS256"],
    )


def jwt_get_username_from_payload_handler(payload):
    username = payload.get("sub").replace("|", ".")
    authenticate(remote_user=username)
    return username


def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]
    return token


def decode_token(request):
    token = get_token_auth_header(request)
    return jwt.decode(token, verify=False)


def get_user(request):
    return User.objects.get(remote_user_id=decode_token(request)["sub"])


def has_scope(request, required_scope):
    """Checks if the user that send the request has the required scope"""
    try:
        decoded = decode_token(request)
        if decoded.get("scope"):
            token_scopes = decoded["scope"].split()
        for token_scope in token_scopes:
            if token_scope == required_scope:
                return True
        return False
    except:
        return False


def unauthorizedResponse():
    response = JsonResponse({"message": "You don't have access to this resource"})
    response.status_code = 403
    return response


def api_requires_scope(required_scope):
    """
    Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """

    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            request = args[0]
            if has_scope(request, required_scope):
                return f(*args, **kwargs)
            else:
                return unauthorizedResponse()

        return decorated

    return require_scope
