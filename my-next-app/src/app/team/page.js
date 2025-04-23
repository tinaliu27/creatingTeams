"use client";

import Header from "../../components/header";
import React, { useState, useEffect } from 'react'; 
import Footer from "../../components/footer"; 
import "../team/team.css";
import TeamHeader from "../../components/teamHeader"; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSearchParams } from "next/navigation"; 
import PieChartPM from "../../components/PieChartPM";
import PieChartAcademicHistory from "@/components/PieChartAcademicHistory";
import PieChartGender from "@/components/PieChartGender";
import RadarChartComponent from "../../components/RadarChartAcademicHistory";
import RadarChartGender from "@/components/RadarChartGender";
import RadarChartPM from "@/components/RadarChartPM";
import HeatMap from "@/components/Heatmap";
import BarChartAcademicHistory from "@/components/BarChartAcademicHistory";
import BarChartGender from "@/components/BarChartGender";
import BarChartPM from "@/components/BarChartPM";
export default function Team() {
    const searchParams = useSearchParams(); // Get query parameters

    const [isOpen, setIsOpen] = useState(false); 
    const [selectedAttributes, setSelectedAttributes] = useState(new Set());
    const [selectedTeam, setSelectedTeam] = useState(null); 
    const [initialTeams, setInitialTeams] = useState([]);
    const [search, setSearch] = useState(''); 
    const [selectedColor, setSelectedColor] = useState("");
    const [teams, setTeams] = useState([]); // Stores all teams
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState([]); 
    const generateTeamName = searchParams.get("generate_team_name"); // Get the team name from the URL
    const [isStudentListOpen, setIsStudentListOpen] = useState(false);
    
    // selecting graphs 
    const [visualizationTypes, setVisualizationTypes] = useState({});
    const [projectPreference, setProjectPreferenceCount] = useState(null);

    const [PMPieChartData, setPMPieChartData] = useState(null);
    const [showVisualizations, setShowVisualizations] = useState(false);

    // all tally views 
    const [timeSlotTallyCount, setTimeSlotTallyCount] = useState({}); 
    const [genderTallyCount, setGenderTallyCount] = useState({}); 
    const [PMTallyCount, setPMTallyCount] = useState({}); 
    const [academicHistoryTallyCount, setAcademicHistoryTallyCount] = useState({});
    const [projectPreferenceTallyCount, setProjectPreferenceTallyCount] = useState({}); 
    const [enemyTallyCount, setEnemyTallyCount] = useState({}); 

    // satisfaction percentage
    const [enemySatisfactionPercentage, setEnemySatisfactionPercentage] = useState(null);
    const [PMSatisficationPercentage, setPMSatisficationPercentage] = useState(null);

    const handleApplyAttributes = () => {
        const unselectedAttributes = [...selectedAttributes].filter(
            (attribute) => !visualizationTypes[attribute]
        );
    
        if (unselectedAttributes.length > 0) {
            return; // Prevent showing visualizations if any attribute is missing a selection
        }
    
        setShowVisualizations(true); // Enables visualization display only after button click
    };
    
    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                if (!generateTeamName) {
                    throw new Error("No team name, can't retrieve the right data."); 
                }
                const queryParams = new URLSearchParams();
                queryParams.append("generate_team_name", generateTeamName);
          
            
                const teamDetails = await fetch(`http://127.0.0.1:8000/api/getTeams/?generate_team_name=${generateTeamName}`);
                console.log("Response status:", teamDetails.status); 

                if (!teamDetails.ok) {
                    throw new Error("Failed to fetch the team details"); 
                }
                const data = await teamDetails.json(); 
                console.log("API Response:", data);
                if (!data.teams || data.teams.length === 0) {
                    throw new Error("No teams found.");
                }
        
                setTeams(data.teams.map(team => ({
                    name: team.title,  // Ensure name matches API's "title"
                    students: team.students,  // Keep student details if needed
                    color: team.color || '#FF9180',  // Default color (can be dynamic)
                    project: "Project 1",
                })));
               
                setInitialTeams(data.teams.map(team => ({
                    name: team.title,  // Ensure name matches API's "title"
                    students: team.students,  // Keep student details if needed
                    color: team.color  // Default color (can be dynamic)
                })));
                
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        }

        const fetchTallyProjectPreference = async () => {
            try {
                if (!generateTeamName) {
                    throw new Error("No team name, can't retrieve the right data."); 
                }
                const queryParams = new URLSearchParams();
                queryParams.append("generate_team_name", generateTeamName);
        
                const projectPreferenceCount = await fetch(`http://127.0.0.1:8000/api/getPreferencesTeams?generate_team_name=${generateTeamName}`);
                console.log("Response status:", projectPreferenceCount.status); 

                if (!projectPreferenceCount.ok) {
                    throw new Error("Failed to fetch the team details"); 
                }
                const data = await projectPreferenceCount.json(); 
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("No data found.");
                }

                const formattedTeams = data.map(teamObj => {
                    const teamName = Object.keys(teamObj)[0]; // Get the team name
                    const preferences = teamObj[teamName] || {}; // Ensure it's an object
        
                    console.log("Processing Team:", teamName, "Preferences:", preferences);
        
                    return {
                        name: teamName,
                        preferences: preferences, 
                    };
                });
        

                setProjectPreferenceCount(formattedTeams);
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        }
    
        fetchTeamDetails(); 
        fetchTallyProjectPreference();

      }, [generateTeamName]);


    // get tally count for time slot availability 
    const fetchTimeSlotTally = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getTimeSlotAvailbilityCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setTimeSlotTallyCount(data.time_slot_availability_counts);
            console.log(data.time_slot_availability_counts); 
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchTimeSlotTally(selectedTeam.name);
        }
    }, [selectedTeam]); 

    // get tally count for gender 
    const fetchGenderTally = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getGenderCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setGenderTallyCount(data.gender_counts);
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchGenderTally(selectedTeam.name);
        }
    }, [selectedTeam]);

    // get tally count for academic history  
    const fetchAcademicHistoryTally = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getAcademicHistoryCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setAcademicHistoryTallyCount(data.academic_history_counts);
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchAcademicHistoryTally(selectedTeam.name);
        }
    }, [selectedTeam]);
 
    // get tally count for gender 
    const fetchPMTally = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getPMCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setPMTallyCount(data.pm_experience_count);
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchPMTally(selectedTeam.name);
        }
    }, [selectedTeam]);

    // get tally count for Project prefernece 
    const fetchTallyProjectPreference = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getDemoProjectPreferenceCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setProjectPreferenceTallyCount(data.preference_counts);
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchTallyProjectPreference(selectedTeam.name);
        }
    }, [selectedTeam]);
