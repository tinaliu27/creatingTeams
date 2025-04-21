// ComparisonBarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary components of Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {

    const data = {
      labels: [
        "no experience",
        "minimal experience in small projects",
        "some experience in multiple projects",
        "lots of experience"
      ],
      datasets: [
        {
          label: "Class Average",
          data: [0, 1, 1, 1], // Team 1 data
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Team 1 color
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: "Team Average",
          data: [1, 2, 0, 3], // Team 2 data
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Team 2 color
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }
      ]
    };

    setChartData(data);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div>
      <h2>Experience Comparison Bar Chart</h2>
      {chartData ? (
        <div style={{ position: "relative", height: "400px", width: "600px" }}>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default BarChart;
