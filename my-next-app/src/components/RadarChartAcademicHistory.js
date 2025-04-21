import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const RadarChartAcademicHistory = ({ generateTeamName, teamName }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(10); // Default max scale

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
                    const formattedData = Object.entries(data.academic_history_counts).map(([category, count]) => ({
                        category,
                        count,
                    }));

                    setChartData(formattedData);

                    // Calculate max value dynamically to adjust the graph scale
                    const maxCount = Math.max(...formattedData.map(d => d.count), 1); // Ensure at least 1
                    setMaxValue(maxCount);
                }
            } catch (error) {
                console.error("Error fetching academic history:", error);
            }
        };

        fetchAcademicHistory();
    }, [generateTeamName, teamName]);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="50%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, maxValue]} tickCount={6} />
                <Radar name="Academic History" dataKey="count" stroke="#36A2EB" fill="#36A2EB" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartAcademicHistory;
