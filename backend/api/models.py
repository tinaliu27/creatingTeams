# Create your models here.
from django.db import models


# Create a model to represent a student
class Student(models.Model):
    studentID = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    academicHistory = models.CharField(max_length=100)
    timeSlot = models.CharField(max_length=20)
    enemy = models.CharField(max_length=100)
    PM = models.CharField(max_length=100)
    projectPreference = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Create a model to represent a team
class Team(models.Model):
    name = models.CharField(max_length=100, default="team")
    color = models.CharField(max_length=50, default="green")
    students = models.ManyToManyField(Student, related_name="teams")

    def __str__(self):
        return self.name


# Model to represent the overall team generation
class TeamGeneration(models.Model):
    generate_team_name = models.CharField(max_length=100, unique=True)
    diversify_gender = models.BooleanField(default=False)
    match_preferences = models.BooleanField(default=False)
    teams = models.ManyToManyField(Team, related_name="team_generations")

    def __str__(self):
        return self.generate_team_name
