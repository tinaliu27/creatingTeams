// pages/home.js
import { useState, useEffect } from 'react';

const Home = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // get students 
    fetch('http://localhost:8000/api/students/')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  return (
    <div>
      <h1>List of Students</h1>
      <ul>
        {students.map(student => (
          <li key={student.studentNumber}>
            {student.firstName} {student.lastName} - {student.studentNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
