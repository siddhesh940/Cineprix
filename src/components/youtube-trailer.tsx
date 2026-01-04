'use client';

import { ExternalLink, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useState } from 'react';
import { NoTrailerFallback } from './no-trailer-fallback';

interface Trailer {
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
}

interface YouTubeTrailerProps {
    trailers: Trailer[];
    movieTitle: string;
    posterUrl?: string;
    movieYear?: string;
    imdbId?: string;
}

// 🎬 Enhanced YouTube Trailer Component - Step 5
export const YouTubeTrailer = ({ trailers, movieTitle, movieYear, imdbId }: YouTubeTrailerProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Filter and prioritize trailers
    const youtubeTrailers = trailers.filter(trailer => 
        trailer.site === 'YouTube' && trailer.type === 'Trailer'
    ).sort((a, b) => {
        // Prioritize official trailers
        if (a.official && !b.official) return -1;
        if (!a.official && b.official) return 1;
        return 0;
    });

    // 🔥 Step 5 Enhancement: Show fallback if no trailers available
    if (youtubeTrailers.length === 0) {
        return (
            <NoTrailerFallback 
                movieTitle={movieTitle}
                movieYear={movieYear}
                imdbId={imdbId}
            />
        );
    }

    const currentTrailer = youtubeTrailers[currentTrailerIndex];

    const openTrailerModal = () => {
        setIsModalOpen(true);
        setIsLoading(true); // Reset loading state when opening modal
    };

    const closeTrailerModal = () => {
        setIsModalOpen(false);
    };

    const nextTrailer = () => {
        setIsLoading(true); // Reset loading when changing trailer
        setCurrentTrailerIndex((prev) => 
            prev === youtubeTrailers.length - 1 ? 0 : prev + 1
        );
    };

    const prevTrailer = () => {
        setIsLoading(true); // Reset loading when changing trailer
        setCurrentTrailerIndex((prev) => 
            prev === 0 ? youtubeTrailers.length - 1 : prev - 1
        );
    };

    return (
        <>
            {/* Play Trailer Button */}
            <button
                onClick={openTrailerModal}
                className="flex items-center gap-3 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
                <Play className="size-6 fill-white" />
                <span>Watch Trailer</span>
                {youtubeTrailers.length > 1 && (
                    <span className="text-xs bg-red-800 px-2 py-1 rounded-full">
                        {youtubeTrailers.length} available
                    </span>
                )}
            </button>

            {/* Trailer Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeTrailerModal}
                >
                    <div 
                        className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <h2 className="text-xl font-bold">{movieTitle}</h2>
                                    <p className="text-gray-300 text-sm">
                                        {currentTrailer.name} 
                                        {currentTrailer.official && (
                                            <span className="ml-2 px-2 py-1 bg-green-600 text-xs rounded-full">
                                                Official
                                            </span>
                                        )}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    {/* Trailer Navigation */}
                                    {youtubeTrailers.length > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={prevTrailer}
                                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                title="Previous trailer"
                                            >
                                                ←
                                            </button>
                                            <span className="text-sm">
                                                {currentTrailerIndex + 1} / {youtubeTrailers.length}
                                            </span>
                                            <button
                                                onClick={nextTrailer}
                                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                title="Next trailer"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )}

                                    {/* External Link */}
                                    <a
                                        href={`https://www.youtube.com/watch?v=${currentTrailer.key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title="Open in YouTube"
                                    >
                                        <ExternalLink className="size-5" />
                                    </a>

                                    {/* Close Button */}
                                    <button
                                        onClick={closeTrailerModal}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title="Close"
                                    >
                                        <X className="size-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* YouTube Embed */}
                        <iframe
                            key={currentTrailer.key} // Force re-render when trailer changes
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&iv_load_policy=3`}
                            title={`${movieTitle} - ${currentTrailer.name}`}
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; encrypted-media; fullscreen"
                            onLoad={() => setIsLoading(false)}
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />

                        {/* Loading State - only show when loading */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-black flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                                    <p>Loading trailer...</p>
                                </div>
                            </div>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    {/* Mute Toggle */}
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="flex items-center gap-2 p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                                    </button>
                                </div>

                                {/* Trailer List */}
                                {youtubeTrailers.length > 1 && (
                                    <div className="flex gap-2">
                                        {youtubeTrailers.map((trailer, index) => (
                                            <button
                                                key={trailer.key}
                                                onClick={() => {
                                                    setIsLoading(true);
                                                    setCurrentTrailerIndex(index);
                                                }}
                                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                    index === currentTrailerIndex
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                                                }`}
                                                title={trailer.name}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// 🎬 Trailer Preview Component (for smaller displays)
export const TrailerPreview = ({ trailers, movieTitle, onPlayClick }: {
    trailers: Trailer[];
    movieTitle: string;
    onPlayClick: () => void;
}) => {
    const mainTrailer = trailers.find(t => t.site === 'YouTube' && t.type === 'Trailer');
    
    if (!mainTrailer) return null;

    return (
        <div className="relative group cursor-pointer" onClick={onPlayClick}>
            <img
                src={`https://img.youtube.com/vi/${mainTrailer.key}/maxresdefault.jpg`}
                alt={`${movieTitle} trailer thumbnail`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                    // Fallback to medium quality thumbnail
                    e.currentTarget.src = `https://img.youtube.com/vi/${mainTrailer.key}/mqdefault.jpg`;
                }}
            />
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-lg">
                <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                    <Play className="size-8 fill-white text-white" />
                </div>
            </div>
            
            {/* Trailer count badge */}
            {trailers.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {trailers.length} trailers
                </div>
            )}
        </div>
    );
};