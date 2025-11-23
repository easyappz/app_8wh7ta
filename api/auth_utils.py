import secrets

from .models import Member, MemberToken


def _generate_token_key() -> str:
    """Generate a secure random token key."""
    return secrets.token_hex(40)


def create_member_token(member: Member, invalidate_old: bool = True) -> MemberToken:
    """Create and return a new MemberToken for the given member.

    Optionally invalidate (delete) any existing tokens for this member
    to ensure only a single active token at a time.
    """
    if member is None:
        raise ValueError("member must not be None")

    if invalidate_old:
        MemberToken.objects.filter(member=member).delete()

    key = _generate_token_key()
    # Ensure uniqueness of the token key.
    while MemberToken.objects.filter(key=key).exists():
        key = _generate_token_key()

    token = MemberToken.objects.create(member=member, key=key)
    return token


def invalidate_member_tokens(member: Member) -> int:
    """Invalidate all tokens for the given member.

    Returns the number of tokens deleted.
    """
    if member is None:
        return 0

    deleted_count, _ = MemberToken.objects.filter(member=member).delete()
    return deleted_count
