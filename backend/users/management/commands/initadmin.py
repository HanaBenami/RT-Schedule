from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings
import logging


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """
        Looking for superuser account. 
        If there is no superuser account yet, create it, with pre-defined default username and password.
    """

    def handle(self, *args, **options):
        superusers = User.objects.filter(is_superuser=True)
        if not superusers:
            username = settings.AUTH_DEFAULT_ADMIN_USERNAME
            password = settings.AUTH_DEFAULT_ADMIN_PASSWORD
            logger.info(f"Creating superuser account named {username}")
            admin = User.objects.create_superuser(username=username, password=password)
            admin.is_active = True
            admin.is_admin = True
            admin.save()
        else:
            logger.info(
                f"No need to create a superuser accont - There is already a superuser named {superusers.first().username}"
            )
