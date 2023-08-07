from celery import shared_task

from .models import User


@shared_task(name="Sync remote users")
def sync_remote_users():
    errors = User.syncRemoteUsers()
    return {"Errors": errors}
