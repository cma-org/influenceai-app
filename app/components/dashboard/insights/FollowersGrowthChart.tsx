// app/dashboard/instagram-insights/components/FollowersGrowthChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FollowerGrowthDataPoint } from '@/app/hooks/useInstagramInsights';

interface FollowersGrowthChartProps {
    data?: FollowerGrowthDataPoint[];
    hasMinimumFollowers?: boolean;
}

const FollowersGrowthChart: React.FC<FollowersGrowthChartProps> = ({ data, hasMinimumFollowers = true }) => {
    if (hasMinimumFollowers === false) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-600 font-medium">This feature requires at least 100 followers</p>
                <p className="text-black text-sm mt-1">Instagram only provides this data for accounts with 100+ followers</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Format the data for the chart
    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        followers: item.value
    }));

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Followers']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="followers"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FollowersGrowthChart;