"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import '../results/results.css';
export default function Results() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamSize = searchParams.get("team_size");
        const response = await fetch(
          `http://127.0.0.1:8000/api/generateTeams/?team_size=${teamSize}`
        );
        console.log(searchParams.get("team_size")); // Should log the team size

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data.teams || []); // Ensure teams is always an array
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Generated Teams</h1>
      {teams.map((team, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-semibold">Team {index + 1}</h2>
          <ul className="list-disc ml-4">
            {team.map((member, idx) => (
              <li key={idx}>{member}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
