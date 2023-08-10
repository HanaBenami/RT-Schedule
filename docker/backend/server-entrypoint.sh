#!/bin/bash

echo "Apply database migrations"
python manage.py migrate
python manage.py loaddata data/data_django_celery_beat.json

echo "Collect static files"
python manage.py collectstatic --noinput 

echo "Create a superuser"
python manage.py initadmin

echo "Create application users"
python manage.py initlocalusers

echo "Starting gunicorn server in production mode"
gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4

# echo "Starting gunicorn server in DEBUG mode"
# gunicorn server.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# echo "Starting development server in DEBUG mode"
# DJANGO_DEBUG=True ./manage.py runserver 0.0.0.0:8000