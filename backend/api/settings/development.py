import os

from decimal import Decimal
from datetime import timedelta

import environ

from corsheaders.defaults import default_headers

from .base import *  # noqa: F403


# ==========================================================
# ENVIRONMENT - config environment (django-environ) plugins
# ==========================================================
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, True),
    DJANGO_ENV=(str, 'development'),
)

USE_DECIMAL_SEPARATOR = True
DECIMAL_SEPARATOR = ','
USE_THOUSAND_SEPARATOR = True
THOUSAND_SEPARATOR = '.'
APPEND_SLASH = True
SECURE_BROWSER_XSS_FILTER = True

# read env file
# Path to /backend
root_path = environ.Path(__file__) - 3
environ.Env.read_env(root_path('.env'))

DEBUG = env.bool('DJANGO_DEBUG', default=True)

SECRET_KEY = env('DJANGO_SECRET_KEY')

# ==========================================================
# APPS - config django apps
# ==========================================================
THIRD_PARTY_APPS = [
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'django_filters',
    'drf_yasg',
]

PROJECT_APPS = [
    'apps.accounts',
    'apps.trip',
]

INSTALLED_APPS = BASE_APPS + THIRD_PARTY_APPS + PROJECT_APPS  # noqa: F405

# ==========================================================
# MIDDLEWARE - config django middleware
# ==========================================================
APP_MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]
MIDDLEWARE = APP_MIDDLEWARE + BASE_MIDDLEWARE  # noqa: F405

# ==========================================================
# DATABASE - config database for django
# ==========================================================
# DATABASES = {
#     'default': {
#         'ENGINE': env('DB_ENGINE'),
#         'NAME': env('DB_NAME'),
#         'USER': env('DB_USER'),
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST'),
#         'PORT': env('DB_PORT'),
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',  # noqa: F405
    }
}

# ==========================================================
# REDIRECT URL - django redirect url
# ==========================================================
LOGIN_URL = '/auth/login/'
LOGIN_REDIRECT_URL = '/app/'
LOGOUT_REDIRECT_URL = '/'

# ==========================================================
# LOGGING - config django logging (.env)
# ==========================================================
LOGS_ROOT = os.path.join(root_path, env('DJANGO_LOGS_ROOT'))
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console_format': {
            'format': '%(name)-12s %(levelname)-8s %(message)s',
        },
        'file_format': {
            'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
            'datefmt': '%Y-%m-%d_%H:%M:%S',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'console_format',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': os.path.join(LOGS_ROOT, 'django.log'),
            'when': 'midnight',  # specify the type of interval
            'interval': 1,
            'backupCount': 7,  # number of backup files to keep
            'encoding': 'utf8',
            'formatter': 'file_format',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'propagate': True,
        },
        'django.request': {
            'level': 'INFO',
            'handlers': ['console', 'file'],
            'propagate': False,
        },
    },
}

# ==========================================================
# CORS - Cross-Origin Resource Sharing
# ==========================================================
# If this is used then `CORS_ALLOWED_ORIGINS` will not have any effect
ALLOWED_HOSTS = env.list(
    'DJANGO_ALLOWED_HOSTS',
    default=[
        'localhost',
        '127.0.0.1',
        '.vercel.app',
    ],
)
CORS_ALLOWED_ORIGINS = env.list('DJANGO_CORS_ORIGINS', default=['*'])
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = (*default_headers, 'Access-Control-Allow-Origin')

# ==========================================================
# CSRF - Cross-Origin Resource Sharing
# ==========================================================
CSRF_TRUSTED_ORIGINS = env.list('DJANGO_CORS_ORIGINS', default=['*'])
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'  # Lax
CSRF_COOKIE_DOMAIN = env('DJANGO_COOKIE_DOMAIN', default='localhost')
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'  # Lax
SESSION_COOKIE_DOMAIN = env('DJANGO_COOKIE_DOMAIN', default='localhost')

# ==========================================================
# REST FRAMEWORK - config for rest api
# ==========================================================
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'api.exceptions.exception_handler.custom_exception',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'api.utils.pagination.CustomPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        # 'api.renderers.api_renderers.ApiRenderer',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/minute',
        'user': '10000/day',
        'dj_rest_auth': '100/minute',
    },
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'TEST_REQUEST_RENDERER_CLASSES': [
        'rest_framework.renderers.MultiPartRenderer',
        'rest_framework.renderers.JSONRenderer',
        # 'api.renderers.api_renderers.ApiRenderer',
    ],
}


