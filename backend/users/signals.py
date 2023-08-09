from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver

from .models import User


@receiver(pre_save, sender=User)
def updateRemoteUserPreSave(sender, instance: User, **kwargs):
    if User.UPDATE_AUTH0_USER_DURING_SAVE:
        user = instance
        user.full_clean(exclude=["remote_user_id"])
        response = user.updateRemoteUser()
        remote_user_id = response.json()["user_id"]
        if user.remote_user_id is None:
            user.remote_user_id = remote_user_id
        else:
            assert user.remote_user_id == remote_user_id


@receiver(post_save, sender=User)
def updateRemoteUserPostSave(sender, instance: User, **kwargs):
    if User.UPDATE_AUTH0_USER_DURING_SAVE:
        user = instance
        user.updateRemoteUserIsTemporary()
        user.updateRemoteUserPermissions()


@receiver(pre_delete, sender=User)
def deleteRemoteUser(sender, instance: User, **kwargs):
    user = instance
    user.deleteRemoteUser()
