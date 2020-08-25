from django.db import models
from utils.models import ModelMixin

class Tarrif(models.Model, ModelMixin):
	
	cost = models.DecimalField(max_digits=20, decimal_places=2)
	start_date = models.DateField()
	end_date = models.DateField()
	
	def get_dict(self):
		return {
			"id": self.id,
			"startDate": self.start_date.timestamp() * 1000,
			"endDate": self.end_date.timestamp() * 1000,
			"cost": self.cost
		}