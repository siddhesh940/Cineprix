'use client';

import MovieCard from '@/components/movie-card';
import SearchBar from '@/components/search-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { IMovie } from '@/types/api-response';
import { getTrendingMovies } from '@/utils/movies';
import axios from 'axios';
import { Loader2Icon, Search, Film, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Netflix-style search results with enhanced UI
const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<IMovie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Load trending movies for initial state
    useEffect(() => {
        const loadTrending = async () => {
            try {
                const trending = await getTrendingMovies();
                setTrendingMovies(trending.results.slice(0, 12));
            } catch (error) {
                console.error('Error loading trending movies:', error);
            }
        };
        loadTrending();
    }, []);

    // Debounced search effect
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        const searchMovies = async () => {
            try {
                setLoading(true);
                setHasSearched(true);
                const { data } = await axios.get('/search/api', { 
                    signal, 
                    params: { query: query.trim() } 
                });
                setResults(data.results || []);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Search error:', error);
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        };

        searchMovies();

        return () => controller.abort();
    }, [query]);

    // Loading skeleton component
    const SearchSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-44 md:h-52 2xl:h-56 aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Search Section */}
            <div className="relative bg-gradient-to-b from-black/80 to-black pb-8">
                <div className="container mx-auto px-4 pt-8">
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                            Find Your Next Movie
                        </h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Search through thousands of movies and discover your next favorite
                        </p>
                        <SearchBar 
                            onChange={setQuery} 
                            placeholder="Search for movies, actors, directors..."
                            showTrending={!hasSearched}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search Results */}
                {loading && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Loader2Icon className="animate-spin size-5 text-red-500" />
                            <h2 className="text-2xl font-bold">Searching...</h2>
                        </div>
                        <SearchSkeleton />
                    </div>
                )}

                {hasSearched && !loading && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Search className="size-6 text-red-500" />
                            <h2 className="text-2xl font-bold">
                                {results.length === 0 
                                    ? `No results found for "${query}"` 
                                    : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                                }
                            </h2>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {results.map((movie) => (
                                    <MovieCard 
                                        key={movie.id} 
                                        movie={movie} 
                                        className="hover:scale-105 transition-all duration-300" 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 space-y-4">
                                <Film className="size-16 text-gray-500 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-400">
                                    No movies found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or browse trending movies below
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Trending Movies - Show when no search or no results */}
                {(!hasSearched || (hasSearched && results.length === 0)) && !loading && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="size-6 text-red-500" />
                            <h2 className="text-2xl font-bold">
                                {hasSearched ? 'Try These Trending Movies' : 'Trending Now'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                            {trendingMovies.map((movie) => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={movie} 
                                    className="hover:scale-105 transition-all duration-300" 
                                />
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Link 
                                href="/home" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors"
                            >
                                <Film className="size-5" />
                                Explore All Movies
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
                    <CardContent className="grid gap-1 md:grid-cols-2">
                        {!loading &&
                            results.map(movie => (
                                <Link
                                    prefetch={false}
                                    href={`/movies/${movie.id}`}
                                    key={movie.id}
                                    className="py-1.5 px-2 rounded-md gap-3 flex hover:bg-muted cursor-pointer group transition-all"
                                >
                                    <img
                                        className="border rounded-md size-10 overflow-hidden"
                                        src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                                    />

                                    <div className="flex-1">
                                        <h3 className={'line-clamp-1 text-ellipsis'}>{movie.title}</h3>

                                        <p className="text-xs text-muted-foreground">
                                            {movie.original_language} -{new Date(movie.release_date).getFullYear()}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                        {loading && (
                            <p className="text-center col-span-2 items-center place-items-center text-muted-foreground py-10">
                                <Loader2Icon className="text-primary size-8 animate-spin" />
                            </p>
                        )}

                        {!loading && results.length === 0 && (
                            <p className="text-center col-span-2 text-muted-foreground py-10">No results found for &quot;{query}&quot;</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchResults;
