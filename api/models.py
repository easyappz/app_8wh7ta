from django.db import models


class Member(models.Model):
    username = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
    )
    password_hash = models.CharField(
        max_length=128,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(fields=["username"], name="member_username_idx"),
        ]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.username

    @property
    def is_authenticated(self) -> bool:
        """Compatibility with DRF's IsAuthenticated permission class."""
        return True


class MemberToken(models.Model):
    key = models.CharField(
        max_length=80,
        primary_key=True,
    )
    member = models.ForeignKey(
        Member,
        related_name="tokens",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"Token for member {self.member_id}"


class ChatMessage(models.Model):
    author = models.ForeignKey(
        Member,
        related_name="chat_messages",
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"Message {self.id} by member {self.author_id}"
