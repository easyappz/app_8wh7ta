from typing import Optional, Tuple

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Member, MemberToken


class MemberTokenAuthentication(BaseAuthentication):
    """Token-based authentication for Member instances.

    Expects the Authorization header in the form:

        Authorization: Token <key>
    """

    keyword = "Token"

    def authenticate(self, request) -> Optional[Tuple[Member, None]]:
        auth_header = request.META.get("HTTP_AUTHORIZATION")

        if not auth_header:
            # No credentials provided; let other authenticators (if any) run.
            return None

        parts = auth_header.split()

        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed("Invalid token header.")

        key = parts[1]
        if not key:
            raise AuthenticationFailed("Invalid token header.")

        try:
            token = MemberToken.objects.select_related("member").get(key=key)
        except MemberToken.DoesNotExist as exc:  # pragma: no cover - simple branch
            raise AuthenticationFailed("Invalid token.") from exc

        member = token.member
        if member is None:
            raise AuthenticationFailed("Invalid token.")

        return member, None

    def authenticate_header(self, request) -> str:  # pragma: no cover - header helper
        return self.keyword
