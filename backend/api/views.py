from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
import datetime
import random
from .models import Team, TeamGeneration, Student
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)


# Create your views here.
class HelloWorld(APIView):
    def get(self, request):
        return Response({"message": "This is my message!"})


def current_datetime(request):
    now = datetime.datetime.now()
    return JsonResponse({"message": f"It is now {now}"})


def generateStudents(request):
    students = []
    studentNames = generateStudentNames()
    for i in range(26):
        student = Student.objects.create(
            studentID=generateStudentNumber(),
            name=studentNames[i],
            gender=generateRandomGender(),
            academicHistory=generateRandomAcademicHistory(),
            timeSlot=generateTimeslotAvailability(),
            enemy=random.choice(studentNames),
            PM=generatePM(),
            projectPreference=generateProjectPreference(),
        )
        students.append(student)

    students_data = [
        {
            "studentID": student.studentID,
            "name": student.name,
            "gender": student.gender,
            "academicHistory": student.academicHistory,
            "timeSlot": student.timeSlot,
            "enemy": student.enemy,
            "PM": student.PM,
            "projectPreference": student.projectPreference,
        }
        for student in students
    ]
    return JsonResponse(students_data, safe=False)


def generateStudentNames():
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
    students = generateStudents()
    students_data = [
        {
            "studentID": student.studentID,
            "name": student.name,
            "gender": student.gender,
            "academicHistory": student.academicHistory,
            "timeSlot": student.timeSlot,
            "enemy": student.enemy,
            "PM": student.PM,
            "projectPreference": student.projectPreference,
        }
        for student in students
    ]
    return JsonResponse({"students": students_data})


def generateStudentNumber():
    studentNumber = "".join([str(random.randint(0, 9)) for _ in range(8)])
    return studentNumber


def generateRandomGender():
    genders = ["Male", "Female", "Non-binary", "Other", "Prefer not to say", ""]
    gender = random.choice(genders)
    return gender


def generateRandomAcademicHistory():
    academicHistory = ["0-50%", "50-60%", "70-80%", "80-90%", "90-100%", ""]
    academicHistory = random.choice(academicHistory)
    return academicHistory


def generateTimeslotAvailability():
    timeSlot = ["6-9 am", "9-12 pm", "12-3 pm", "3-6 pm", "6-9 pm", "9-12 am", ""]
    if random.randint(1, 10) < 2:
        return[""]
    selectedTimeSlots = random.sample(timeSlot[:-1], k=random.randint(1, len(timeSlot) - 1))
    return ", ".join(selectedTimeSlots)


def generateEnemies():
    students = generateStudents()
    enemies = random.choice(students)
    return enemies


def generatePM():
    experience = [
        "",
        "no experience",
        "minimal experience in small projects",
        "some experience in multiple projects",
        "lots of experience",
    ]
    experience = random.choice(experience)
    return experience


def generateProjectPreference():
    project = ["Project 1", "Project 2", ""]
    project = random.choice(project)
    return project


def generateTeams(request):
    try:
        team_size = int(request.GET.get("team_size", 1))
        names = generateStudents()
        random.shuffle(names)
        teams = [names[i : i + team_size] for i in range(0, len(names), team_size)]

        # all data
        studentNumber = generateStudentNumber()
        gender = generateRandomGender()
        generatedTeamName = request.GET.get("team_size")
        response_data = {"generateTeamName": generatedTeamName, "teams": []}
        return JsonResponse({"teams": teams})
    except ValueError:
        return JsonResponse({"error": "Invalid team size"}, status=400)


