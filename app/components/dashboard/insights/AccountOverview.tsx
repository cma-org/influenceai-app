// app/dashboard/instagram-insights/components/AccountOverview.tsx
import React from 'react';
import { BasicInsights } from '@/app/hooks/useInstagramInsights';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string | number;
    isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-black text-sm">{title}</p>
        <p className="text-3xl text-black font-bold mt-2">{value}</p>
        {change !== undefined && (
            <p className={`text-sm mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '↑' : '↓'} {change}
            </p>
        )}
    </div>
);

interface AccountOverviewProps {
    insights: BasicInsights | null;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ insights }) => {
    if (!insights) {
        return <div>No data available</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
                title="Followers"
                value={insights.follower_count.toLocaleString()}
            />
            <StatCard
                title="Average Likes"
                value={Math.round(insights.avg_likes).toLocaleString()}
            />
            <StatCard
                title="Engagement Rate"
                value={`${insights.engagement_rate.toFixed(2)}%`}
            />
            <StatCard
                title="Average Comments"
                value={Math.round(insights.avg_comments).toLocaleString()}
            />
        </div>
    );
};

export default AccountOverview;