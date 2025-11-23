from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .auth_utils import create_member_token
from .models import Member
from .serializers import (
    LoginSerializer,
    MemberProfileSerializer,
    MessageSerializer,
    RegistrationSerializer,
)
from .utils import verify_password


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    @extend_schema(
        responses={200: MessageSerializer},
        description="Get a hello world message",
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member = serializer.save()
        token = create_member_token(member)

        member_data = MemberProfileSerializer(member).data
        response_data = {
            "token": token.key,
            "member": member_data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist as exc:
            raise AuthenticationFailed("Invalid credentials.") from exc

        if not verify_password(password, member.password_hash):
            raise AuthenticationFailed("Invalid credentials.")

        token = create_member_token(member)

        member_data = MemberProfileSerializer(member).data
        response_data = {
            "token": token.key,
            "member": member_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member = request.user
        serializer = MemberProfileSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return self._update(request, partial=False)

    def patch(self, request):
        return self._update(request, partial=True)

    def _update(self, request, partial: bool):
        member = request.user
        serializer = MemberProfileSerializer(
            instance=member,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
