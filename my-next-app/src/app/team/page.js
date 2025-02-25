"use client";

import Header from "../../components/header";
import React, { useState } from 'react'; 
import Footer from "../../components/footer"; 
import "../team/team.css";
import TeamHeader from "../../components/teamHeader"; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTeams = [
    { id: "team-1", name: "Team 1", people: [
        { name: "Alice", studentID: "123", gender: "Female" }, 
        { name: "Bob", studentID: "456", gender: "Male" }
      ], color: "red" },
    { id: "team-2", name: "Team 2", people: [
        { name: "Charlie", studentID: "789", gender: "Male" }, 
        { name: "David", studentID: "012", gender: "Male" }
      ],  color: "green" },
      { 
        id: "team-3", 
        name: "Team 3", 
        people: [
          { name: "Eve", studentID: "345", gender: "Female" },
          { name: "Frank", studentID: "678", gender: "Male" }
        ], 
        color: "red" 
      },
      { 
        id: "team-4", 
        name: "Team 4", 
        people: [
          { name: "Grace", studentID: "901", gender: "Female" },
          { name: "Hank", studentID: "234", gender: "Male" }
        ], 
        color: "green" 
      },
      { 
        id: "team-5", 
        name: "Team 5", 
        people: [
          { name: "Ivy", studentID: "567", gender: "Female" },
          { name: "Jack", studentID: "890", gender: "Male" }
        ], 
        color: "red" 
      },
      { 
        id: "team-6", 
        name: "Team 6", 
        people: [
          { name: "Karen", studentID: "1234", gender: "Female" },
          { name: "Leo", studentID: "5678", gender: "Male" }
        ], 
        color: "yellow" 
      },
      { 
        id: "team-7", 
        name: "Team 7", 
        people: [
          { name: "Mona", studentID: "2345", gender: "Female" },
          { name: "Nash", studentID: "6789", gender: "Male" }
        ], 
        color: "green" 
      },
      { 
        id: "team-8", 
        name: "Team 8", 
        people: [
          { name: "Olivia", studentID: "3456", gender: "Female" },
          { name: "Paul", studentID: "7890", gender: "Male" }
        ], 
        color: "green" 
      },
      { 
        id: "team-9", 
        name: "Team 9", 
        people: [
          { name: "Quinn", studentID: "4567", gender: "Female" },
          { name: "Rick", studentID: "8901", gender: "Male" }
        ], 
        color: "yellow" 
      },
      { 
        id: "team-10", 
        name: "Team 10", 
        people: [
          { name: "Sophie", studentID: "5678", gender: "Female" },
          { name: "Tom", studentID: "9012", gender: "Male" }
        ], 
        color: "red" 
      },
      { 
        id: "team-11", 
        name: "Team 11", 
        people: [
          { name: "Uma", studentID: "6789", gender: "Female" },
          { name: "Vince", studentID: "1230", gender: "Male" }
        ], 
        color: "green" 
      },
      { 
        id: "team-12", 
        name: "Team 12", 
        people: [
          { name: "Wendy", studentID: "7891", gender: "Female" },
          { name: "Xander", studentID: "2341", gender: "Male" }
        ], 
        color: "yellow" 
      },
      { 
        id: "team-13", 
        name: "Team 13", 
        people: [
          { name: "Yara", studentID: "8902", gender: "Female" },
          { name: "Zane", studentID: "3450", gender: "Male" }
        ], 
        color: "yellow" 
      },
    ]

export default function Team() {
    const [isOpen, setIsOpen] = useState(false); 
    const [selectedAttributes, setSelectedAttributes] = useState(new Set());
    const [visualizationTypes, setVisualizationTypes] = useState({});
    const [teams, setTeams] = useState(initialTeams);
    const [selectedTeam, setSelectedTeam] = useState(null); 
    const [search, setSearch] = useState(''); 
    const [selectedColor, setSelectedColor] = useState("");


    const toggleDropdown = () => {
        setIsOpen(!isOpen); 
    };

    const teamSettings = [
        {id: 1, text: 'Total Team Size'},
        {id: 2, text: 'Max Team Size'},
        {id: 3, text: 'Min Team Size'},
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
    const handleTeamChange = (person, newTeamName) => {
        // Update the team for a specific person
        const updatedTeams = initialTeams.map((team) => {
          if (team.name === newTeamName) {
            return {
              ...team,
              people: [...team.people, person]  // Add the person to the selected team
            };
          }
          return team;
        });
        setSelectedTeam(updatedTeams.find((team) => team.name === newTeamName)); // Set the updated team as selected
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
                            <h1>asdasda - Teams</h1>
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
                                <div className = "dragDrop">
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
                                                        {teams.map((team, index) => (
                                                            <Draggable key={team.id} draggableId={team.id} index={index}>
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
                                                        ))}
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
                                                            {selectedTeam && selectedTeam.people ? (
                                                                selectedTeam.people.map((person, index) => (
                                                                    <tr key={index}>
                                                                        <td>{person.name}</td>
                                                                        <td>{person.studentID}</td>
                                                                        <td>{person.gender}</td>
                                                                        <td>
                                                                            <select 
                                                                                value={selectedTeam.name} 
                                                                                onChange={(e) => handleTeamChange(person, e.target.value)}
                                                                            >
                                                                                <option>----------</option>
                                                                                {initialTeams.map((team) => (
                                                                                    <option key={team.id} value={team.name}>
                                                                                        {team.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="4">No team selected or no members available.</td>
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