def getTeams(request):
    if request.method == "GET":
        try:
            # Extract the query parameter 'generate_team_name'
            generate_team_name = request.GET.get("generate_team_name")
            print(f"Received generate_team_name: {generate_team_name}")  # Debugging

            # Validate the presence of the generate_team_name parameter
            if not generate_team_name:
                return JsonResponse(
                    {"error": "Missing 'generate_team_name' parameter"}, status=400
                )

            # Query Team objects by the related TeamGeneration's 'generate_team_name'
            teams = Team.objects.filter(
                team_generations__generate_team_name=generate_team_name
            )

            # Debug: Check if any teams were found
            print(f"Found teams: {teams}")  # Debugging

            # If no teams are found for the given generate_team_name, return a 404
            if not teams:
                return JsonResponse(
                    {"error": "No teams found for this team generation name"},
                    status=404,
                )

            # Prepare team data
            teams_data = [
                {
                    "title": team.name,
                    "students": [
                        {
                            "name": student.name,
                            "studentID": student.studentID,
                            "gender": student.gender,
                            "academicHistory": student.academicHistory,
                            "timeSlot": student.timeSlot,
                            "enemy": student.enemy,
                            "PM": student.PM,
                            "projectPreference": student.projectPreference,
                        }
                        for student in team.students.all()
                    ],
                }
                for team in teams
            ]

            # Return a successful response with teams data
            return JsonResponse({"teams": teams_data}, status=200)

        except Exception as e:
            # Return any error that occurs during processing
            return JsonResponse({"error": str(e)}, status=400)

    # Return error if the method is not GET
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def saveTeamData(request):
    if request.method == "POST":
        try:
            # Parse the request body into a JSON object
            data = json.loads(request.body)

            # Extract the relevant fields from the data
            generate_team_name = data.get("generate_team_name")
            diversify_gender = data.get("diversify_gender")
            match_preferences = data.get("match_preferences")
            teams = data.get("teams")
            # Ensure 'teams' is a list
            if not isinstance(teams, list):
                return JsonResponse({"error": "'teams' must be a list"}, status=400)

            # Ensure 'generate_team_name' is not empty or None
            if not generate_team_name:
                return JsonResponse(
                    {"error": "'generateTeamName' is required"}, status=400
                )

            # Check if a TeamGeneration with the same name already exists
            team_generation, created = TeamGeneration.objects.get_or_create(
                generate_team_name=generate_team_name,
                defaults={
                    "diversify_gender": diversify_gender,
                    "match_preferences": match_preferences,
                },
            )

            if not created:
                # If a TeamGeneration with this name already exists
                return JsonResponse(
                    {
                        "error": f"A TeamGeneration with the name '{generate_team_name}' already exists."
                    },
                    status=400,
                )

            created_teams = []  # Initialize the list to store created teams
            print("Proceeding to create teams...")

            # Loop through the teams and create each one
            for team_data in teams:
                team_id = team_data.get("id", "")
                team_name = team_data.get("name", "")
                people = team_data.get("people", [])
                color = team_data.get(
                    "color", "green"
                )  # Default to 'yellow' if not provided

                # Ensure required fields are present
                if not team_id or not team_name or not isinstance(people, list):
                    return JsonResponse(
                        {"error": "Missing or invalid fields in team data"}, status=400
                    )

                # Create the Team instance
                team = Team.objects.create(
                    name=team_name,
                    color=color,
                )
                print(
                    f"Created Team: {team.name} with ID: {team.id} and Color: {team.color}"
                )

                # Extract student IDs and create relationships with Student objects
                student_objects = []
                for person in people:
                    student_id = person.get("studentID")
                    if student_id:
                        # Get or create the student based on the studentID
                        student = Student.objects.get(studentID=student_id)
                        student_objects.append(student)
                    else:
                        return JsonResponse(
                            {"error": "Each person must have a valid 'studentID'"},
                            status=400,
                        )

                # Assign the students to the team
                team.students.set(student_objects)

                # Add the created team to the TeamGeneration instance
                team_generation.teams.add(team)

                # Append the created team info to the list
                created_teams.append(
                    {"team_id": team.id, "name": team.name, "color": team.color}
                )

            # Return success response with created teams
            return JsonResponse(
                {"message": "Teams saved successfully!", "teams": created_teams},
                status=201,
            )

        except json.JSONDecodeError:
            # Handle invalid JSON format
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            # Log the error for debugging
            logger.error(f"Error saving team data: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def getAllGeneratedTeamNames(request):
    try:
        # Get all TeamGeneration instances
        team_generations = TeamGeneration.objects.all()

        # Extract the generate_team_name from each TeamGeneration instance
        generate_team_names = [
            team_generation.generate_team_name for team_generation in team_generations
        ]

        # Return a successful response with the list of generate_team_names
        return JsonResponse({"generate_team_names": generate_team_names}, status=200)

    except Exception as e:
        # Return any error that occurs during processing
        return JsonResponse({"error": str(e)}, status=400)


def getGeneratedTeamDetails(request):
    if request.method == "GET": 
        try:
            # Retrieve the generate_team_name from the query parameters
            generate_team_name = request.GET.get("generate_team_name")

            if not generate_team_name:
                return JsonResponse(
                    {"error": "generate_team_name is required"}, status=400
                )

            # Get the TeamGeneration instance based on the generate_team_name
            team_generation = TeamGeneration.objects.get(
                generate_team_name=generate_team_name
            )

            # Prepare the response data with team generation details
            team_details = {
                "generate_team_name": team_generation.generate_team_name,
                "diversify_gender": team_generation.diversify_gender,
                "match_preferences": team_generation.match_preferences,
                "students": [],  # Initialize student list
            }

            # Retrieve all students in this team generation
            students = Student.objects.filter(
                teams__team_generations=team_generation
            ).distinct()

            # Populate student details
            for student in students:
                student_data = {
                    "studentID": student.studentID,
                    "name": student.name,
                    "gender": student.gender,
                    "academicHistory": student.academicHistory,
                    "timeSlot": student.timeSlot,
                    "enemy": student.enemy,
                    "PM": student.PM,
                    "projectPreference": student.projectPreference,
                }
                team_details["students"].append(student_data)

            print(team_details)  # Debugging
            return JsonResponse(team_details, status=200)

        except TeamGeneration.DoesNotExist:
            return JsonResponse({"error": "Team generation not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def moveStudent(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            student_id = data.get("studentID")
            new_team_id = data.get("newTeamID")
            generate_team_name = request.GET.get("generate_team_name")
            print(student_id, new_team_id)
            # Validate input data
            if not student_id or not new_team_id:
                return JsonResponse(
                    {"error": "Missing studentID or newTeamID"}, status=400
                )

            # Fetch the student and the new team from the database
            try:
                student = Student.objects.get(studentID=student_id)
            except Student.DoesNotExist:
                return JsonResponse({"error": "Student not found"}, status=404)

            # Fetch the TeamGeneration object that corresponds to the generate_team_name
            try:
                team_generation = TeamGeneration.objects.get(
                    generate_team_name=generate_team_name
                )
            except TeamGeneration.DoesNotExist:
                return JsonResponse({"error": "Team generation not found"}, status=404)

            # Fetch the team corresponding to the new_team_id within this TeamGeneration
            try:
                new_team = team_generation.teams.get(name=new_team_id)
            except Team.DoesNotExist:
                return JsonResponse(
                    {"error": "New team not found in the specified team generation"},
                    status=404,
                )

            # Find the student's current team and remove them from it
            current_team = Team.objects.filter(students=student).first()
            if current_team:
                current_team.students.remove(student)

            # Add the student to the new team
            new_team.students.add(student)

            return JsonResponse(
                {"message": f"Student {student.name} moved to team {new_team.name}"},
                status=200,
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.error(f"Error moving student: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def getAcademicHistoryGeneration(request):
    academicCategories = [
        "No Answer Provided",
        "0-50%",
        "50-60%",
        "60%-70%",
        "70-80%",
        "80-90%",
        "90-100%",
    ]

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)

        if not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Fetch the team by name
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        # Initialize count dictionary
        categoryCounts = {category: 0 for category in academicCategories}

        for student in team.students.all():
            academicHistory = student.academicHistory.strip()

            if academicHistory == "" or academicHistory.lower() == "no answer provided":
                categoryCounts["No Answer Provided"] += 1
            elif academicHistory in categoryCounts:
                categoryCounts[academicHistory] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        # Return response
        response_data = {
            "team_name": team.name,
            "academic_history_counts": categoryCounts,
        }
        return JsonResponse(response_data)

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


## get gender count
def getGenderCount(request):
    genderCategories = [
        "No Answer Provided",
        "Male",
        "Female",
        "Non-binary",
        "Other",
        "Prefer not to say",
    ]
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"})
        elif not team_name:
            return JsonResponse({"error": "teamName is required"}, status=405)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)
        ## get the team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )
        categoryCounts = {category: 0 for category in genderCategories}

        for student in team.students.all():
            gender = student.gender.strip()

            if gender == "" or gender.lower() == "no answer provided":
                categoryCounts["No Answer Provided"] += 1
            elif gender in categoryCounts:
                categoryCounts[gender] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        response_data = {
            "team_name": team.name,
            "gender_counts": categoryCounts,
        }
        return JsonResponse(response_data)
    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


def getTimeSlotAvailabilityCount(request):
    timeSlotCategory = [
        "No Answer Provided",
        "6-9 am",
        "9-12 pm",
        "12-3 pm",
        "3-6 pm",
        "6-9 pm",
        "9-12 am",
    ]

    # Ensure it's a GET request
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        # Get query parameters
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        # Validate query parameters
        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        elif not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        # Fetch the TeamGeneration object
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)
        print(team_generation)
        # Get the team by name
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        # Initialize the category count dictionary
        categoryCounts = {category: 0 for category in timeSlotCategory}

        # Loop through each student in the team to count their time slot availability
        for student in team.students.all():
            timeSlot = student.timeSlot.strip()

            if timeSlot == "":
                categoryCounts["No Answer Provided"] += 1
            elif timeSlot in categoryCounts:
                categoryCounts[timeSlot] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        # Return the response with a more structured format
        response_data = {
            "team_name": team.name,
            "time_slot_availability_counts": categoryCounts,
        }
        return JsonResponse(response_data)

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


def getEnemyCount(request):
    studentNameCategory = [
        "No Answer Provided",
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
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"})
        elif not team_name:
            return JsonResponse({"error": "teamName is required"}, status=405)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)
        ## get the team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        categoryCounts = {category: 0 for category in studentNameCategory}

        for student in team.students.all():
            enemy = student.enemy.strip()

            if enemy == "":
                categoryCounts["No Answer Provided"] += 1
            elif enemy in categoryCounts:
                categoryCounts[enemy] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        response_data = {"team_name": team.name, "enemy_count": categoryCounts}

        return JsonResponse(response_data)

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


def getPMCount(request):
    experienceCategory = [
        "No Answer Provided",
        "no experience",
        "minimal experience in small projects",
        "some experience in multiple projects",
        "lots of experience",
    ]

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        elif not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Get the specific team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        categoryCounts = {category: 0 for category in experienceCategory}

        for student in team.students.all():
            PM = student.PM.strip()

            if PM == "":
                categoryCounts["No Answer Provided"] += 1
            elif PM in categoryCounts:
                categoryCounts[PM] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        response_data = {"team_name": team.name, "pm_experience_count": categoryCounts}

        return JsonResponse(response_data)

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


def getDemoProjectPreferenceCount(request):
    projectPreferenceCategory = [
        "No Answer Provided",
        "Project 1",
        "Project 2",
    ]

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        elif not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)
        print(team_generation)
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        categoryCounts = {category: 0 for category in projectPreferenceCategory}

        for student in team.students.all():
            projectPreference = student.projectPreference.strip()

            if projectPreference == "":
                categoryCounts["No Answer Provided"] += 1
            elif projectPreference in categoryCounts:
                categoryCounts[projectPreference] += 1
            else:
                categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

        response_data = {
            "team_name": team.name,
            "preference_counts": categoryCounts,
        }

        return JsonResponse(response_data)
    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    
def getDemoProjectPreference(request):
    projectPreferenceCategory = [
        "No Answer Provided",
        "Project 1",
        "Project 2",
    ]

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        teams_data = []

        for team in team_generation.teams.all():
            categoryCounts = {category: 0 for category in projectPreferenceCategory}

            for student in team.students.all():
                projectPreference = student.projectPreference.strip()

                if projectPreference == "":
                    categoryCounts["No Answer Provided"] += 1
                elif projectPreference in categoryCounts:
                    categoryCounts[projectPreference] += 1
                else:
                    categoryCounts["No Answer Provided"] += 1  # Catch unexpected values

            teams_data.append({team.name: categoryCounts})

        return JsonResponse(teams_data, safe=False)

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)

