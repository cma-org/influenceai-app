// app/dashboard/instagram-posts/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/app/lib/utils/cookies';
import Image from 'next/image';

interface MediaItem {
    id: string;
}

interface MediaData {
    id: string;
    media_type: string;
    media_url: string;
    timestamp: string;
    owner: {
        id: string;
    };
}

interface PagingCursors {
    before: string;
    after: string;
}

interface MediaResponse {
    data: MediaItem[];
    paging: {
        cursors: PagingCursors;
    };
}

const InstagramPosts = () => {
    const [mediaIds, setMediaIds] = useState<MediaItem[]>([]);
    const [mediaDetails, setMediaDetails] = useState<MediaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cursors, setCursors] = useState<PagingCursors | null>(null);
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);

    // Fetch media IDs with optional cursor
    const fetchMediaIds = async (cursor?: string) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            if (!token) {
                setError('Authentication token not found');
                setLoading(false);
                return;
            }

            let url = '/api/instagram/media';
            if (cursor) {
                url += `?cursor=${cursor}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching media: ${response.statusText}`);
            }

            const data: MediaResponse = await response.json();
            setMediaIds(data.data);
            setCursors(data.paging.cursors);
            setCurrentCursor(cursor || null);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch media IDs');
            setLoading(false);
        }
    };

    // Fetch media details for each ID
    const fetchMediaDetails = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();

            if (!token) {
                setError('Authentication token not found');
                setLoading(false);
                return;
            }

            const details = await Promise.all(
                mediaIds.map(async (item) => {
                    const response = await fetch(`/api/instagram/media/${item.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Error fetching media details: ${response.statusText}`);
                    }

                    return await response.json();
                })
            );

            setMediaDetails(details);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch media details');
            setLoading(false);
        }
    };

    // Initial fetch of media IDs
    useEffect(() => {
        fetchMediaIds();
    }, []);

    // Fetch details whenever media IDs change
    useEffect(() => {
        if (mediaIds.length > 0) {
            fetchMediaDetails();
        }
    }, [mediaIds]);

    // Handle pagination
    const handlePrevPage = () => {
        if (cursors && cursors.before) {
            fetchMediaIds(cursors.before);
        }
    };

    const handleNextPage = () => {
        if (cursors && cursors.after) {
            fetchMediaIds(cursors.after);
        }
    };

    // Format timestamp
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && mediaDetails.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Instagram Posts</h1>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mediaDetails.map((media) => (
                    <div key={media.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {media.media_type === 'IMAGE' ? (
                            <div className="relative h-64 w-full">
                                <Image
                                    src={media.media_url}
                                    alt="Instagram Post"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : media.media_type === 'VIDEO' ? (
                            <video
                                src={media.media_url}
                                controls
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="h-64 w-full flex items-center justify-center bg-gray-200">
                                <p className="text-black">Unsupported media type: {media.media_type}</p>
                            </div>
                        )}
                        <div className="p-4">
                            <p className="text-gray-600 text-sm">{formatDate(media.timestamp)}</p>
                            <p className="text-gray-700 mt-2">Media ID: {media.id.substring(0, 10)}...</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {mediaDetails.length > 0 && (
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevPage}
                        disabled={!cursors || !cursors.before}
                        className={`px-4 py-2 rounded ${!cursors || !cursors.before
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={!cursors || !cursors.after}
                        className={`px-4 py-2 rounded ${!cursors || !cursors.after
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {mediaDetails.length === 0 && !loading && (
                <div className="text-center py-10">
                    <p className="text-black">No Instagram posts found.</p>
                </div>
            )}
        </div>
    );
};

export default InstagramPosts;