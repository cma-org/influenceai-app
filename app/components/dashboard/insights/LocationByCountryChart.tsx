// app/dashboard/instagram-insights/components/LocationByCountryChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DemographicDataPoint } from '@/app/hooks/useInstagramInsights';

// Colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FB7293', '#E57373', '#FFD54F', '#81C784'];

interface LocationByCountryChartProps {
    data?: DemographicDataPoint[];
}

const LocationByCountryChart: React.FC<LocationByCountryChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Sort data by value in descending order and get top 10
    const sortedData = [...data]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    // Format the data for the chart
    const chartData = sortedData.map(item => ({
        name: item.country || 'Unknown',
        value: item.value
    }));

    // Calculate total for percentage
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string, props: any) => {
                            const percent = (value / total * 100).toFixed(1);
                            return [`${value} (${percent}%)`, 'Followers'];
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LocationByCountryChart;