import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const RadarChartGender = ({ generateTeamName, teamName }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(10); // Default max scale

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
                    const formattedData = Object.entries(data.gender_counts).map(([category, count]) => ({
                        category, 
                        count,
                    }));

                    setChartData(formattedData);

                    // Calculate max value dynamically to adjust the graph scale
                    const maxCount = Math.max(...formattedData.map(d => d.count), 1); // Ensure at least 1
                    setMaxValue(maxCount);
                }
            } catch (error) {
                console.error("Error fetching gender distribution:", error);
            }
        };

        fetchGenderHistory();
    }, [generateTeamName, teamName]);

    return (
        <ResponsiveContainer width="100%" height={200} margin="20px">
            <RadarChart cx="50%" cy="50%" outerRadius="50%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, maxValue]} tickCount={6} />
                <Radar name="Gender Distribution" dataKey="count" stroke="#FF6384" fill="#FF6384" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartGender;
