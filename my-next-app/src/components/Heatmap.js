import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import HeatmapChart from 'recharts'; 
// Register chart elements for Chart.js
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const HeatMap = ({ generateTeamName, teamName }) => {
    const [timeSlotData, setTimeSlotData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimeSlotData = async () => {
            try {
                // Ensure generateTeamName and teamName are provided
                if (!generateTeamName || !teamName) {
                    setError("Both generateTeamName and teamName are required.");
                    return;
                }

                // Construct the API endpoint with the provided parameters
                const response = await fetch(
                    `http://127.0.0.1:8000/api/getTimeSlotAvailabilityCount?generate_team_name=${generateTeamName}&teamName=${teamName}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                
                if (data.time_slot_availability_counts) {
                    const timeSlotCounts = data.time_slot_availability_counts;
                    const formattedData = Object.keys(timeSlotCounts).map((category, index) => ({
                        x: category, // Time Slot Category
                        y: 0, // Just set to zero for now, since we are simulating a heatmap
                        v: timeSlotCounts[category], // Time Slot Count
                    }));
                    setTimeSlotData(formattedData);
                } else {
                    setError('No data available for the specified team');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTimeSlotData();
    }, [generateTeamName, teamName]); // Depend on both generateTeamName and teamName

    const chartData = {
        datasets: [
            {
                label: 'Time Slot Availability Heatmap',
                data: timeSlotData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Set color for heatmap
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <div style={{ width: '80%', height: '400px', margin: 'auto' }}>
                <HeatmapChart data={chartData} options={{
                    responsive: true,
                    scales: {
                        x: {
                            type: 'category',
                            labels: ['No Answer Provided', '6-9 am', '9-12 pm', '12-3 pm', '3-6 pm', '6-9 pm', '9-12 am'],
                        },
                        y: {
                            type: 'category',
                            labels: ['Time Slots'],
                        },
                    },
                }} />
            </div>
        </div>
    );
};

export default HeatMap;
