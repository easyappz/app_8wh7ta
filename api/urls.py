from django.urls import path

from .views import HelloView, LoginView, ProfileView, RegistrationView

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("auth/register", RegistrationView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/profile", ProfileView.as_view(), name="auth-profile"),
]
