import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChartGender = ({ generateTeamName, teamName }) => {
    const [chartData, setChartData] = useState({
        labels: ["No Answer Provided",
        "Male",
        "Female",
        "Non-binary",
        "Other",
        "Prefer not to say",],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // Placeholder data
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#000000', '#36H8EB', '#EF6184'],
                hoverOffset: 4,
            },
        ],
    });

    useEffect(() => {
        const fetchGenderHistory = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/getGenderCount?generate_team_name=${generateTeamName}&teamName=${teamName}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                if (data.gender_counts) {
                    setChartData({
                        labels: Object.keys(data.gender_counts),
                        datasets: [
                            {
                                data: Object.values(data.gender_counts),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#000000', '#36H8EB', '#EF6184'],
                                hoverOffset: 4,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching academic history:", error);
            }
        };

        fetchGenderHistory();
    }, [generateTeamName, teamName]);

    return <Pie data={chartData} />;
};

export default PieChartGender;
