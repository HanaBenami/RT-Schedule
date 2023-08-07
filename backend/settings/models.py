from extra_settings.models import Setting
import logging


logger = logging.getLogger(__name__)


class SystemSetting:
    ALL_SETTINGS = dict()

    def __init__(self, key: str, default_value: int, description: str) -> None:
        self.key = key
        self.type = type
        self.default_value = default_value
        self.description = description
        self.ALL_SETTINGS[self.key] = self

    @property
    def current_value(self):
        if not Setting.get(self.key):
            self.update_setting(new_value=self.default_value)
        return Setting.get(self.key)

    def __delete_setting(self):
        Setting.objects.filter(name=self.key).delete()

    def update_setting(self, new_value: int):
        self.__delete_setting()

        setting_obj = Setting(
            name=self.key,
            value_type=Setting.TYPE_INT,
            value=new_value,
        )
        setting_obj.save()

        logger.info(
            f"{self.key} setting was created/updated. Its current value is {new_value}."
        )
