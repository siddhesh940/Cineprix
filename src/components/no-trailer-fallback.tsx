'use client';

import { AlertCircle, Film, Play } from 'lucide-react';

interface NoTrailerFallbackProps {
    movieTitle: string;
    movieYear?: string;
    imdbId?: string;
}

// 🎬 Fallback component when no YouTube trailer is available - Step 5
export const NoTrailerFallback = ({ movieTitle, movieYear, imdbId }: NoTrailerFallbackProps) => {
    const searchTrailerOnGoogle = () => {
        const query = `${movieTitle} ${movieYear || ''} trailer site:youtube.com`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    const openIMDb = () => {
        if (imdbId) {
            window.open(`https://www.imdb.com/title/${imdbId}`, '_blank');
        }
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center">
            <div className="mb-4">
                <Film className="size-16 text-gray-500 mx-auto mb-3" />
                <h3 className="text-white text-lg font-semibold mb-2">No Trailer Available</h3>
                <p className="text-gray-400 text-sm">
                    We couldn't find any official trailers for this movie.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={searchTrailerOnGoogle}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all"
                >
                    <Play className="size-4" />
                    Search for Trailer
                </button>

                {imdbId && (
                    <button
                        onClick={openIMDb}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-full transition-all"
                    >
                        <AlertCircle className="size-4" />
                        View on IMDb
                    </button>
                )}
            </div>

            <p className="text-gray-500 text-xs mt-4">
                Try searching on YouTube or check back later for updates
            </p>
        </div>
    );
};