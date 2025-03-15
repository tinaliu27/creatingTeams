"use client";

import Header from "../../components/header";
import React, { useState, useEffect } from 'react'; 
import Footer from "../../components/footer"; 
import "../team/team.css";
import TeamHeader from "../../components/teamHeader"; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSearchParams } from "next/navigation"; // Ensure you're using this for query parameters
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import RadarChart from "../../components/RadarChart";
import Heatmap from "../../components/Heatmap";

export default function Team() {
    const searchParams = useSearchParams(); // Get query parameters

    const [isOpen, setIsOpen] = useState(false); 
    const [selectedAttributes, setSelectedAttributes] = useState(new Set());
    const [visualizationTypes, setVisualizationTypes] = useState({});
    const [selectedTeam, setSelectedTeam] = useState(null); 
    const [initialTeams, setInitialTeams] = useState([]);
    const [search, setSearch] = useState(''); 
    const [selectedColor, setSelectedColor] = useState("");
    const [teams, setTeams] = useState([]); // Stores all teams
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState([]); 
    const generateTeamName = searchParams.get("generate_team_name"); // Get the team name from the URL
    const [socket, setSocket] = useState(null);


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
                if (!data.teams || data.teams.length === 0) {
                    throw new Error("No teams found.");
                }
        
                setTeams(data.teams.map(team => ({
                    name: team.title,  // Ensure name matches API's "title"
                    students: team.students,  // Keep student details if needed
                    color: "#00000"  // Default color (can be dynamic)
                })));
               
                setInitialTeams(data.teams.map(team => ({
                    name: team.title,  // Ensure name matches API's "title"
                    students: team.students,  // Keep student details if needed
                    color: "#f0f0f0"  // Default color (can be dynamic)
                })));
                
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        }
        const fetchTeamGenerationDetails = async () => {
          try {
            if (!generateTeamName) {
              throw new Error("Team name is missing in the URL");
            }
    
            const response = await fetch(
              `http://127.0.0.1:8000/api/getGeneratedTeamDetails/?generate_team_name=${generateTeamName}`
            );
            console.log(response); 
            if (!response.ok) {
              throw new Error("Failed to fetch teams");
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchTeamDetails(); 

      }, [generateTeamName]);

      useEffect(() => {
        // Ensure WebSocket only runs in the browser
        if (typeof window !== "undefined") {
            try {
                const socket = new WebSocket('ws://' + window.location.host + '/ws/team-change/');

                // WebSocket open event
                socket.onopen = () => {
                    console.log("WebSocket connection established");
                };

                // WebSocket message event
                socket.onmessage = function (e) {
                    const data = JSON.parse(e.data);
                    const playerId = data.player_id;
                    const newTeamName = data.new_team_name;
                    // Update the UI with the new team name
                    document.getElementById(`player-${playerId}`).innerText = newTeamName;
                };

                // WebSocket error handling
                socket.onerror = (error) => {
                    console.error("WebSocket Error:", error);
                    setError("Failed to connect to the WebSocket server.");
                };

                // WebSocket close event
                socket.onclose = (event) => {
                    if (event.wasClean) {
                        console.log("WebSocket closed cleanly");
                    } else {
                        console.error("WebSocket closed with error");
                        setError("WebSocket connection closed with an error.");
                    }
                };

                // Save the socket to state
                setSocket(socket);
            } catch (err) {
                console.error("Error establishing WebSocket connection:", err);
                setError("Failed to establish WebSocket connection.");
            }
        }
    }, []);

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
        setVisualizationTypes((prev) => ({
            ...prev,
            [attribute]: option,
        }));
    };


    // drag and drop 
    const onDragEnd = (result) => {
        const { destination, source } = result;
    
        // If dropped outside of the list, do nothing
        if (!destination) return;
    
        // Create a copy of the teams array
        const reorderedTeams = Array.from(teams);
    
        // Remove the dragged team and insert it at the new index
        const [removed] = reorderedTeams.splice(source.index, 1);
        reorderedTeams.splice(destination.index, 0, removed);
    
        // Update the state with the reordered teams
        setTeams(reorderedTeams);
    };
    
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };
      
    const changeTeamColor = (color) => {
        if (selectedTeam) {
            const updatedTeams = teams.map(team => 
                team.id === selectedTeam.id
                    ? {...team, color}
                    : team
            );
            setTeams(updatedTeams);
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
                            {/* Search Bar
                            <div>
                                <h1>Search Example</h1>

                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ padding: '8px', width: '200px' }}
                                />

                                <ul>
                                    {filteredData.map((item, index) => (
                                    <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                </div>
                                 */}
                            <div className = "dragDropContainer">
                                <div className="dragDrop">
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <div style={{ padding: "20px" }}>
                                            <Droppable droppableId="all-teams" direction="vertical">
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
                                                        {teams.length > 0 ? teams.map((team, index) => (
                                                            <Draggable key={team.name} draggableId={team.name} index={index}>
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
                                                        )) : <p style={{ textAlign: "center", padding: "10px" }}>No teams available</p>}
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
                                                <div className="studentList">
                                                    <table className="studentTable">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Student ID</th>
                                                                <th>Gender</th>
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
