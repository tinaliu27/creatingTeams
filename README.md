## Directed Studies T2 2025 
Working on improving the UI/UX with Dr. Bowen Hui to improve functionality for the Teamamble Analytics App. Working with Django and Next.js/Bootstrap. 

## Run App
Two terminals:
### backend: 
```
cd backend 
python manage.py runserver
```
#### Format of the backend based on the Model.py 
```
{
    "id": 1,
    "generate_team_name": "Project X",
    "diversify_gender": true,
    "match_preferences": false,
    "teams": [
        {
            "id": 1,
            "name": "Team Alpha",
            "color": "Blue",
            "students": [
                {
                    "studentID": "S12345",
                    "name": "Alice Johnson",
                    "gender": "Female",
                    "academicHistory": "Computer Science",
                    "timeSlot": "Morning",
                    "enemy": "Bob Smith",
                    "PM": "Charlie Brown",
                    "projectPreference": "AI Development"
                }
            ]
        },
        {
            "id": 2,
            "name": "Team Beta",
            "color": "Green",
            "students": [
                {
                    "studentID": "S67890",
                    "name": "Bob Smith",
                    "gender": "Male",
                    "academicHistory": "Mechanical Engineering",
                    "timeSlot": "Evening",
                    "enemy": "Alice Johnson",
                    "PM": "David White",
                    "projectPreference": "Robotics"
                }
            ]
        }
    ]
}

```
### frontend 
```
cd my-next-app
npm run dev 
```