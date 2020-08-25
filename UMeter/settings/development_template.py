from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': os.getenv("DB_NAME"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'USER': os.getenv("DB_USER"),
        'HOST': os.getenv("DB_HOST", 'localhost'),
        'PORT': os.getenv("DB_PORT", 3306),
    }
}

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

INSTALLED_APPS.append("webpack_loader")

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': DEBUG,
        'STATS_FILE': os.path.join(FRONTEND_DIR, 'webpack-stats.json'),
    }
}