# ==========================================================
# SIMPLE JWT - config for rest framework simple jwt
# ==========================================================
ACCESS_TOKEN_EXP_MINUTES = env('ACCESS_TOKEN_EXP_MINUTES', default=5)
REFRESH_TOKEN_EXP_DAYS = env('REFRESH_TOKEN_EXP_DAYS', default=7)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=ACCESS_TOKEN_EXP_MINUTES),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=REFRESH_TOKEN_EXP_DAYS),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# ==========================================================
# DJ REST AUTH - dj-rest-auth config
# ==========================================================
REST_AUTH = {
    'PASSWORD_RESET_USE_SITES_DOMAIN': False,
    'OLD_PASSWORD_FIELD_ENABLED': False,
    'LOGOUT_ON_PASSWORD_CHANGE': False,
    'SESSION_LOGIN': True,
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': env('JWT_AUTH_COOKIE', default='access'),
    'JWT_AUTH_REFRESH_COOKIE': env('JWT_AUTH_REFRESH_COOKIE', default='refresh'),
    'JWT_AUTH_SECURE': True,
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SAMESITE': 'None',  # Lax
    'JWT_AUTH_RETURN_EXPIRATION': False,
    'JWT_AUTH_COOKIE_USE_CSRF': False,
    'JWT_AUTH_COOKIE_ENFORCE_CSRF_ON_UNAUTHENTICATED': False,
    'USER_DETAILS_SERIALIZER': 'apps.accounts.serializers.user_serializer.UserAuthSerializer',  # noqa: E501
}


# ==========================================================
# DJANGO ALLAUTH - config django all auth
# ==========================================================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_USERNAME_MIN_LENGTH = 4
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False

# ==========================================================
# AUTH - config django custom auth user model & backend
# ==========================================================
AUTH_USER_MODEL = 'accounts.User'
AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]

# ==========================================================
# MEDIA - Meda files for images
# ==========================================================
MEDIA_URL = '/media/'
UPLOADS_URL = MEDIA_URL + 'uploads'
COMPRESSED_URL = MEDIA_URL + 'compressed'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # noqa: F405
UPLOADS_ROOT = os.path.join(MEDIA_ROOT, 'uploads')
COMPRESSED_ROOT = os.path.join(MEDIA_ROOT, 'compressed')

# not used maybe?
IMAGE_WEBP_ROOT = os.path.join(MEDIA_ROOT, 'webp')
IMAGE_THUMB_ROOT = os.path.join(MEDIA_ROOT, 'thumbnail')

# ==========================================================
# SITE - Django site settings
# ==========================================================
DJANGO_HASHIDS_MIN_LENGTH = env('MIN_SALT_LENGTH', default=12)
SITE_ID = 1

# ==========================================================
# IMAGE TYPES - accept only certain filetype for image uploads
# ==========================================================
VALID_IMAGE_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'svg',
    'gif',
    'bmp',
]
MAX_UPLOAD_SIZE = env('DJANGO_MAX_UPLOAD_SIZE', default=5242880)

# ==========================================================
# SWAGGER settings
# ==========================================================
SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,
    'SECURITY_DEFINITIONS': {
        'Basic': {'type': 'basic'},
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
        },
    },
}

# ==========================================================
# UTILS
# ==========================================================
ORS_API_KEY = env('ORS_API_KEY')

# FMCSA HOS Rules for Property-Carrying Drivers
MAX_DRIVING_HOURS_PER_DAY = Decimal('11.0')
MAX_ON_DUTY_HOURS_PER_DAY = Decimal('14.0')
REQUIRED_OFF_DUTY_HOURS = Decimal('10.0')
REQUIRED_BREAK_AFTER_HOURS = Decimal('8.0')
REQUIRED_BREAK_DURATION = Decimal('0.5')
MAX_CYCLE_HOURS = Decimal('70.0')
CYCLE_DAYS = 8
FUELING_INTERVAL_MILES = Decimal('1000.0')
FUELING_DURATION_HOURS = Decimal('0.5')
PICKUP_DROPOFF_DURATION = Decimal('1.0')
START_TIME_HOUR = 7
AVERAGE_SPEED_MPH = Decimal('55.0')
METERS_TO_MILES = Decimal('0.000621371')
SECONDS_TO_HOURS = Decimal('1.0') / Decimal('3600.0')
