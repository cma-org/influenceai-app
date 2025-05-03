// app/dashboard/instagram-insights/components/GenderSplitChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DemographicDataPoint } from '@/app/hooks/useInstagramInsights';

// Colors for the pie chart segments
const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

// Gender display names
const GENDER_NAMES: Record<string, string> = {
    'M': 'Male',
    'F': 'Female',
    'U': 'Unknown'
};

interface GenderSplitChartProps {
    data?: DemographicDataPoint[];
}

const GenderSplitChart: React.FC<GenderSplitChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Format the data for the chart
    const chartData = data.map(item => ({
        name: GENDER_NAMES[item.gender || 'U'] || 'Unknown',
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
                        labelLine={true}
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
                            return [`${value} (${percent}%)`, name];
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GenderSplitChart;