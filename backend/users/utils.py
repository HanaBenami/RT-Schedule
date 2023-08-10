from django.contrib.auth import authenticate
from functools import wraps
from django.http import JsonResponse
from typing import Mapping, Callable
import jwt
import json
import requests
import logging

from django.conf import settings
from users.models import User

logger = logging.getLogger(__name__)


def jwt_decode_token(token: str) -> Mapping:
    """Returns a decoded access token"""
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


def jwt_get_username_from_payload_handler(payload: Mapping) -> str:
    """Returns a username from authorization header"""
    username = payload.get("sub").replace("|", ".")
    authenticate(remote_user=username)
    return username


def get_token_auth_header(request: requests.Request) -> str:
    """Obtains the access token from the authorization header"""
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]
    return token


def decode_token(request: requests.Request) -> Mapping:
    """Returns a decoded access token from authorization header"""
    token = get_token_auth_header(request)
    return jwt.decode(token, verify=False)


def get_user(request: requests.Request) -> User:
    """Returns the user that send the request"""
    return User.objects.get(auth0_user_id=decode_token(request)["sub"])


def has_scope(request: requests.Request, required_scope: str) -> bool:
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


def unauthorizedResponse(
    request: requests.Request, message: str = None
) -> requests.Response:
    """
    Returns a suitable response with the mentioned message
    """
    message = (
        "You don't have access to this resource" + f": {message}" if message else ""
    )
    logger.warning(
        f"Unauthrized request was done by {get_user(request=request)}. The response: {message}"
    )
    response = JsonResponse({"message": message})
    response.status_code = 403
    return response


def api_requires_scope(required_scope: str) -> Callable:
    """
    Determines if the required scope is present in the Access Token
    """

    def require_scope(f: Callable):
        @wraps(f)
        def decorated(*args, **kwargs):
            request = args[0]
            if has_scope(request, required_scope):
                return f(*args, **kwargs)
            else:
                return unauthorizedResponse(request=request)

        return decorated

    return require_scope
