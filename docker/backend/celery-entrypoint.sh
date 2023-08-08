#!/bin/bash

WORKERS=2
echo "Start $WORKERS celery workers"
sed -i -e 's/import sys/import sys, envkey/g' /usr/local/bin/celery
useradd -ms /bin/bash celery
chown -R celery:celery /app
su celery -c "celery -A base worker --loglevel=info --concurrency $WORKERS -E"