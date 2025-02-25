"use client"

import Image from "next/image";
import Header from "../components/header";
import Footer from "../components/footer";
import "../app/page.css"; 
import React, { useEffect, useState } from 'react'; 
import { useRouter } from "next/navigation";

export default function Home() {
  const [students, setStudents] = useState([]); 
  const [teamSize, setTeamSize] = useState(1);
  const [studentNumbers, setStudentNumbers] = useState([]); 
  const [genders, setGenders] = useState([]); 
  const [diversifyGender, setDiversifyGender] = useState(false);
  const [matchPreferences, setMatchPreferences] = useState(false); // New state for matching preferences
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/printStudents/");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.message);  

        // generate student numbers 
        const numbers = await Promise.all(data.message.map(async () => {
          const studentResponse = await fetch("http://127.0.0.1:8000/api/studentNumber/");
          const studentData = await studentResponse.json();
          return studentData.message;
        }));
        setStudentNumbers(numbers);
        
        // generate gender 
        const randomGenders = await Promise.all(data.message.map(async () => {
          const genderResponse = await fetch("http://127.0.0.1:8000/api/assignGender/");
          const genderData = await genderResponse.json();
          return genderData.message;
        }));
        setGenders(randomGenders);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleGenerateTeams = () => {
    // Go to the results page with additional query parameters for the new questions
    const queryParams = new URLSearchParams();
    queryParams.append("team_size", teamSize);
    queryParams.append("students", JSON.stringify(students));  // Pass students' names
    queryParams.append("student_numbers", JSON.stringify(studentNumbers));  // Pass students' numbers
    queryParams.append("genders", JSON.stringify(genders));  // Pass genders
    queryParams.append("diversify_gender", diversifyGender); // Pass diversify gender choice
    queryParams.append("match_preferences", matchPreferences); // Pass match preferences choice

    router.push(`/results?${queryParams.toString()}`);
  };

  return (
   <div>
    <Header/>
    <div className = "pageContent">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Student List</h1>
        
        {/* Table for Students */}
        <div className="home-table-container">
          <table className="home-student-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student}</td>
                  <td>{studentNumbers[index]}</td>
                  <td>{genders[index]}</td> 
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        <label className="block mb-2">Select number of people per team:</label>
        <select
            className="border p-2 rounded"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
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
          onClick={handleGenerateTeams}
        >
          Generate Teams
        </button>
      </div>
    </div>
    <Footer/>
   </div>
  );
}
