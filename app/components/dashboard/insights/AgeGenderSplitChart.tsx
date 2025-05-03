// app/dashboard/instagram-insights/components/AgeGenderSplitChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DemographicDataPoint } from '@/app/hooks/useInstagramInsights';

// Gender colors
const GENDER_COLORS: Record<string, string> = {
    'M': '#0088FE',
    'F': '#FF8042',
    'U': '#00C49F'
};

// Gender display names
const GENDER_NAMES: Record<string, string> = {
    'M': 'Male',
    'F': 'Female',
    'U': 'Unknown'
};

interface AgeGenderSplitChartProps {
    data?: DemographicDataPoint[];
}

const AgeGenderSplitChart: React.FC<AgeGenderSplitChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Process the data to group by age range with separate male/female values
    const ageGroups: Record<string, Record<string, number>> = {};

    data.forEach(item => {
        const age = item.age || 'Unknown';
        const gender = item.gender || 'U';

        if (!ageGroups[age]) {
            ageGroups[age] = {};
        }

        ageGroups[age][gender] = item.value;
    });

    // Format the data for the chart
    const chartData = Object.keys(ageGroups).map(age => ({
        age,
        ...Object.keys(GENDER_NAMES).reduce((acc, gender) => ({
            ...acc,
            [GENDER_NAMES[gender]]: ageGroups[age][gender] || 0
        }), {})
    }));

    // Sort chart data by age group
    chartData.sort((a, b) => {
        // Extract the numbers from age ranges like "18-24"
        const aStart = parseInt(a.age.split('-')[0]);
        const bStart = parseInt(b.age.split('-')[0]);

        return aStart - bStart;
    });

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="age"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                    />
                    <Legend />
                    {Object.entries(GENDER_NAMES).map(([key, name]) => (
                        <Bar
                            key={key}
                            dataKey={name}
                            fill={GENDER_COLORS[key]}
                            stackId="a"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AgeGenderSplitChart;