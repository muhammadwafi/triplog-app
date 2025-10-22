import logging

import environ


logger = logging.getLogger(__name__)
env = environ.Env(
    # set casting, default value
    DJANGO_ENV=(str, 'production'),
    DJANGO_DEBUG=(bool, True),
)

# read env file
root_path = environ.Path(__file__) - 3  # /src
environ.Env.read_env(root_path('.env'))
current_env = env('DJANGO_ENV')

if current_env == 'production':
    from .production import *
else:
    from .development import *

logger.info(f'Using {current_env} environment')
