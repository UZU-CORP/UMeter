from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings

def ensure_signed_in(func):
    """A decorator to ensure that a session is active before attempting any sensitive operation."""
    def decorated_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        return JsonResponse({
            "status": False,
            "error": "Not signed in"
        }, status=401)
    return decorated_func

def ensure_superuser(func):
    """A decorator to ensure that a superuser is active is active before attempting any sensitive operations."""
    def decorated_func(request, *args, **kwargs):
        if request.user.is_superuser and request.user.is_authenticated:
            return func(request, *args, **kwargs)
        return JsonResponse({
            "status": False,
            "error": "This is not a superuser account"
        }, status=403)
    return decorated_func

def ensure_staff(func):
    """A decorator to ensure that a staff or a superuser is active before attempting privileged operations."""
    def decorated_func(request, *args, **kwargs):
        if request.user.is_staff and request.user.is_authenticated:
            return func(request, *args, **kwargs)
        if request.user.is_superuser and request.user.is_authenticated:
            return func(request, *args, **kwargs)
        return JsonResponse({
            "status": False,
            "error": "This is not a staff account"
        }, status=403)
    return decorated_func

