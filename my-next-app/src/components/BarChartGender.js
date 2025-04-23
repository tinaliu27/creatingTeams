import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary components of Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChartGender= ({ generateTeamName, teamName }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchTeamSpecificAverage = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/getTeamAverage?generate_team_name=${generateTeamName}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Find the specific team data
        const teamData = data.teams.find((team) => team.team_name === teamName);

        if (!teamData) {
          throw new Error(`Team with name "${teamName}" not found`);
        }

        // Prepare the chart data
        const chartData = {
          labels: ["Academic History Averages "],
          datasets: [
            {
              label: "Team Average",
              data: [teamData.average_academic_history],
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Team average color
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: "Class Average",
              data: [data.class_average_academic_history],
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Class average color
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching team-specific average data:", error);
      }
    };

    fetchTeamSpecificAverage();
  }, [generateTeamName, teamName]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Academic History (%)",
        },
      },
    },
  };

  return (
    <div>
      <h2>Team vs Class Average Academic History</h2>
      {chartData ? (
        <div style={{ position: "relative", height: "200px", width: "400px" }}>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default BarChartGender;