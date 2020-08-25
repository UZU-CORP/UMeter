"""
ASGI config for UMeter project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Load .env file and populate os.getenv
env_file = os.path.join(BASE_DIR, '.env')
load_dotenv(env_file)

settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "UMeter.settings.production")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_asgi_application()
