from django.http import JsonResponse

def api_home(request):
    return JsonResponse({"message": "Hello from Django!"})

def generateTeams(request):
    teams = Teams.objects.all()
    teamData = [{"name": team.name, "members": team.members} or team in teams]
    return JsonResponse({"teams": teamData})