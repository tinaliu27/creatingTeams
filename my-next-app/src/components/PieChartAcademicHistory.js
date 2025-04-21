import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChartAcademicHistory = ({ generateTeamName, teamName }) => {
    const [chartData, setChartData] = useState({
        labels: ["No Answer Provided", "0-50%", "50-60%", "60%-70%", "70-80%", "80-90%", "90-100%"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // Placeholder data
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#000000', '#36H8EB', '#EF6184'],
                hoverOffset: 4,
            },
        ],
    });

    useEffect(() => {
        const fetchAcademicHistory = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/getAcademicHistoryCount?generate_team_name=${generateTeamName}&teamName=${teamName}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                if (data.academic_history_counts) {
                    setChartData({
                        labels: Object.keys(data.academic_history_counts),
                        datasets: [
                            {
                                data: Object.values(data.academic_history_counts),
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

        fetchAcademicHistory();
    }, [generateTeamName, teamName]);

    return <Pie data={chartData} />;
};

export default PieChartAcademicHistory;
