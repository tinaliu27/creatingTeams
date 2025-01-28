from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
from django.http import HttpResponse, JsonResponse
import datetime
import random 

# Create your views here.
class HelloWorld(APIView):
    def get(self, request):
        return Response({"message": "This is my message!"})
    
def current_datetime(request):
    now = datetime.datetime.now()
    return JsonResponse({'message': f'It is now {now}'})

def generateStudents():
    studentNames = ["Anna Solomon", "Brad Connor", "Charlie Bassen", "David Trump", "Easton Johns", "Fred Lim", "George Kim", "Hunter Olson", "Ivy Lewis", "Jason Derulo", "Kelsey Kann", "Leo Lam", "Mona Underwood", "Nina Vaughn", "Oscar Smith", "Paul Newman", "Quincy Adams", "Rachel Berry", "Sam Smith", "Trevor Lim", "Ursula King", "Victor King", "Wendy Williams", "Xavier Chang", "Yara Smith", "Zahra Irwin"]
    return studentNames

def printStudents(request):
    return JsonResponse({"message": generateStudents()})

def generateStudentNumber(request):
    studentNumber = ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return JsonResponse({"message": studentNumber})

def generateRandomGender(request):
    genders = ["Male", "Female", "Non-binary", "Other"]
    gender = random.choice(genders)
    return JsonResponse({"message": gender})

def generateTeams(request):
    try:
        team_size = int(request.GET.get('team_size', 1))
        names = generateStudents()  # Use the list directly
        random.shuffle(names)  # Shuffle names to ensure randomness
        
        # Split names into teams
        teams = [names[i:i + team_size] for i in range(0, len(names), team_size)]
        
        return JsonResponse({"teams": teams})
    except ValueError:
        return JsonResponse({"error": "Invalid team size"}, status=400)
