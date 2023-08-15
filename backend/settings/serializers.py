from rest_framework import serializers
from .models import SystemSetting


class SystemSettingSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=200)
    value = serializers.SerializerMethodField()

    def get_value(self, systemSetting: SystemSetting):
        return systemSetting.current_value
