// app/dashboard/instagram-insights/components/LocationByCityChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DemographicDataPoint } from '@/app/hooks/useInstagramInsights';

interface LocationByCityChartProps {
    data?: DemographicDataPoint[];
}

const LocationByCityChart: React.FC<LocationByCityChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Sort data by value in descending order and get top 10
    const sortedData = [...data]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    // Format the data for the chart
    const chartData = sortedData.map(item => ({
        city: item.city || 'Unknown',
        followers: item.value
    }));

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 60,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="city"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={100}
                    />
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Followers']}
                    />
                    <Bar dataKey="followers" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LocationByCityChart;