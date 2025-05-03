// hooks/useInstagramInsights.ts
import { useState, useEffect } from 'react';

// Types for Instagram Insights
export interface BasicInsights {
    follower_count: number;
    avg_likes: number;
    avg_comments: number;
    avg_saves: number;
    avg_shares: number;
    engagement_rate: number;
}

export interface FollowerGrowthDataPoint {
    date: string;
    value: number;
}

export interface FollowerGrowthData {
    follower_growth: FollowerGrowthDataPoint[];
}

export interface PostEngagementDataPoint {
    month: string;
    average_engagement: number;
    post_count: number;
    data: string;
}

export interface PostEngagementData {
    post_engagements_by_month: PostEngagementDataPoint[];
}

export interface MonthlyLikesDataPoint {
    date: string;
    value: number;
}

export interface MonthlyLikesData {
    current_month_likes: MonthlyLikesDataPoint[];
}

export interface DemographicDataPoint {
    country?: string;
    city?: string;
    gender?: string;
    age?: string;
    value: number;
}

export interface DemographicData {
    countries: DemographicDataPoint[];
    cities: DemographicDataPoint[];
    gender_split: DemographicDataPoint[];
    age_gender_split: DemographicDataPoint[];
}

// Hook for basic insights
export const useBasicInsights = () => {
    const [data, setData] = useState<BasicInsights | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/instagram/insights/account');

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch insights');
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook for follower growth
export const useFollowerGrowth = (days: number = 30) => {
    const [data, setData] = useState<FollowerGrowthData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMinimumFollowers, setHasMinimumFollowers] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/instagram/insights/followers-growth`);
                const jsonData = await response.json();

                if (!response.ok) {
                    // Check if the error is specifically about not having enough followers
                    if (jsonData.error &&
                        (jsonData.error.includes("less than 100 followers") ||
                            jsonData.error.includes("minimum required followers"))) {
                        setHasMinimumFollowers(false);
                        setError("This feature requires at least 100 followers");
                    } else {
                        throw new Error(jsonData.error || 'Failed to fetch follower growth data');
                    }
                } else {
                    setData(jsonData);
                    setHasMinimumFollowers(true);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                setHasMinimumFollowers(true); // Default to true for other types of errors
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [days]);

    return { data, loading, error, hasMinimumFollowers };
};

// Hook for post engagements
export const usePostEngagements = (months: number = 6) => {
    const [data, setData] = useState<PostEngagementData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/instagram/insights/post-engagements?months=${months}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch post engagements data');
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [months]);

    return { data, loading, error };
};

// Hook for current month likes
export const useMonthlyLikes = () => {
    const [data, setData] = useState<MonthlyLikesData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/instagram/insights/current-month-likes');

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch monthly likes data');
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook for demographic data
export const useDemographics = () => {
    const [data, setData] = useState<DemographicData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMinimumFollowers, setHasMinimumFollowers] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/instagram/insights/demographics');
                const jsonData = await response.json();

                if (!response.ok) {
                    // Check if the error is specifically about not having enough followers
                    if (jsonData.error &&
                        (jsonData.error.includes("less than 100 followers") ||
                            jsonData.error.includes("minimum required followers"))) {
                        setHasMinimumFollowers(false);
                        setError("Demographic insights require at least 100 followers");
                    } else {
                        throw new Error(jsonData.error || 'Failed to fetch demographic data');
                    }
                } else {
                    setData(jsonData);
                    setHasMinimumFollowers(true);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                setHasMinimumFollowers(true); // Default to true for other types of errors
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error, hasMinimumFollowers };
};