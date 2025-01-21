from django.db import models
import random 
import string

class Student(models.Model):
    genderChoices = [
        ("F", "Female"),
        ("M", "Male"),
        ("N", "Nonbinary"),
        ("O", "Other"),
    ]
    firstNames = [
            'Ava', 'Ben', 'Charlie', 'David', 'Eva', 'Felix', 'Grace', 'Hannah', 'Ivy', 'Jack', 
            'Kim', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Riley', 'Sophia', 'Tom', 
            'Uma', 'Violet', 'Will', 'Xander', 'Yara', 'Zane'
        ]
    
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    studentNumber = models.CharField(max_length=8, unique=True)
    gender = models.CharField(max_length=1, choices=genderChoices,default="M")

    def generateStudentNumber(self):
        return ''.join(random.choices(string.digits, k=8));
    def generateFullname(self):
        return f"{self.firstName} {self.lastName}"
    
    def random_student(self, *args, **kwargs):
        if not self.studentNumber:
            self.studentNumber = self.generate_student_number()

        if not self.firstName:
            self.firstName = random.choice(self.firstNames)  
        if not self.lastName:
            self.lastName = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ') 
        if not self.gender:
            self.gender = random.choice(['M', 'F', 'O', 'N'])

        super(Student, self).save(*args, **kwargs)
    def __str__(self):
        return self.generate_full_name()
    
class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.JSONField() 

    def __str__(self):
        return self.name
