"use client";

import Header from "../../components/header";
import React, { useState } from 'react'; 
import Footer from "../../components/footer"; 
import "../team/team.css";
import TeamHeader from "../../components/teamHeader"; 

export default function Team() {
    const [isOpen, setIsOpen] = useState(false); 
    const [selectedAttributes, setSelectedAttributes] = useState(new Set());
    const [visualizationTypes, setVisualizationTypes] = useState({});

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

    const visualizationOptions = {
        academicHistory: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        timeslot: ['Tally View', 'Heatmap'],
        gender: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        enemies: ['Tally View', 'Satisfaction Percentage'],
        pm: ['Tally View', 'Pie Chart', 'Radar Graph', 'Comparison Bar Graph'],
        projectPreference: ['Tally View', 'Satisfaction Percentage']
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
                                {selectedAttributes.size > 0 && (
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
                                                                <input
                                                                    type="radio"
                                                                    name={`visualizationType-${attribute}`}
                                                                    value={option}
                                                                    checked={visualizationTypes[attribute] === option}
                                                                    onChange={() => handleVisualizationSelect(attribute, option)}
                                                                />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="visualizeTeamsContainer">
                        <div className="visualizeTeams"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
