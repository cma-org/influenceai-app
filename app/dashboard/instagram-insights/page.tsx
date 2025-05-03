// app/dashboard/instagram-insights/page.tsx
'use client';

import React from 'react';
import {
    useBasicInsights,
    usePostEngagements,
    useMonthlyLikes,
    useDemographics,
    useFollowerGrowth,
} from '@/app/hooks/useInstagramInsights';
import AccountOverview from '@/app/components/dashboard/insights/AccountOverview';
import PostEngagementsChart from '@/app/components/dashboard/insights/PostEngagementsChart';
import FollowerGrowthChart from '@/app/components/dashboard/insights/FollowersGrowthChart';
import MonthlyLikesChart from '@/app/components/dashboard/insights/MonthlyLikesChart';
import LocationByCountryChart from '@/app/components/dashboard/insights/LocationByCountryChart';
import LocationByCityChart from '@/app/components/dashboard/insights/LocationByCityChart';
import GenderSplitChart from '@/app/components/dashboard/insights/GenderSplitChart';
import AgeGenderSplitChart from '@/app/components/dashboard/insights/AgeGenderSplitChart';

export default function InstagramInsightsDashboard() {
    const { data: basicInsights, loading: basicLoading, error: basicError } = useBasicInsights();
    const { data: followerGrowth, loading: followerLoading, error: followerError, hasMinimumFollowers: hasMinFollowers } = useFollowerGrowth();
    const { data: postEngagements, loading: engagementLoading, error: engagementError } = usePostEngagements();
    const { data: monthlyLikes, loading: likesLoading, error: likesError } = useMonthlyLikes();
    const { data: demographics, loading: demographicsLoading, error: demographicsError } = useDemographics();

    if (basicLoading || engagementLoading || likesLoading || demographicsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const anyError = basicError || engagementError || likesError;
    if (anyError) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md m-4">
                <p className="font-bold">Error</p>
                <p>{anyError}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-black mb-8">Instagram Insights Dashboard</h1>

            {/* Account Overview */}
            <div className="mb-8">
                <h2 className="text-xl text-black font-semibold mb-4">Account Overview</h2>
                <AccountOverview insights={basicInsights} />
            </div>

            {/* Followers Growth & Post Engagements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold text-black mb-4">Followers Growth (Last Month)</h2>
                    <FollowerGrowthChart data={followerGrowth?.follower_growth} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold text-black mb-4">Post Engagements (Last 6 Months)</h2>
                    <PostEngagementsChart data={postEngagements?.post_engagements_by_month} />
                </div>
            </div>

            {/* Monthly Likes */}
            <div className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Likes This Month</h2>
                    <MonthlyLikesChart data={monthlyLikes?.current_month_likes} />
                </div>
            </div>

            {/* Location Demographics */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Location by Country</h2>
                    <LocationByCountryChart data={demographics?.countries} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Location by City</h2>
                    <LocationByCityChart data={demographics?.cities} />
                </div>
            </div> */}

            {/* Gender & Age Demographics */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Gender Split</h2>
                    <GenderSplitChart data={demographics?.gender_split} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Age & Gender Split</h2>
                    <AgeGenderSplitChart data={demographics?.age_gender_split} />
                </div>
            </div> */}
        </div>
    );
}