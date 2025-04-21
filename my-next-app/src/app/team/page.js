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
import BarChart from "../../components/BarChart";
import RadarChart from "../../components/RadarChartAcademicHistory";
import Heatmap from "../../components/Heatmap";
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

    const handleApplyAttributes = () => {
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
                    color: "#FF0000",  // Default color (can be dynamic)
                    project: "Project 1",
                })));
               
                setInitialTeams(data.teams.map(team => ({
                    name: team.title,  // Ensure name matches API's "title"
                    students: team.students,  // Keep student details if needed
                    color: "#FF0000"  // Default color (can be dynamic)
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
        {id: 1, text: 'Total Team Size', textValue: students.length || 0},
        {id: 2, text: 'Max Team Size', textValue: maxTeamSize},
        {id: 3, text: 'Min Team Size', textValue: Math.min(...teams.map(team => team.students.length))},
        {id: 4, text: 'Project Set'},
        {id: 5, text: 'List Options'},
        {id: 6, text: 'Behaviour Option'},
        {id: 7, text: 'Overall Satisfaction'}
    ];

    const data = [
        "Apple",
        "Banana",
        "Cherry",
        "Date",
        "Elderberry",
        "Fig",
        "Grape",
        "Honeydew",
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
    };

    const handleVisualizationSelect = (attribute, option) => {
        if (showVisualizations) {  
            setVisualizationTypes((prev) => ({
                ...prev,
                [attribute]: option,
            }));
        }
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
      
    const changeTeamColor = (color) => {
        if (selectedTeam) {
            const updatedTeams = teams.map(team =>
                team.name === selectedTeam.name
                    ? { ...team, color }
                    : team
            );
            setTeams(updatedTeams);
            setSelectedColor(color); // Update the selected color state
        }
    }
   
    
    // search feature 
    const filteredData = data.filter(item => 
        item.toLowerCase().includes(search.toLowerCase())
      );
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
    
    const fetchPMCount = async () => {
        const attribute = "ProjectManagement"
        if (visualizationTypes[attribute] !== "Tally View") {
            return; 
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/getPMCount?generate_team_name=${generateTeamName}&teamName=Team+1`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setSelectedPMData(data);
        } catch (error) {
            console.error("Error fetching PM count:", error);
        }
    }

      
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
                            <h2>                           
                            </h2>
                            <hr />
                            <h3>Step 1: Choose attributes to visualize</h3>
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

                            <p>These attributes are taken from the survey that was used to generate this team set.</p>

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
                                    <tr>
                                        <td>
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
                                                width: "150px",
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
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                        ...provided.draggableProps.style,
                                                        backgroundColor: team.color,
                                                        padding: "5px",
                                                        width: "150px",
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        border: "1px solid black",
                                                        }}
                                                        onClick={() => handleTeamClick(team)}
                                                    >
                                                        <h3>{team.name}</h3>
                                                    </div>
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
                                                <div className = "teamInfoAttributes">
                                                        <p>{selectedTeam.name}</p>    
                                                        <p>{selectedTeam.project}</p>     
                                                                                                            <select
                                                            value={selectedColor}
                                                            onChange={(e) => changeTeamColor(e.target.value)}
                                                            style={{
                                                                padding: "10px",
                                                                borderRadius: "4px",
                                                                border: "1px solid #ccc",
                                                            }}
                                                        >
                                                            <option value="red">Not Ready</option>
                                                            <option value="yellow">In Progress</option>
                                                            <option value="green">Ready</option>
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
                                                                            {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "timeslot") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="timeSlotSection">
                                                                                        {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="timeSlotTallyView">
                                                                                                <p>
                                                                                                Time Slot Availability: 
                                                                                                {timeSlotTallyCount
                                                                                                    ? JSON.stringify(timeSlotTallyCount) 
                                                                                                    : ""}
                                                                                                </p>                                                                                               </div>
                                                                                        </ul>
                                                                                        )}
                                                                                         {Object.values(visualizationTypes).includes("Heatmap") && (
                                                                                        <ul>
                                                                                            <div className="timeSlotHeatMap">
                                                                                                <HeatMap generateTeamName={generateTeamName} teamName={selectedTeam.name}/>
                                                                                                                                                                                                  </div>
                                                                                        </ul>
                                                                                        )}
                                                                                  </div>
                                                                                </ul>
                                                                              ))}
                                                                              {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "academicHistory") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="academicHistorySection">
                                                                                    {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="94">
                                                                                            <p>
                                                                                                Academic History: 
                                                                                                {academicHistoryTallyCount
                                                                                                    ? JSON.stringify(academicHistoryTallyCount) 
                                                                                                    : ""}
                                                                                                </p>        
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                    {Object.values(visualizationTypes).includes("Pie Chart") && (
                                                                                        <ul>
                                                                                            <div className="3890">
                                                                                            <PieChartAcademicHistory generateTeamName={generateTeamName} teamName={selectedTeam.name} />

                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                    {Object.values(visualizationTypes).includes("Radar Graph") && (
                                                                                        <ul>
                                                                                            <div className="5678" style={{width: '100%', display: 'flex'}}>
                                                                                            <RadarChartComponent generateTeamName={generateTeamName} teamName= {selectedTeam.name}/>

                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                    {Object.values(visualizationTypes).includes("Comparison Bar Graph") && (
                                                                                        <ul>
                                                                                            <div className="6789">
                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                  </div>
                                                        
                                                                                </ul>
                                                                              ))}
                                                                              {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "gender") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="genderSection">
                                                                                    {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="88">
                                                                                                Gender: 
                                                                                                {genderTallyCount
                                                                                                    ? JSON.stringify(genderTallyCount) 
                                                                                                    : ""}
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                    {Object.values(visualizationTypes).includes("Pie Chart") && (
                                                                                        <ul>
                                                                                            <div className="99">
                                                                                            <PieChartGender generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                     {Object.values(visualizationTypes).includes("Radar Graph") && (
                                                                                        <ul>
                                                                                            <div className="00">
                                                                                                <RadarChartGender generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                     {Object.values(visualizationTypes).includes("Comparison Bar Graph") && (
                                                                                        <ul>
                                                                                            <div className="7800">
                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                  </div>
                                                                                </ul>
                                                                              ))}

                                                                              {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "enemies") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="enemiesSection">
                                                                                    {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="90">
                                                                                                Enemies: 
                                                                                                {enemyTallyCount
                                                                                                    ? JSON.stringify(enemyTallyCount) 
                                                                                                    : ""}
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                    {Object.values(visualizationTypes).includes("Satisfacation Percentage") && (
                                                                                        <ul>
                                                                                            <div className="89">
                                                                                            </div>
                                                                                        </ul>
                                                                                    )} 
                                                                                  </div>
                                                                                </ul>
                                                                              ))}
                                                                              {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "ProjectManagement") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="PMSection">
                                                                                    {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="123">
                                                                                            <p>
                                                                                                Academic History: 
                                                                                                {PMTallyCount
                                                                                                    ? JSON.stringify(PMTallyCount) 
                                                                                                    : "Loading..."}
                                                                                                </p>        
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                    {Object.values(visualizationTypes).includes("Pie Chart") && (
                                                                                        <ul>
                                                                                            <div className="256">
                                                                                            <PieChartPM generateTeamName={generateTeamName} teamName={selectedTeam.name} />
                                                                                            </div>
                                                                                        </ul>
                                                                                    )} 
                                                                                     {Object.values(visualizationTypes).includes("Radar Graph") && (
                                                                                        <ul>
                                                                                            <div className="765">
                                                                                                <RadarChartPM generateTeamName={generateTeamName} teamName={selectedTeam.name} />

                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                    {Object.values(visualizationTypes).includes("Comparison Bar Graph") && (
                                                                                        <ul>
                                                                                            <div className="567">
                                                                                            </div>
                                                                                        </ul>
                                                                                    )}
                                                                                  </div>
                                                                                </ul>
                                                                              ))}
                                                                            {Object.entries(visualizationTypes)
                                                                              .filter(([key]) => key === "projectPreference") 
                                                                              .map(([key, value]) => ( 
                                                                                <ul key={key}>
                                                                                  <div className="preferenceSection">
                                                                                    {Object.values(visualizationTypes).includes("Tally View") && (
                                                                                        <ul>
                                                                                            <div className="projectPreferencePercentage">
                                                                                                <p>
                                                                                                Project Preference: 
                                                                                                {projectPreferenceTallyCount
                                                                                                    ? JSON.stringify(projectPreferenceTallyCount) 
                                                                                                    : "Loading..."}
                                                                                                </p>   
                                                                                            </div>
                                                                                        </ul>
                                                                                        )}
                                                                                    {Object.values(visualizationTypes).includes("Satisfacation Percentage") && (
                                                                                        <ul>
                                                                                            <div className="projectPreferencePercentage1">
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
                                                    <table className="studentTable">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Student ID</th>
                                                                <th>Gender</th>
                                                                <th>Academic History</th>
                                                                <th>Time Slot Availability</th>
                                                                <th>Enemy</th>
                                                                <th>PM</th>
                                                                <th>Project Preference</th>
                                                                <th>Move Student</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedTeam && selectedTeam.students && selectedTeam.students.length > 0 ? (
                                                                selectedTeam.students.map((student, index) => (
                                                                    <tr key={index}>
                                                                        <td>{student.name}</td>
                                                                        <td>{student.studentID}</td>
                                                                        <td>{student.gender}</td>
                                                                        <td>{student.academicHistory}</td>
                                                                        <td>{student.timeSlot}</td>
                                                                        <td>{student.enemy}</td>
                                                                        <td>{student.PM}</td>
                                                                        <td>{student.projectPreference}</td>
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
                                                                        No team selected or no members available.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

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

