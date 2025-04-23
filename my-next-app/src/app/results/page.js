"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../results/results.css";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function Results() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const generateTeamName = searchParams.get("generate_team_name"); // Get team name from URL query
        console.log(generateTeamName);

        const queryParams = new URLSearchParams();
        queryParams.append("generate_team_name", generateTeamName);
          
        const response = await fetch(
          `http://127.0.0.1:8000/api/getTeams/?generate_team_name=${generateTeamName}`
        );
        console.log("Response status:", response.status);  // Debugging


        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();
        setTeams(data.teams || []); // Assuming the response has a "teams" array
        console.log(data.teams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [searchParams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleBack = () => {
    router.push("/"); // Navigate back to the homepage
  };
  return (
    <div className = "top">
      <Header />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Generated Teams</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleBack}
        >
          Go Back
        </button>
        {teams.length === 0 ? (
          <p>No teams available</p>
        ) : (
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-card">
                <h2 className="font-semibold text-lg mb-2">{team.title}</h2>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.students.map((student, idx) => (
                      <tr key={idx}>
                        <td>{student.name}</td>
                        <td>{student.studentID}</td>
                        <td>{student.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
