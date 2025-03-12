from django.db import models

# Create your models here.
class Team(models.Model):
    team_size = models.IntegerField()
    members = models.JSONField()  # or models.TextField() if you don't want JSONField

    def __str__(self):
        return f"Team of size {self.team_size}"