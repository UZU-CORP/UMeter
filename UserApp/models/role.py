from django.db import models
from utils.models import ModelMixin
from . import User

class Role(models.Model, ModelMixin):
	definition = models.CharField(max_length=50)
	users = models.ManyToManyField(User, on_delete=models.DO_NOTHING, related_name="roles")
	
	def get_dict(self):
		return {
			"id": self.pk,
			"users": [user.get_dict() for user in self.users.all()],
			"definition": self.definition
		}