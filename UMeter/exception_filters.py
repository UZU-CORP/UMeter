from rest_framework.views import exception_handler
from rest_framework.serializers import ValidationError

def validation_error_handler(response, exc):
    if not response:
        return response
    response_data = {'status': False, 'error': exc.detail}
    response.data = response_data
    return response

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    if isinstance(exc, ValidationError):
        return validation_error_handler(response, exc)
    # Now add the HTTP status code to the response.
    if response is not None: 
    	response.data['status'] = False
    	response.data['error'] = response.data.pop("detail", None)

    return response