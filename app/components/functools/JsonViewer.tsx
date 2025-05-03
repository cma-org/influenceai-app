'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/app/lib/utils/cookies';

export default function InstagramMedia() {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);

                // Check if we have an auth token
                const authToken = getAuthToken();
                console.log("log: ", authToken);
                if (!authToken) {
                    setError('No authentication token found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/instagram/media');

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch Instagram media');
                }

                const data = await response.json();
                setResponse(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8">Loading Instagram media...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Instagram Media Response</h2>
            <pre className="bg-black p-4 rounded-lg overflow-auto max-h-[80vh]">
                {JSON.stringify(response, null, 2)}
            </pre>
        </div>
    );
}