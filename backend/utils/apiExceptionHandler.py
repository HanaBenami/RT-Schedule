from functools import wraps
from django.http import JsonResponse
from traceback import format_exc
from typing import Callable


def api_exception_handler(f: Callable) -> Callable:
    """
    Catch any exception an return appropriate API response, in JSON format.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            response = JsonResponse({"message": f"{type(e).__name__}: {str(e)}"})
            response.status_code = 400
            return response

    return decorated
