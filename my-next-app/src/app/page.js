"use client"

import Image from "next/image";
import Header from "../components/header";
import Footer from "../components/footer";
import "../app/page.css"; 
import React, { useEffect, useState } from 'react'; 
import { useRouter } from "next/navigation";

export default function Home() {
  // parameters for the students (would be from a survey)
  const [students, setStudents] = useState([]); 
  const [generateTeamName, setGenerateTeamName] = useState("")
  const [teamSize, setTeamSize] = useState(1);
  const [diversifyGender, setDiversifyGender] = useState(false);
  const [matchPreferences, setMatchPreferences] = useState(false); // New state for matching preferences
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [title, setTitle] = useState(""); // New state for team title
  const [message, setMessage] = useState("");

  const router = useRouter();

  // handle user submission 
  const handGenerateTeamNameChange = (e) => {
    setGenerateTeamName(e.target.value);
};

const handleDiversifyGenderChange = (e) => {
  setDiversifyGender(e.target.checked); 
}

const handleMatchPreferencesChange = (e) => {
  setMatchPreferences(e.target.checked); 
}

const handleTeamSize = (e) => {
  setTeamSize(Number(e.target.value)); // Ensures teamSize is treated as a number
}

const getCSRFToken = () => {
  const csrfToken = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("csrftoken="))
    ?.split("=")[1];
  return csrfToken || "";
};

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/`);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data || []);
    } catch (err) {
      setError(err.message); 
    } 
  };
  fetchStudents();
}, []);

// Fetch teams based on the generated team name
const checkTeamNameExists = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/getTeams/${generateTeamName}/`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.teams && data.teams.length > 0) {
        return true; // Team name already exists
      }
    }
    return false; // Team name doesn't exist
  } catch (error) {
    console.error("Error checking team name", error);
    return false;
  }
};

// Handles generating teams
const handleSaveTeams = async () => {
  // Check if the team name already exists
  const teamNameExists = await checkTeamNameExists();
  if (teamNameExists) {
    setMessage("The team name already exists. Please input another name.");
    return; // Stop further processing if the name already exists
  }

  setLoading(true);

  const totalStudents = students.length;
  const numberOfTeams = Math.ceil(totalStudents / teamSize);
  const teamsData = [];

  for (let i = 0; i < numberOfTeams; i++) {
    const teamPeople = students.slice(i * teamSize, (i + 1) * teamSize);
    
    const people = teamPeople.map((student) => ({
      name: student.name,
      studentID: student.studentID,
      gender: student.gender,
      academicHistory: student.academicHistory,
      timeSlot: student.timeSlot,
      enemy: student.enemy, 
      PM: student.PM,
      projectPreference: student.projectPreference,
    }));
    
    // Creating the team object in the correct format
    teamsData.push({
      id: `team-${i + 1}`,  // Generate a unique team id, e.g., "team-1", "team-2"
      name: `Team ${i + 1}`,
      people: people,
      color: "yellow",  // Set default color or dynamically change if needed
    });
    
    console.log("This is the data", teamsData);
  }

  try {
    const csrfToken = getCSRFToken(); // Get CSRF token
    const response = await fetch(`http://127.0.0.1:8000/api/saveTeamData/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",           
        "X-CSRFToken": csrfToken,  // Add CSRF token here
      },
      body: JSON.stringify({
        generate_team_name: generateTeamName,  // The class or team generation name
        diversify_gender: diversifyGender,    // Diversify gender flag
        match_preferences: matchPreferences,  // Match preferences flag
        teams: teamsData,                     // Teams data in the required format
      }),
    });

    const data = await response.json();
    setMessage(data.message || "Error saving teams");

    const queryParams = new URLSearchParams();
    queryParams.append("generate_team_name", generateTeamName);

    router.push(`/results?${queryParams.toString()}`);

  } catch (error) {
    setMessage("Failed to save teams");
  } finally {
    setLoading(false);
  }
};

return (
 <div>
  <Header />
  <div className="pageContent">
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Student List</h1>
      
      {/* Loading & Error Messages */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-red-500">{message}</p>}

      {/* Table for Students */}
      <div className="home-table-container">
        <table className="home-student-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Gender</th>
              <th>Academic History</th>
              <th>Time Slot Availability</th>
              <th>Enemies</th>
              <th>PM Experience</th>
              <th>Project Preference</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.studentID}</td>
                <td>{student.name}</td>
                <td>{student.gender}</td>
                <td>{student.academicHistory}</td>
                <td>{student.timeSlot}</td>
                <td>{student.enemy}</td>
                <td>{student.PM}</td>
                <td>{student.projectPreference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <label className="block mb-2">Title of Team Generation:</label>
      <input
          type="text"
          className="border p-2 rounded w-full"
          value={generateTeamName}
          onChange={handGenerateTeamNameChange}
          placeholder="Enter team title"
        />

      <label className="block mb-2">Select number of people per team:</label>
      <select
          className="border p-2 rounded"
          value={teamSize}
          onChange={handleTeamSize}
        >
          {Array.from({ length: Math.min(students.length, 26) }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

      <div className="mt-4">
        <label className="block mb-2">Do you want to diversify teams?</label>
        <label>
          <input
            type="radio"
            name="diversifyGender"
            value="yes"
            checked={diversifyGender === true}
            onChange={() => setDiversifyGender(true)}
          />
          Yes
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="diversifyGender"
            value="no"
            checked={diversifyGender === false}
            onChange={() => setDiversifyGender(false)}
          />
          No
        </label>
      </div>

      <div className="mt-4">
        <label className="block mb-2">Do you want to match students with their preferences?</label>
        <label>
          <input
            type="radio"
            name="matchPreferences"
            value="yes"
            checked={matchPreferences === true}
            onChange={() => setMatchPreferences(true)}
          />
          Yes
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="matchPreferences"
            value="no"
            checked={matchPreferences === false}
            onChange={() => setMatchPreferences(false)}
          />
          No
        </label>
      </div>
       
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSaveTeams}
      >
        Generate Teams
      </button>
    
    </div>
  </div>
  <Footer />
 </div>
);
}