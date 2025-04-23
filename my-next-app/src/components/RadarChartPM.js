import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const RadarChartPM = ({ generateTeamName, teamName }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(10); // Default max scale

    useEffect(() => {
        const fetchPMHistory = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/getPMCount?generate_team_name=${generateTeamName}&teamName=${teamName}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                if (data.pm_experience_count) {
                    const formattedData = Object.entries(data.pm_experience_count).map(([category, count]) => ({
                        category,
                        count,
                    }));

                    setChartData(formattedData);

                    // Calculate max value dynamically to adjust the graph scale
                    const maxCount = Math.max(...formattedData.map(d => d.count), 1); // Ensure at least 1
                    setMaxValue(maxCount);
                }
            } catch (error) {
                console.error("Error fetching PM experience data:", error);
            }
        };

        fetchPMHistory();
    }, [generateTeamName, teamName]);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="50%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, maxValue]} tickCount={6} />
                <Radar name="PM Experience" dataKey="count" stroke="#FF6384" fill="#FF6384" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartPM;
