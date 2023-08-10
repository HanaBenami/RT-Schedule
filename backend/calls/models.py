from django.db import models
from datetime import datetime, timedelta
import logging

from users.models import User
from settings.models import SystemSetting


logger = logging.getLogger(__name__)


class Call(models.Model):
    DELETE_CALL_X_DAYS_POST_SCHEDULED_ORDER_SETTING = SystemSetting(
        key="DELETE_CALL_X_DAYS_POST_SCHEDULED_ORDER",
        default_value=30,
        description="כמה ימים לאחר תאריך שיבוץ קריאה למחוק קריאה שבוצעה? (0 = לעולם לא)",
    )

    internal_id = models.AutoField(primary_key=True, editable=False)
    external_id = models.IntegerField(null=False, unique=True)
    customer = models.CharField(max_length=200, null=False, blank=False)
    type = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    vehicle = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_done = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateField(auto_now=False)
    scheduled_order = models.PositiveIntegerField(null=False, blank=False)
    driver_email = models.EmailField(
        max_length=100,
        null=False,
        blank=False,
        unique=False,
    )
    driver_notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"call #{self.external_id}"

    def get_details(self):
        return {
            key: value
            for (key, value) in self.__dict__.items()
            if not key.startswith("_")
        }

    @property
    def driverUser(self):
        users = User.objects.filter(email=self.driver_email)
        return users[0] if users else None

    @classmethod
    def delete_old_calls(cls):
        days = cls.DELETE_CALL_X_DAYS_POST_SCHEDULED_ORDER_SETTING.current_value
        deleted_calls_external_id = []
        if days:
            logger.debug(f"Going to delete all the calls older than {days} days")
            calls_to_delete = cls.objects.filter(
                scheduled_date__lt=(datetime.now() + timedelta(days=-days)),
                is_done=True,
            )
            deleted_calls_external_id = [call.external_id for call in calls_to_delete]
            calls_to_delete.delete()
            logger.info(
                f"{len(deleted_calls_external_id)} calls were deleted automatically: {deleted_calls_external_id}"
            )
        return deleted_calls_external_id


class Contact(models.Model):
    call = models.ForeignKey(Call, related_name="contacts", on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=False, blank=False)
    phone = models.CharField(max_length=30, null=False, blank=False)
