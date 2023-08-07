from rest_framework import serializers


class SystemSettingSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=200)
    current_value = serializers.IntegerField()
