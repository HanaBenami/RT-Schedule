#!/bin/bash

WORKERS=2
echo "Start $WORKERS celery workers"
useradd -ms /bin/bash celery
chown -R celery:celery /app
su celery -c "celery -A base worker --loglevel=info --concurrency $WORKERS -E"