from django.contrib.auth.hashers import check_password, make_password


def hash_password(raw_password: str) -> str:
    """Hash a raw password using Django's configured password hasher."""
    if raw_password is None:
        raise ValueError("raw_password must not be None")
    return make_password(raw_password)


def verify_password(raw_password: str, password_hash: str) -> bool:
    """Verify that the given raw password matches the stored hash."""
    if not raw_password or not password_hash:
        return False
    return check_password(raw_password, password_hash)
