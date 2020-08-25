from django.db import models
from . import modelmanagers
from utils.models import ModelMixin, DictionaryField
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin


class User(AbstractBaseUser, ModelMixin, PermissionsMixin):
    Fillable = ["email", "first_name", "last_name"]
    
    ADMIN="admin"
    STAKEHOLDER="stakeholder"
    SUBSCRIBER="subscriber"

    UserTypes = (
        (ADMIN, "admin"),
        (STAKEHOLDER, "stakeholder"),
        (SUBSCRIBER, "subscriber")
    )
    class Meta:
        pass
    
    type = models.CharField(max_length=12, choices=UserTypes)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    account_details = DictionaryField(max_length=1000, default={})
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = modelmanagers.UserManager()

    def get_dict(self):
        return {
            "id": self.pk,
            "username": self.email,
            "type": self.type,
            "accountDetails": self.account_details
        }