from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver

from .models import User


@receiver(pre_save, sender=User)
def update_remote_user_pre_save(sender, instance: User, **kwargs) -> None:
    if User.UPDATE_AUTH0_USER_DURING_SAVE:
        user = instance
        user.full_clean(exclude=["auth0_user_id"])
        user.update_auth0_user_without_permissions()


@receiver(post_save, sender=User)
def update_remote_user_post_save(sender, instance: User, **kwargs) -> None:
    if User.UPDATE_AUTH0_USER_DURING_SAVE:
        user = instance
        user.update_auth0_user_permissions()


@receiver(pre_delete, sender=User)
def delete_remote_user(sender, instance: User, **kwargs) -> None:
    user = instance
    if user.auth0_user:
        user.auth0_user.delete()
