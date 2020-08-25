from django.db import models
from utils.models import ModelMixin

class Ticket(models.Model, ModelMixin):
	PENDING = "pending"
	RESOLVED = "resolved"

	TicketStatus = (
		(PENDING, "pending"),
		(RESOLVED, "resolved")
	)

	name = models.CharField(max_length=30)
	email = models.CharField(max_length=30)
	text = models.TextField()
	status = models.CharField(max_length=12, choices=TicketStatus, default=RESOLVED)
	
	def get_dict(self):
		return {
			"id": self.pk,
			"name": self.name,
			"email": self.email,
			"text": self.text,
			"status": self.status
		}