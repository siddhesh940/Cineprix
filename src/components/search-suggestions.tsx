'use client';

import { getImageUrl } from '@/lib/tmdb';
import { IMovie } from '@/types/api-response';
import { Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SearchSuggestionsProps {
    query: string;
    results: IMovie[];
    onSelectMovie: (movie: IMovie) => void;
    loading: boolean;
}

// 🔍 Netflix-style Search Suggestions Dropdown
export const SearchSuggestions = ({ query, results, onSelectMovie, loading }: SearchSuggestionsProps) => {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('moviesprix-recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const addToRecentSearches = (searchQuery: string) => {
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('moviesprix-recent-searches', JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('moviesprix-recent-searches');
    };

    if (!query && recentSearches.length === 0) return null;

    return (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg mt-2 max-h-96 overflow-y-auto shadow-2xl z-50">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Clock className="size-4" />
                            <span>Recent Searches</span>
                        </div>
                        <button 
                            onClick={clearRecentSearches}
                            className="text-gray-500 hover:text-white text-sm transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                                onClick={() => {
                                    // Handle recent search click
                                }}
                            >
                                <Search className="size-4 text-gray-500" />
                                <span className="text-white">{search}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results */}
            {query && (
                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            <p className="text-gray-400 text-sm mb-3">
                                {results.length} movie{results.length !== 1 ? 's' : ''} found
                            </p>
                            {results.slice(0, 8).map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/movies/${movie.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                                    onClick={() => {
                                        addToRecentSearches(query);
                                        onSelectMovie(movie);
                                    }}
                                >
                                    <img
                                        src={getImageUrl(movie.poster_path, 'w154')}
                                        alt={movie.title}
                                        className="w-12 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate group-hover:text-red-400 transition-colors">
                                            {movie.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                            {movie.vote_average > 0 && (
                                                <span className="ml-2">⭐ {movie.vote_average.toFixed(1)}</span>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {results.length > 8 && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    className="block text-center py-3 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    View all {results.length} results
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No movies found for "{query}"</p>
                            <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};