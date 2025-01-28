from django.urls import path 
from .views import HelloWorld, current_datetime, generateStudents, generateStudentNumber, generateTeams, printStudents, generateRandomGender
from . import views 
urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='message'),
    path('message/' , current_datetime, name="date"),
    path('students/', generateStudents , name="students"),
    path('studentNumber/', generateStudentNumber, name="studentNumber"), 
    path('generateTeams/', generateTeams, name="generateTeams"), 
    path('printStudents/', printStudents, name="printStudents"), 
    path('assignGender/', generateRandomGender, name="assignGender"), 
]