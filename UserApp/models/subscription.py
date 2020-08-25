from django.db import models
from utils.models import ModelMixin
from . import Tarrif

class Subscription(models.Model, ModelMixin):
	tally = models.IntegerField()
	timestamp = models.DateTimeField(auto_now_add=True)
	tarrif = models.ForeignKey(Tarrif, on_delete=models.DO_NOTHING, related_name="subscription")

	def get_dict(self):
		return {
			"id": self.pk,
			"tally": self.tally,
			"timestamp": self.timestamp,
			"tarrif": self.tarrif.get_dict()
		}