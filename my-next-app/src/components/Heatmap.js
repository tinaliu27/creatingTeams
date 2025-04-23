import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const HeatMap = ({ generateTeamName, teamName }) => {
    const [timeSlotData, setTimeSlotData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimeSlotData = async () => {
            try {
                if (!generateTeamName || !teamName) {
                    setError("Both generateTeamName and teamName are required.");
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/api/getTimeSlotAvailbilityCount?generate_team_name=${generateTeamName}&teamName=${teamName}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();

                if (data.time_slot_availability_counts) {
                    const timeSlotCounts = data.time_slot_availability_counts;
                    const formattedData = Object.keys(timeSlotCounts).map((category) => ({
                        x: category,
                        y: 'Time Slots',
                        value: timeSlotCounts[category],
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
    }, [generateTeamName, teamName]);

    // Prepare data for the heatmap
    const labels = ['No Answer Provided', '6-9 am', '9-12 pm', '12-3 pm', '3-6 pm', '6-9 pm', '9-12 am'];
    const dataValues = labels.map((label) => {
        const slot = timeSlotData.find((item) => item.x === label);
        return slot ? slot.value : 0; // Default to 0 if no data
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Time Slot Availability',
                data: dataValues,
                backgroundColor: (context) => {
                    const value = context.raw;
                    const max = Math.max(...dataValues);
                    const min = Math.min(...dataValues);
                    const normalizedValue = (value - min) / (max - min || 1); // Normalize between 0 and 1
                    return `rgba(255, 99, 132, ${normalizedValue})`; // Gradient effect
                },
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Value: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Time Slots',
                },
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Availability',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <div style={{ width: '400px', height: '200px', margin: 'auto'}}>
                <Chart type="bar" data={chartData} options={options} />
            </div>
        </div>
    );
};

export default HeatMap;