// app/dashboard/instagram-insights/components/PostEngagementsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PostEngagementDataPoint } from '@/app/hooks/useInstagramInsights';

interface PostEngagementsChartProps {
    data?: PostEngagementDataPoint[];
}

const PostEngagementsChart: React.FC<PostEngagementsChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 p-4">No data available</div>;
    }

    // Format the data for the chart
    const chartData = data.map(item => {
        // Parse the month (format: 'YYYY-MM') and format it
        const [year, month] = item.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const formattedMonth = date.toLocaleString('en-US', { month: 'short' });

        return {
            month: formattedMonth,
            engagement: Math.round(item.average_engagement),
            posts: item.post_count
        };
    });

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => {
                            if (name === 'engagement') {
                                return [value.toLocaleString(), 'Avg. Engagement'];
                            }
                            return [value, 'Posts'];
                        }}
                    />
                    <Bar dataKey="engagement" fill="#8884d8" name="Avg. Engagement" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PostEngagementsChart;