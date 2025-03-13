from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
import datetime
import random
from .models import Team
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
class HelloWorld(APIView):
    def get(self, request):
        return Response({"message": "This is my message!"})


def current_datetime(request):
    now = datetime.datetime.now()
    return JsonResponse({"message": f"It is now {now}"})


def generateStudents():
    studentNames = [
        "Anna Solomon",
        "Brad Connor",
        "Charlie Bassen",
        "David Trump",
        "Easton Johns",
        "Fred Lim",
        "George Kim",
        "Hunter Olson",
        "Ivy Lewis",
        "Jason Derulo",
        "Kelsey Kann",
        "Leo Lam",
        "Mona Underwood",
        "Nina Vaughn",
        "Oscar Smith",
        "Paul Newman",
        "Quincy Adams",
        "Rachel Berry",
        "Sam Smith",
        "Trevor Lim",
        "Ursula King",
        "Victor King",
        "Wendy Williams",
        "Xavier Chang",
        "Yara Smith",
        "Zahra Irwin",
    ]
    return studentNames


def printStudents(request):
    return JsonResponse({"message": generateStudents()})


def generateStudentNumber(request):
    studentNumber = "".join([str(random.randint(0, 9)) for _ in range(8)])
    return JsonResponse({"message": studentNumber})


def generateRandomGender(request):
    genders = ["Male", "Female", "Non-binary", "Other"]
    gender = random.choice(genders)
    return JsonResponse({"message": gender})

def generateRandomAcademicHistory(request):
    academicHistory = ["0-50%", "50-60%", "70-80%", "80-90%", "90-100%"]
    academicHistory = random.choice(academicHistory)
    return JsonResponse({"message": academicHistory})

def generateTimeslotAvailability(request):
    timeSlot = ["6-9 am", "9-12 pm", "12-3 pm", "3-6 pm", "6-9 pm", "9-12 am"]
    timeSlot = random.choice(timeSlot)
    return JsonResponse({"message": timeSlot})

def generateEnemies(request):
    students = generateStudents()
    enemies = random.choice(students)
    return JsonResponse({"message": enemies})

def generatePM(request): 
    experience = ["no answer", "no experience", "minimal experience in small projects", "some experience in multiple projects", "lots of experience"]
    experience = random.choice(experience)
    return JsonResponse({"message": experience})

def generateProjectPreference(request):
    project = ["Project 1", "Project 2", "No answer"]
    project = random.choice(project)
    return JsonResponse({"message": project})

def generateTeams(request):
    try:
        team_size = int(request.GET.get("team_size", 1))
        names = generateStudents()
        random.shuffle(names)
        teams = [names[i : i + team_size] for i in range(0, len(names), team_size)]

        return JsonResponse({"teams": teams})
    except ValueError:
        return JsonResponse({"error": "Invalid team size"}, status=400)


@csrf_exempt
def saveTeamData(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON data from the frontend

            # Create a new team entry in the database
            team = Team.objects.create(
                title=data.get("title", []),
                team_size=data.get("team_size"),
                students=data.get("students", []),
                student_numbers=data.get("student_numbers", []),
                genders=data.get("genders", []),
                diversify_gender=data.get("diversify_gender", False),
                match_preferences=data.get("match_preferences", False),
            )

            return JsonResponse(
                {"message": "Team data saved successfully!", "team_id": team.id},
                status=201,
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def format_teams_data(teams):
    formatted_teams = []

    for index, team in enumerate(teams, start=1):
        formatted_teams.append(
            {
                "id": f"team-{index}",
                "name": f"Team {index}",
                "people": [
                    {
                        "name": student["name"],
                        "studentID": student["studentID"],
                        "gender": student["gender"],
                    }
                    for student in team.students  # Assuming 'students' is stored as a list in the model
                ],
                "color": (
                    team.color if hasattr(team, "color") else "red"
                ),  # Default color is "red"
            }
        )

    return formatted_teams


def getTeams(request):
    if request.method == "GET":
        try:
            teams = Team.objects.all()  # Fetch all teams from the database
            formatted_teams = format_teams_data(teams)  # Format the teams

            return JsonResponse({"teams": formatted_teams}, status=200, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
