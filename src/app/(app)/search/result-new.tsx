'use client';

import MovieCard from '@/components/movie-card';
import SearchBar from '@/components/search-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { IMovie } from '@/types/api-response';
import { getTrendingMovies } from '@/utils/movies';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2Icon, Popcorn, Search, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Premium Search Results Component
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

    // Premium Loading Skeleton
    const SearchSkeleton = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="space-y-3"
                >
                    <Skeleton className="aspect-[2/3] rounded-xl bg-white/5" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/5" />
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen text-white">
            {/* Hero Search Section */}
            <div className="relative pb-10">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative max-w-5xl mx-auto pt-8 px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                                <span className="text-gradient">Discover</span>
                                <span className="text-white"> Your Next</span>
                            </h1>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Favorite Movie
                            </h2>
                        </motion.div>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Search through thousands of movies and discover something amazing
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <SearchBar 
                            onChange={setQuery} 
                            placeholder="Search movies, actors, directors..."
                            showTrending={!hasSearched}
                        />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 pb-8">
                {/* Loading State */}
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-red-500/20">
                                    <Loader2Icon className="animate-spin size-5 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Searching...</h2>
                                    <p className="text-gray-500 text-sm">Finding the best matches for you</p>
                                </div>
                            </div>
                            <SearchSkeleton />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Results */}
                <AnimatePresence mode="wait">
                    {hasSearched && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-red-500/20">
                                    <Search className="size-5 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {results.length === 0 
                                            ? `No results for "${query}"` 
                                            : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`
                                        }
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {results.length > 0 ? `Showing movies for "${query}"` : 'Try a different search term'}
                                    </p>
                                </div>
                            </div>

                            {results.length > 0 ? (
                                <motion.div 
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.05 }
                                        }
                                    }}
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                                >
                                    {results.map((movie, index) => (
                                        <MovieCard 
                                            key={movie.id} 
                                            movie={movie}
                                            index={index}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                        <Popcorn className="size-12 text-gray-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">
                                        No movies found
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        We couldn't find any movies matching your search. Try different keywords or browse trending movies below.
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Trending Movies Section */}
                <AnimatePresence>
                    {(!hasSearched || (hasSearched && results.length === 0)) && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-8"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-orange-500/20">
                                    <TrendingUp className="size-5 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {hasSearched ? 'Try These Trending Movies' : 'Trending Now'}
                                    </h2>
                                    <p className="text-gray-500 text-sm">Popular movies this week</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {trendingMovies.map((movie, index) => (
                                    <MovieCard 
                                        key={movie.id} 
                                        movie={movie}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* CTA */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center pt-12"
                            >
                                <Link 
                                    href="/movies" 
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                                >
                                    <Sparkles className="size-5" />
                                    Explore All Movies
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchResults;