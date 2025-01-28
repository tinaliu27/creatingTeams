from django.urls import path 
from .views import HelloWorld, current_datetime, generateStudents, generateStudentNumber, generateTeams
from . import views 
urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='message'),
    path('message/' , current_datetime, name="date"),
    path('students/', generateStudents , name="students"),
    path('studentNumber/', generateStudentNumber, name="studentNumber"), 
    path('generateTeams/', views.generateTeams, name="generateTeams"), 
]