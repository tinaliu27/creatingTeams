from django.db import models


# Create your models here.
class Team(models.Model):
    title = models.CharField(
        max_length=255, default="Untitled Team"
    )  # Added field for team title
    team_size = models.IntegerField(default=1)
    students = models.JSONField(default=list)
    student_numbers = models.JSONField(default=list)
    genders = models.JSONField(default=list)
    diversify_gender = models.BooleanField(default=False)
    match_preferences = models.BooleanField(default=False)

    def __str__(self):
        return self.title
