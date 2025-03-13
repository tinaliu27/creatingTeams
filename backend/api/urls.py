from django.urls import path
from .views import (
    HelloWorld,
    current_datetime,
    generateStudents,
    generateStudentNumber,
    generateTeams,
    printStudents,
    generateRandomGender,
    getTeams,
    saveTeamData,
    generateRandomAcademicHistory,
    generateTimeslotAvailability,
    generateEnemies, 
    generatePM, 
    generateProjectPreference,
    generateStudentNames,
    generateStudents,
    saveTeamData,
    getAllGeneratedTeamNames,
    getGeneratedTeamDetails,
)
from . import views


urlpatterns = [
    path("hello/", HelloWorld.as_view(), name="message"),
    path("message/", current_datetime, name="date"),
    path("students/", generateStudents, name="students"),
    path("studentNumber/", generateStudentNumber, name="studentNumber"),
    path("generateTeams/", generateTeams, name="generateTeams"),
    path("printStudents/", printStudents, name="printStudents"),
    path("assignGender/", generateRandomGender, name="assignGender"),
    path("getTeams/", getTeams, name="getNames"),
    path("saveTeamData/", saveTeamData, name="saveTeamData"),
    path("generateRandomAcademicHistory", generateRandomAcademicHistory, name="academicHistory"), 
    path("generateTimeslotAvailability", generateTimeslotAvailability, name="generateTimeslotAvailability"), 
    path("generateEnemies", generateEnemies, name="generateEnemies"), 
    path("generatePM", generatePM, name="generatePM"), 
    path("generateProjectPreference", generateProjectPreference, name="generateProjectPreference"), 
    path("generateStudentNames", generateStudentNames, name="generateStudentNames"),
    path("getAllGeneratedTeamNames/", getAllGeneratedTeamNames, name="getAllGeneratedTeamNames"),
    path("getGeneratedTeamDetails/", getGeneratedTeamDetails, name="getGeneratedTeamDetails"),

]
