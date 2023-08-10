from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = """
        Should be used in order to init the users table.
        Retrive all the users data from auth0, and add all the users to the application database. 
    """

    def handle(self, *args, **options):
        User.init_local_users_according_to_auth0_users()
