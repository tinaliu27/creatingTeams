import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChartGender = ({ generateTeamName, teamName }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenderAverages = async () => {
      try {
        const teamResponse = await fetch(
          `http://127.0.0.1:8000/api/getGenderAverageForTeam?generate_team_name=${generateTeamName}&teamName=${teamName}`
        );

        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team average data");
        }

        const teamData = await teamResponse.json();

        const classResponse = await fetch(
          `http://127.0.0.1:8000/api/getGenderAverageForClass?generate_team_name=${generateTeamName}`
        );

        if (!classResponse.ok) {
          throw new Error("Failed to fetch class average data");
        }

        const classData = await classResponse.json();

        const chartData = {
          labels: ["Gender Metric Averages"],
          datasets: [
            {
              label: "Team Average",
              data: [teamData.average_metric],
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Team average color
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: "Class Average",
              data: [classData.average_metric],
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Class average color
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching gender average data:", error);
        setError(error.message);
      }
    };

    fetchGenderAverages();
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
          text: "Average Gender Metric (%)",
        },
      },
    },
  };

  return (
    <div>
      <h2>Team vs Class Average Gender Metric</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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