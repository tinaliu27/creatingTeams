"use client"
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import '../results/results.css';
import Header from "../../components/header";

export default function Results() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamSize = searchParams.get("team_size");
        const students = JSON.parse(searchParams.get("students") || "[]");
        const studentNumbers = JSON.parse(searchParams.get("student_numbers") || "[]");
        const genders = JSON.parse(searchParams.get("genders") || "[]"); // Get genders

        // Example fetch call (if needed) to generate teams
        const response = await fetch(
          `http://127.0.0.1:8000/api/generateTeams/?team_size=${teamSize}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data.teams || []); // Ensure teams is always an array

        // Combine students, student numbers, and genders in the result
        const teamsWithDetails = data.teams.map((team) =>
          team.map((member, index) => ({
            name: member,
            studentNumber: studentNumbers[students.indexOf(member)] || "N/A",
            gender: genders[students.indexOf(member)] || "N/A"  // Add gender to the member
          }))
        );
        setTeams(teamsWithDetails);
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
    router.push("/"); // Goes back to the homepage
  };

  return (
    <div>
      <Header/>
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
                <h2 className="font-semibold text-lg mb-2">Team {index + 1}</h2>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Gender</th> {/* Add gender column */}
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member, idx) => (
                      <tr key={idx}>
                        <td>{member.name}</td>
                        <td>{member.studentNumber}</td>
                        <td>{member.gender}</td> {/* Display gender */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
