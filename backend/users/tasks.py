from celery import shared_task

from .models import User


@shared_task(name="Sync remote users")
def sync_remote_users() -> dict:
    errors = User.sync_auth0_and_local_users()
    return {"Errors": errors}


@shared_task(name="Delete inactive temporary users")
def delete_inactive_temp_user() -> dict:
    deleted_users = User.delete_inactive_temporary_users()
    return {"Total deleted users": len(deleted_users), "Deleted users": deleted_users}