def getTeamAverage(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        teams_data = []
        total_class_academic_history = 0
        total_class_students = 0

        for team in team_generation.teams.all():
            students = team.students.all()
            total_team_students = 0
            total_team_academic_history = 0

            for student in students:
                academic_history = student.academicHistory.strip()
                if academic_history and academic_history != "No Answer Provided" and academic_history != "":
                    try:
                        # Remove the '%' symbol and split the range
                        lower_bound, upper_bound = map(
                            int, academic_history.replace("%", "").split("-")
                        )
                        averageOfSplit = (lower_bound + upper_bound) / 2
                        total_team_academic_history += averageOfSplit
                        total_team_students += 1  # Only count students with valid academic history
                    except ValueError:
                        # Skip if the academic history is not in the expected format
                        continue
            # Calculate the team's average academic history
            average_team_academic_history = (
                round(total_team_academic_history / total_team_students, 2)
                if total_team_students > 0
                else 0
            )

            # Append team data
            teams_data.append(
                {
                    "team_name": team.name,
                    "average_academic_history": average_team_academic_history,
                }
            )

            # Add to class totals
            total_class_academic_history += total_team_academic_history
            total_class_students += total_team_students

        # Calculate the class average academic history
        class_average_academic_history = (
            total_class_academic_history / total_class_students
            if total_class_students > 0
            else 0
        )

        # Return both team averages and the class average
        return JsonResponse(
            {
                "teams": teams_data,
                "class_average_academic_history": class_average_academic_history,
            },
            safe=False,
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    
def getGenderAverageForTeam(request):
    # Define the metric for each gender
    genderMetrics = {
        "Male": 20,
        "Female": 40,
        "Non-binary": 80,
        "Other": 80,
        "Prefer not to say": 100,
        "No Answer Provided": 1,
        "": 1,  # Treat empty strings as "No Answer Provided"
    }

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        if not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Fetch the specific team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        # Initialize total metrics and student count
        totalMetric = 0
        total_students = 0

        # Calculate the total metric for the team
        for student in team.students.all():
            gender = student.gender.strip()
            metric = genderMetrics.get(gender, 1)  # Default to 1% if gender is unexpected
            totalMetric += metric
            total_students += 1

        # Calculate the average metric for the team
        averageMetric = round(totalMetric / total_students, 2) if total_students > 0 else 0

        return JsonResponse(
            {"team_name": team.name, "average_metric": averageMetric}, status=200
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)


def getGenderAverageForClass(request):
    # Define the metric for each gender
    genderMetrics = {
        "Male": 20,
        "Female": 40,
        "Non-binary": 80,
        "Other": 80,
        "Prefer not to say": 100,
        "No Answer Provided": 1,
        "": 1,  # Treat empty strings as "No Answer Provided"
    }

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Initialize total metrics and student count
        totalMetric = 0
        total_students = 0

        # Calculate the total metric for the entire class
        for team in team_generation.teams.all():
            for student in team.students.all():
                gender = student.gender.strip()
                metric = genderMetrics.get(gender, 1)  # Default to 1% if gender is unexpected
                totalMetric += metric
                total_students += 1

        # Calculate the average metric for the class
        averageMetric = round(totalMetric / total_students, 2) if total_students > 0 else 0

        return JsonResponse(
            {"class_name": generate_team_name, "average_metric": averageMetric},
            status=200,
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    

def getPMAverageForTeam(request):
    # Define the metric for each PM experience level
    pmMetrics = {
        "": 0,
        "no experience": 25,
        "minimal experience in small projects": 50,
        "some experience in multiple projects": 75,
        "lots of experience": 100,
    }

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        if not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Fetch the specific team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        # Initialize total metrics and student count
        totalMetric = 0
        total_students = 0

        # Calculate the total metric for the team
        for student in team.students.all():
            pm_experience = student.PM.strip()
            metric = pmMetrics.get(pm_experience, 0)  # Default to 0% if PM experience is unexpected
            totalMetric += metric
            total_students += 1

        # Calculate the average metric for the team
        averageMetric = round(totalMetric / total_students, 2) if total_students > 0 else 0

        return JsonResponse(
            {"team_name": team.name, "average_pm_metric": averageMetric}, status=200
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    
def getPMAverageForClass(request):
    # Define the metric for each PM experience level
    pmMetrics = {
        "": 0,
        "no experience": 25,
        "minimal experience in small projects": 50,
        "some experience in multiple projects": 75,
        "lots of experience": 100,
    }

    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Initialize total metrics and student count
        totalMetric = 0
        total_students = 0

        # Calculate the total metric for the entire class
        for team in team_generation.teams.all():
            for student in team.students.all():
                pm_experience = student.PM.strip()
                metric = pmMetrics.get(pm_experience, 0)  # Default to 0% if PM experience is unexpected
                totalMetric += metric
                total_students += 1

        # Calculate the average metric for the class
        averageMetric = round(totalMetric / total_students, 2) if total_students > 0 else 0

        return JsonResponse(
            {"class_name": generate_team_name, "average_pm_metric": averageMetric},
            status=200,
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    
def getEnemySatisfactionPercentage(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        if not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        # Fetch the team generation instance
        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        # Fetch the specific team
        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        # Initialize variables for satisfaction calculation
        total_students = 0
        satisfied_students = 0

        # Check each student in the team
        for student in team.students.all():
            total_students += 1
            enemy_name = student.enemy.strip()

            # Check if the enemy is on the same team
            if enemy_name and team.students.filter(name=enemy_name).exists():
                # Enemy is on the same team, satisfaction is 0%
                continue
            else:
                # No enemy on the same team, satisfaction is 100%
                satisfied_students += 1

        # Calculate the satisfaction percentage
        satisfaction_percentage = (
            round((satisfied_students / total_students) * 100, 2)
            if total_students > 0
            else 0
        )

        return JsonResponse(
            {
                "team_name": team.name,
                "enemy_satisfaction_percentage": satisfaction_percentage,
            },
            status=200,
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def getProjectPreferenceSatisfactionPercentage(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        generate_team_name = request.GET.get("generate_team_name")
        team_name = request.GET.get("teamName")

        if not generate_team_name:
            return JsonResponse({"error": "generate_team_name is required"}, status=400)
        if not team_name:
            return JsonResponse({"error": "teamName is required"}, status=400)

        team_generation = TeamGeneration.objects.prefetch_related(
            "teams__students"
        ).get(generate_team_name=generate_team_name)

        team = team_generation.teams.filter(name__icontains=team_name).first()
        if not team:
            return JsonResponse(
                {"error": "Team not found in the specified generation"}, status=404
            )

        total_students = 0
        satisfied_students = 0
        assigned_project = "Project 1"  # Manually selecgted project 1 

        for student in team.students.all():
            total_students += 1
            student_preference = student.projectPreference.strip()

            if student_preference == assigned_project:
                satisfied_students += 1

        satisfaction_percentage = (
            round((satisfied_students / total_students) * 100, 2)
            if total_students > 0
            else 0
        )

        return JsonResponse(
            {
                "team_name": team.name,
                "assigned_project": assigned_project,
                "project_preference_satisfaction_percentage": satisfaction_percentage,
            },
            status=200,
        )

    except TeamGeneration.DoesNotExist:
        return JsonResponse({"error": "Team Generation not Found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def updateTeamColor(request):
    if request.method == "POST":
        try:
            # Parse the request body into a JSON object
            data = json.loads(request.body)
            logger.info(f"Received data: {data}")  # Log the received data

            # Extract the relevant fields from the data
            team_name = data.get("team_name")
            new_color = data.get("color")
            generate_team_name = request.GET.get("generate_team_name")
            print(team_name, new_color, generate_team_name)

            # Validate the input data
            if not team_name or not new_color:
                return JsonResponse({"error": "Missing team_name or color"}, status=400)

            # Fetch the team generation instance
            try:
                team_generation = TeamGeneration.objects.prefetch_related("teams").get(generate_team_name=generate_team_name)
                logger.info(f"Found team generation: {team_generation}")
            except TeamGeneration.DoesNotExist:
                logger.error("Team generation not found")
                return JsonResponse({"error": "Team generation not found"}, status=404)

            # Fetch the specific team within the team generation
            try:
                team = team_generation.teams.get(name=team_name)
                logger.info(f"Found team: {team}")
            except Team.DoesNotExist:
                logger.error("Team not found in the specified team generation")
                return JsonResponse({"error": "Team not found in the specified team generation"}, status=404)

        
            # Update the team's color
            team.color = new_color
            team.save()
            team.refresh_from_db()  # Refresh the team instance from the database
            logger.info(f"Updated team color to: {new_color}")

            # Return a success response
            return JsonResponse(
                {
                    "message": "Team color updated successfully",
                    "team_name": team.name,
                    "new_color": team.color,
                    "colorinput": new_color,
                },
                status=200,
            )
        except json.JSONDecodeError:
            logger.error("Invalid JSON data")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.error("Invalid request method")
        return JsonResponse({"error": "Invalid request method"}, status=405)