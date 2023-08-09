from celery import shared_task

from .models import User


@shared_task(name="Sync remote users")
def sync_remote_users():
    errors = User.syncRemoteUsers()
    return {"Errors": errors}


@shared_task(name="Delete inactive temporary users")
def delete_inactive_temp_user():
    deleted_users = User.deleteInactiveTemporaryUsers()
    return {"Total deleted users": len(deleted_users), "Deleted users": deleted_users}
