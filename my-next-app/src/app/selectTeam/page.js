"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../selectTeam/selectTeam.css";
import TeamHeader from "../../components/teamHeader";
import { useRouter } from "next/navigation"; // Added the useRouter hook

export default function SelectTeam() {
  const [teamNames, setTeamNames] = useState([]); // State to hold the team names
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        // Fetch the team names from the backend
        const response = await fetch('http://127.0.0.1:8000/api/getAllGeneratedTeamNames/');

        if (!response.ok) {
          throw new Error("Failed to fetch team names");
        }

        const data = await response.json();
        setTeamNames(data.generate_team_names || []); // Set the fetched team names
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamNames(); // Call the function to fetch the team names when the component mounts
  }, []);

  const handleNextPage = (teamName) => {
    const queryParams = new URLSearchParams();
    queryParams.append("generate_team_name", teamName); // Append the selected team name to query params
    router.push(`/team?${queryParams.toString()}`); // Redirect to the next page with query params
  };

  if (loading) return <p>Loading...</p>; // Show loading text while data is being fetched
  if (error) return <p>Error: {error}</p>; // Show error message if something goes wrong

  return (
    <div className="teamContents">
      <Header />
      <div className="pageContents">
        <h1 className="pageTitle">Select a Team Generation</h1>
        {teamNames.length === 0 ? (
          <p>No team generations available</p>
        ) : (
          <div className="teamNamesList">
            {/* Map over the teamNames array and display each one in a button */}
            {teamNames.map((teamName, index) => (
              <button
                key={index} // Add a key prop to the button for proper React rendering
                className="teamNameButton" // Optional class for styling
                onClick={() => handleNextPage(teamName)} // Pass the selected team name to the handler
              >
                <div className="teamNameDiv">
                  <h2>{teamName}</h2>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
