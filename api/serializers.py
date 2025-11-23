from rest_framework import serializers

from .models import Member
from .utils import hash_password


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate_username(self, value: str) -> str:
        if not value:
            raise serializers.ValidationError("Username is required.")

        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")

        return value

    def validate_password(self, value: str) -> str:
        if not value:
            raise serializers.ValidationError("Password is required.")

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        return value

    def create(self, validated_data):
        username = validated_data["username"]
        raw_password = validated_data["password"]
        password_hash = hash_password(raw_password)

        member = Member.objects.create(
            username=username,
            password_hash=password_hash,
        )
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class MemberProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "username", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_username(self, value: str) -> str:
        if not value:
            raise serializers.ValidationError("Username is required.")

        member_id = self.instance.id if self.instance is not None else None
        queryset = Member.objects.filter(username=value)
        if member_id is not None:
            queryset = queryset.exclude(id=member_id)

        if queryset.exists():
            raise serializers.ValidationError("Username is already taken.")

        return value
