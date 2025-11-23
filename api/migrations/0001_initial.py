from django.db import migrations, models
from django.db.models.deletion import CASCADE


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Member",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        db_index=True,
                        max_length=150,
                        unique=True,
                    ),
                ),
                ("password_hash", models.CharField(max_length=128)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["id"],
                "indexes": [
                    models.Index(fields=["username"], name="member_username_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="MemberToken",
            fields=[
                (
                    "key",
                    models.CharField(
                        max_length=80,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "member",
                    models.ForeignKey(
                        on_delete=CASCADE,
                        related_name="tokens",
                        to="api.member",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
