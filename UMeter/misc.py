from rest_framework.authentication import SessionAuthentication

class CSRFExemptSessionAuth(SessionAuthentication):
    def enforce_csrf(self, request):
        return 

