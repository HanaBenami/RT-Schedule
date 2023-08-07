from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import User


@receiver(pre_save, sender=User)
def updateUser(sender, instance: User, **kwargs):
    if not User.SKIP_PRE_SAVE_SIGNAL:
        user = instance
        user.full_clean(exclude=["remote_user_id"])
        response = user.updateRemoteUser()
        remote_user_id = response.json()["user_id"]
        if user.remote_user_id is None:
            user.remote_user_id = remote_user_id
        else:
            assert user.remote_user_id == remote_user_id
        response = user.updateRemoteUserPermissions()
