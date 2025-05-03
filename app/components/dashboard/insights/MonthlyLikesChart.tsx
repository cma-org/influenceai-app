// app/dashboard/instagram-insights/components/MonthlyLikesChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyLikesDataPoint } from '@/app/hooks/useInstagramInsights';

interface MonthlyLikesChartProps {
    data?: MonthlyLikesDataPoint[];
}

const MonthlyLikesChart: React.FC<MonthlyLikesChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-black p-4">No data available</div>;
    }

    // Format the data for the chart
    const chartData = data.map(item => {
        // Parse the date and format it
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return {
            date: formattedDate,
            likes: item.value
        };
    });

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
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
                        formatter={(value: number) => [value.toLocaleString(), 'Likes']}
                    />
                    <Area
                        type="monotone"
                        dataKey="likes"
                        stroke="#f27a1a"
                        fill="#f27a1a"
                        fillOpacity={0.3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyLikesChart;