"use client"

import Image from "next/image";
import Header from "../components/header";
import "../app/page.css"; 
import React, { useEffect, useState } from 'react'; 
import { useRouter } from "next/navigation";

export default function Home() {
  const [students, setStudents] = useState([]); 
  const [teamSize, setTeamSize] = useState(1);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/students/");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  const handleGenerateTeams = () => {
    // Go to the results page
    router.push(`/results?team_size=${teamSize}`);
  };

  return (
   <div>
    <Header/>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Student List</h1>
      <ul className="list-disc ml-4 mb-4">
        {students.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
      <label className="block mb-2">Select number of people per team:</label>
      <select
        className="border p-2 rounded"
        value={teamSize}
        onChange={(e) => setTeamSize(Number(e.target.value))}
      >
        {[...Array(students.length).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleGenerateTeams}
      >
        Generate Teams
      </button>
    </div>
   </div>
  );
}
