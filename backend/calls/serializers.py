from rest_framework import serializers
from .models import Call, Contact
from users.serializers import UserSerializer


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ("name", "phone")


class CallSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True)

    class Meta:
        model = Call
        fields = "__all__"
