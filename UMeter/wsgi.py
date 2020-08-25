"""
WSGI config for UMeter project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Load .env file and populate os.getenv
env_file = os.path.join(BASE_DIR, '.env')
load_dotenv(env_file)

settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "UMeter.settings.production")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