// get tally count for Project prefernece 
    const fetchEnemyTally = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getEnemyCount?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error('Network not connecting'); 
            }
            const data = await response.json(); 
            setEnemyTallyCount(data.enemy_count);
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }
    }
    useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchEnemyTally(selectedTeam.name);
        }
    }, [selectedTeam]);



        // Extract students and teams
    const students = teams.length > 0 ? teams.flatMap((team) => team.students) : [];
    const maxTeamSize = teams.length > 0 ? Math.max(...teams.map((team) => team.students.length)) : 0;
    const minTeamSize = teams.length > 0 ? Math.min(...teams.map((team) => team.students.length)) : 0;
  
        
    const toggleDropdown = () => {
        setIsOpen(!isOpen); 
    };

    const teamSettings = [
        {id: 1, text: 'Total Team Size: ', textValue: students.length || 0},
        {id: 2, text: 'Max Team Size: ', textValue: maxTeamSize},
        {id: 3, text: 'Min Team Size: ', textValue: Math.min(...teams.map(team => team.students.length))},
        {id: 4, text: 'Project Set: Project 1'},
        {id: 5, text: 'List Options: '},
        {id: 6, text: 'Behaviour Option: '},
        {
            id: 7,
            text: 'Overall Satisfaction: ',
            textValue: selectedAttributes.has('projectPreference') && selectedAttributes.has('enemies')
                ? `Project Preference: ${PMSatisficationPercentage !== null ? `${PMSatisficationPercentage}%` : ' '}, Enemy Satisfaction ${enemySatisfactionPercentage !== null ? `${enemySatisfactionPercentage}%` : ' '}`
                : selectedAttributes.has('projectPreference')
                ? `Project Preference: ${PMSatisficationPercentage !== null ? `${PMSatisficationPercentage}%` : ' '}`
                : selectedAttributes.has('enemies')
                ? `Enemy Satisfaction: ${enemySatisfactionPercentage !== null ? `${enemySatisfactionPercentage}%` : ' '}`
                : 'No Satisfaction Metrics Selected',
        },
    ];

    const visualizationOptions = {
        academicHistory: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        timeslot: ['Tally View', 'Heatmap'],
        gender: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        enemies: ['Tally View', 'Satisfaction Percentage'],
        ProjectManagement: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        projectPreference: ['Tally View', 'Satisfaction Percentage']
    };
    const recommendations = {
        "Gender and Degree Major": ["Tally View", "Pie Chart"],
        "Timeslot Availability": ["Heatmap"],
        "Preferences for projects and friends/enemies": ["Satisfaction Percentage"],
        "The Big Five Personality traits": ["Radar Graph", "Comparison Bar Graph"]
    };

    const visualizationToRecommendationMap = {
        academicHistory: "Gender and Degree Major",
        timeslot: "Timeslot Availability",
        gender: "Gender and Degree Major",
        enemies: "Preferences for projects and friends/enemies",
        ProjectManagement: "Gender and Degree Major",
        projectPreference: "Preferences for projects and friends/enemies"
    };
    
    // Toggle chart visibility for an attribute
    const toggleChartVisibility = (attribute) => {
        setShowCharts((prev) => ({
        ...prev,
        [attribute]: !prev[attribute],
        }));
    };

    const toggleAttributeSelect = (attribute) => {
        setSelectedAttributes((prev) => {
            const newSet = new Set(prev);
            newSet.has(attribute) ? newSet.delete(attribute) : newSet.add(attribute);
            return newSet;
        });

        setShowVisualizations(false); 
    };

    const handleVisualizationSelect = (attribute, option) => {
        setVisualizationTypes((prev) => ({
            ...prev,
            [attribute]: option,
        }));
    
        // Ensure visualizations are not shown until the "Apply Attributes" button is clicked
        setShowVisualizations(false);
    };


    // drag and drop 
    const onDragEnd = (result) => {
        if (!result.destination) return; // Drop outside list
        const newTeams = [...teams];
        console.log("this is the drag info", newTeams);
        const [movedTeam] = newTeams.splice(result.source.index, 1);
        newTeams.splice(result.destination.index, 0, movedTeam);
        setTeams(newTeams);
      };
    
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };
      
    const changeTeamColor = async (color) => {
        if (selectedTeam) {
            try {
                // Send the selected color to the backend
                const response = await fetch(`http://127.0.0.1:8000/api/updateTeamColor?generate_team_name=${generateTeamName}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        generate_team_name: generateTeamName, // Include generate_team_name
                        team_name: selectedTeam.name,        // Include team_name
                        color: color,                        // Pass the selected color
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to update team color");
                }
    
                const data = await response.json();
                console.log("Team color updated:", data);
    
                // Update the local state to reflect the change
                const updatedTeams = teams.map((team) =>
                    team.name === selectedTeam.name ? { ...team, color: color } : team
                );
                setTeams(updatedTeams);
                setSelectedColor(color); // Update the selected color state
            } catch (error) {
                console.error("Error updating team color:", error);
            }
        }
    };
   
    
    const handleTeamChange = async (person, newTeamName) => {
        try {
            // Make the API call to move the student to the new team
            const response = await fetch(`http://127.0.0.1:8000/api/moveStudent/?generate_team_name=${generateTeamName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentID: person.studentID, 
                    newTeamID: newTeamName, 
                    generateTeamName: generateTeamName,
                }),
            });
    
            if (response.ok) {
                // If the response is successful, parse the response as JSON
                const result = await response.json();
                console.log('Student moved successfully:', result);
    
                // Update the UI with the new team
                const updatedTeams = initialTeams.map((team) => {
                    if (team.name === newTeamName) {
                        return {
                            ...team,
                            people: [...team.students, person], // Add the person to the selected team
                        };
                    }
                    return team;
                });
    
                setSelectedTeam(updatedTeams.find((team) => team.name === newTeamName)); // Set the updated team as selected
            } else {
                // If there's an error, parse the error message as text and log it
                const errorText = await response.text();  // Get response as text in case of error
                console.error('API Error:', errorText);
            }
        } catch (error) {
            console.error('Error while making API call:', error);
        }
    };

    const fetchEnemySatisfactionPercentage = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getEnemySatisfactionPercentage?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error("Failed to fetch enemy satisfaction percentage");
            }
            const data = await response.json();
            setEnemySatisfactionPercentage(data.enemy_satisfaction_percentage);
        } catch (error) {
            console.error("Error fetching enemy satisfaction percentage:", error);
        }
    }; 

    const fetchProjectPreferenceSatisfactionPercentage = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getProjectPreferenceSatisfactionPercentage?generate_team_name=${generateTeamName}&teamName=${selectedTeam.name}`);
            if (!response.ok) {
                throw new Error("Failed to fetch project preference satisfaction percentage");
            }
            const data = await response.json();
            setPMSatisficationPercentage(data.project_preference_satisfaction_percentage); 
        }   catch (error) {
            console.error("Error fetching project preference satisfaction percentage:", error);
        }
    };
   useEffect(() => {
        if (selectedTeam && selectedTeam.name) {
            fetchEnemySatisfactionPercentage();
            fetchProjectPreferenceSatisfactionPercentage();
        }
    }, [selectedTeam]);

    return (
        <div className="teamContents">
            <Header />
            <div className="pageContents">
                <TeamHeader />
                <div className="teamContainer">
                    <div className="teamSettingsContainer">
                        <div className="teamSettings">
                            <button onClick={toggleDropdown} className="teamSettingsDropdownMenu">
                                <h1>Team Settings Used</h1>
                                <span className={`arrow ${isOpen ? 'rotate' : ''}`}>&#9662;</span>
                            </button>
                            {isOpen && (
                                <ul className="dropdownList">
                                    {teamSettings.map((item) => (
                                        <li key={item.id} className="dropdownItem">
                                            {item.text}
                                            {item.textValue}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="visualizeTeamSettingsContainer">
                        <div className="visualizeTeamSettings">
                            <h1>Visualize Survey Responses</h1>
                            <hr />
                            <h3>Step 1: Choose attributes to visualize <i>(Active Selections will appear blue)</i></h3>
                            <div className="attributeButtons">
                                {Object.keys(visualizationOptions).map((attribute) => (
                                    <button 
                                        key={attribute} 
                                        onClick={() => toggleAttributeSelect(attribute)}
                                        className={selectedAttributes.has(attribute) ? "selected" : ""}
                                    >
                                        {attribute.replace(/([A-Z])/g, " $1").trim()}
                                    </button>
                                ))}
                            </div>

                            <p><i>These attributes are taken from the survey that was used to generate this team set.</i></p>

                            <h3>Step 2: Select a visualization type for the chosen attribute(s):</h3>
                            <div className="visualizeChartContainer">
                            <table className="visualizationTable">
                                <thead>
                                    <tr>
                                        <th>Questions</th>
                                        <th>Tally View</th>
                                        <th>Pie Chart</th>
                                        <th>Heatmap</th>
                                        <th>Satisfaction Percentage</th>
                                        <th>Radar Graph</th>
                                        <th>Comparison Bar Graph</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...selectedAttributes].map((attribute) => (
                                        <tr key={attribute}>
                                            <td>{attribute.replace(/([A-Z])/g, " $1").trim()}</td>
                                            {["Tally View", "Pie Chart", "Heatmap", "Satisfaction Percentage", "Radar Graph", "Comparison Bar Graph"].map((option) => (
                                                <td key={option} className="text-center">
                                                    {visualizationOptions[attribute]?.includes(option) && (
                                                        <div>
                                                            <input
                                                                type="radio"
                                                                name={`visualizationType-${attribute}`}
                                                                value={option}
                                                                checked={visualizationTypes[attribute] === option}
                                                                onChange={() => handleVisualizationSelect(attribute, option)}
                                                            />
                                                            {recommendations[visualizationToRecommendationMap[attribute]]?.includes(option) && (
                                                                <div style={{ fontSize: "12px", color: "#2180d6", fontWeight: "bold" }}>
                                                                    (recommended)
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className = "buttonrow">
                                        <td className = "buttondata">
                                            <div className = "showAttributesContainer">
                                                <div className = "showAttributes">
                                                    <button  
                                                        onClick={handleApplyAttributes}
                                                        >Apply Attributes</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        </div>
                    </div>

                    <div className="visualizeTeamsContainer">
                        <div className="visualizeTeams">
                            <h1>{generateTeamName} - Teams</h1>
                            <hr></hr>
                            <h2>Section(s) used to generate teams: </h2>

                            <div className = "dragDropContainer">
                                <div className="dragDrop">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div style={{ padding: "20px" }}>
                                        <Droppable droppableId="all-teams" direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
                                        {(provided) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                minHeight: "200px",
                                                border: "1px solid #ccc",
                                                maxHeight: "500px",
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                            }}
                                            >
                                            {teams.length > 0 ? (
                                                teams.map((team, index) => (
                                                    <Draggable
                                                    key={team.id ? String(team.id) : `fallback-${index}`}
                                                    draggableId={team.id ? String(team.id) : `fallback-${index}`}
                                                    index={index}
                                                    >                                                
                                                    {(provided) => (
                                                    <div
                                                        className = "scrollableLeft"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                        ...provided.draggableProps.style,
                                                        backgroundColor: team.color,
                                                       
                                                        }}
                                                        onClick={() => handleTeamClick(team)}
                                                    >
                                                        <h3 className="teamName" data-number={team.name.replace("Team ", "")}>
                                                                {team.name}
                                                            </h3>                                                    </div>
                                                    )}
                                                </Draggable>
                                                ))
                                            ) : (
                                                <p style={{ textAlign: "center", padding: "10px" }}>No teams available</p>
                                            )}
                                            {provided.placeholder}
                                            </div>
                                        )}
                                        </Droppable>
                                    </div>
                                    </DragDropContext>

                                </div>
                                <div className = "teamInfoContainer">
                                        {selectedTeam && (
                                            <div className = "teamInfo">
                                                <div className="teamInfoAttributes">
                                                    <p>{selectedTeam?.name || "No Team Selected"}</p>    
                                                    <p>{selectedTeam?.project || "No Project Assigned"}</p>     
                                                    <select
                                                        value={selectedTeam?.color || "#FF9180"} // Use selectedTeam.color as the value
                                                        onChange={(e) => {
                                                            const newColor = e.target.value;
                                                            changeTeamColor(newColor); // Update the backend and state
                                                            setSelectedTeam((prev) => ({ ...prev, color: newColor })); // Update the selectedTeam color locally
                                                        }}
                                                        style={{
                                                            padding: "10px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #ccc",
                                                            backgroundColor: selectedTeam?.color || "#FF9180", // Dynamically set the background color
                                                            color: selectedTeam?.color === 
                                                            "#FF9180" ? "white" : "black", // Adjust text color for better contrast
                                                        }}
                                                    >
                                                        <option value="#FF9180">Not Ready</option>
                                                        <option value="#FFF8B8">In Progress</option>
                                                        <option value="#CAF2C2">Ready</option>
                                                    </select>
                                                </div>
                                                <div className = "teamInfoAttributeInfoGraphicsContainer">
                                                    <div className = "teamInfoAttributeInfoGraphicsContainer">
                                                            {/* Visualization Display Section */}
                                                        {showVisualizations && (
                                                            <div className="projectPreference">
                                                                {projectPreference
                                                                    .filter((team) => team.name === selectedTeam.name)
                                                                    .map((team, index) => {
                                                                        const totalStudents = selectedTeam.students.length;
                                                                        const preferredProjectCount = team.preferences[selectedTeam.project] || 0;
                                                                        const satisfactionPercentage =
                                                                            totalStudents > 0 ? (preferredProjectCount / totalStudents) * 100 : 0;

                                                                        return (
                                                                            <div key={index} className="scrollable-x">
                                                                            {/* Render only if "Timeslot Availability" exists in visualizationTypes */}
                                                                            {showVisualizations && 
                                                                                Object.entries(visualizationTypes)
                                                                                .filter(([key]) => selectedAttributes.has(key)) // Ensure only selected attributes are processed
                                                                                .map(([key, value]) => (
                                                                                    <ul key={key}>
                                                                                    <div className={`${key}Section`}>
                                                                                        {value === "Tally View" && (
                                                                                        <ul>
                                                                                            <div className={`${key}TallyView`}>
                                                                                            <h3>{key.replace(/([A-Z])/g, " $1").trim()}</h3>
                                                                                            {key === "timeslot" && timeSlotTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(timeSlotTallyCount).map(([range, count]) => (
                                                                                                    <li key={range}>
                                                                                                    {range}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            {key === "academicHistory" && academicHistoryTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(academicHistoryTallyCount).map(([range, count]) => (
                                                                                                    <li key={range}>
                                                                                                    {range}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            {key === "gender" && genderTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(genderTallyCount).map(([gender, count]) => (
                                                                                                    <li key={gender}>
                                                                                                    {gender}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            {key === "enemies" && enemyTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(enemyTallyCount).map(([enemy, count]) => (
                                                                                                    <li key={enemy}>
                                                                                                    {enemy}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            {key === "ProjectManagement" && PMTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(PMTallyCount).map(([pm, count]) => (
                                                                                                    <li key={pm}>
                                                                                                    {pm}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            {key === "projectPreference" && projectPreferenceTallyCount && (
                                                                                                <ul>
                                                                                                {Object.entries(projectPreferenceTallyCount).map(([preference, count]) => (
                                                                                                    <li key={preference}>
                                                                                                    {preference}: {count}
                                                                                                    </li>
                                                                                                ))}
                                                                                                </ul>
                                                                                            )}
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {/*Timeslot */}
                                                                                        {value === "Heatmap" && key === "timeslot" && (
                                                                                        <ul>
                                                                                            <div className={`${key}HeatMap`}>
                                                                                            <HeatMap generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {/* academic history  */}

                                                                                        {value === "Pie Chart" && key === "academicHistory" && (
                                                                                        <ul>
                                                                                            <div className={`${key}PieChart`}>
                                                                                            <PieChartAcademicHistory generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {value === "Radar Graph" && key === "academicHistory" && (
                                                                                        <ul>
                                                                                            <div className={`${key}RadarGraph`} style={{ width: "100%", display: "flex" }}>
                                                                                            <RadarChartComponent generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {value === "Comparison Bar Graph" && key === "academicHistory" && (
                                                                                        <ul>
                                                                                            <div className={`${key}ComparisonBarGraph`}>
                                                                                            <BarChartAcademicHistory generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {/* Gender */}
                                                                                        {value === "Pie Chart" && key ===  "gender" && (
                                                                                        <ul>
                                                                                            <div className={`${key}PieChart`}>
                                                                                            <PieChartGender generateTeamName={generateTeamName} teamName={selectedTeam.name} /> 
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {value === "Radar Graph" && key === "gender" && (
                                                                                        <ul>
                                                                                            <div className={`${key}RadarGraph`} style={{ width: "100%", display: "flex" }}>
                                                                                            <RadarChartGender generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {value === "Comparison Bar Graph" && key === "gender" && (
                                                                                        <ul>
                                                                                            <div className={`${key}ComparisonBarGraph`}>
                                                                                            <BarChartGender generateTeamName={generateTeamName} teamName={selectedTeam.name} /> 
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                        {/* Enemies */}
                                                                                        {value === "Satisfaction Percentage" && key === "enemies" && (
                                                                                            <ul>
                                                                                                <div className={`${key}SatisfactionPercentage`}>
                                                                                                    {selectedTeam && (
                                                                                                        <p>Enemy Satisfaction Percentage: {enemySatisfactionPercentage !== null ? `${enemySatisfactionPercentage}%` : "Loading..."}</p>

                                                                                                    )}
                                                                                                </div>
                                                                                            </ul>
                                                                                        )}
                                                                                        {/* Project Managmeent  */}
                                                                                        {value === "Pie Chart" && key === "ProjectManagement" && (
                                                                                            <ul>
                                                                                                <div className={`${key}PieChart`}>
                                                                                                <PieChartPM generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                                </div>
                                                                                            </ul>
                                                                                        )}
                                                                                        {value === "Radar Graph" && key === "ProjectManagement" && (
                                                                                            <ul>
                                                                                                <div className={`${key}RadarGraph`} style={{ width: "100%", display: "flex" }}>
                                                                                                <RadarChartPM generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                                </div>
                                                                                            </ul>
                                                                                        )}
                                                                                        {value === "Comparison Bar Graph" && key === "ProjectManagement" && (
                                                                                            <ul>
                                                                                                <div className={`${key}ComparisonBarGraph`}>
                                                                                                <BarChartPM generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                                </div>
                                                                                            </ul>
                                                                                        )}
                                                                                        {/* Project Preference */}
                                                                                        {value === "Satisfaction Percentage" && key === "projectPreference" && (
                                                                                            <ul>
                                                                                                <div className={`${key}SatisfactionPercentage`}>
                                                                                                {value === "Satisfaction Percentage" && key === "projectPreference" && (
                                                                                            <ul>
                                                                                                <div className={`${key}SatisfactionPercentage`}>
                                                                                                    <h1>Selected Project: Project 1</h1>
                                                                                                    {selectedTeam && (
                                                                                                        <p>Project Preference Satisfaction Percentage: {PMSatisficationPercentage !== null ? `${PMSatisficationPercentage}%` : "Loading..."}</p>

                                                                                                    )}
                                                                                                </div>
                                                                                            </ul>
                                                                                            )}
                                                
                                                                                                </div>
                                                                                            </ul>
                                                                                        )}
                                                                                    </div>
                                                                                    </ul>
                                                                                ))}                                              
                                                                          </div>
                                                                          
                                                                        );
                                                                    })}
                                                            </div>
                                                        )}

                                    
                                                    </div> 
                                                </div> 
                                                <div className="studentList">
                                                    <button
                                                        onClick={() => setIsStudentListOpen((prev) => !prev)}
                                                        style={{
                                                            padding: "10px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #ccc",
                                                            backgroundColor: "#f0f0f0",
                                                            cursor: "pointer",
                                                            marginBottom: "10px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        {isStudentListOpen ? "Hide Students" : "Show Students"}
                                                        <span style={{ marginLeft: "10px" }}>
                                                            {isStudentListOpen ? "▲" : "▼"}
                                                        </span>
                                                    </button>

                                                    <table className="studentTable">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Student ID</th>
                                                                {selectedAttributes.has("gender") && <th>Gender</th>}
                                                                {selectedAttributes.has("academicHistory") && <th>Academic History</th>}
                                                                {selectedAttributes.has("timeslot") && <th>Time Slot Availability</th>}
                                                                {selectedAttributes.has("enemies") && <th>Enemy</th>}
                                                                {selectedAttributes.has("ProjectManagement") && <th>PM</th>}
                                                                {selectedAttributes.has("projectPreference") && <th>Project Preference</th>}
                                                                <th>Move Student</th>
                                                            </tr>
                                                        </thead>
                                                        {isStudentListOpen && (
                                                            <tbody>
                                                                {selectedTeam && selectedTeam.students && selectedTeam.students.length > 0 ? (
                                                                    selectedTeam.students.map((student, index) => (
                                                                        <tr key={index}>
                                                                            <td>{student.name}</td>
                                                                            <td>{student.studentID}</td>
                                                                            {selectedAttributes.has("gender") && <td>{student.gender}</td>}
                                                                            {selectedAttributes.has("academicHistory") && <td>{student.academicHistory}</td>}
                                                                            {selectedAttributes.has("timeslot") && <td>{student.timeSlot}</td>}
                                                                            {selectedAttributes.has("enemies") && <td>{student.enemy}</td>}
                                                                            {selectedAttributes.has("ProjectManagement") && <td>{student.PM}</td>}
                                                                            {selectedAttributes.has("projectPreference") && <td>{student.projectPreference}</td>}
                                                                            <td>
                                                                                <select
                                                                                    value={selectedTeam?.name || ""}
                                                                                    onChange={(e) => handleTeamChange(student, e.target.value)}
                                                                                >
                                                                                    <option value="">----------</option>
                                                                                    {initialTeams.map((team) => (
                                                                                        <option key={team.name} value={team.name}>
                                                                                            {team.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                                                                            No students available.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                            
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

