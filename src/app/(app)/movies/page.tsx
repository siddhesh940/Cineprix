import MovieCard from '@/components/movie-card';
import PaginationComponent from '@/components/pagination';

import { discoverMovies } from '@/utils/movies';
import { Clapperboard, Film } from 'lucide-react';
import { Metadata } from 'next';

const TOTAL_PAGES = 100;

interface MoviesPageProps {
    searchParams: Promise<{ page: string }>;
}

export const metadata: Metadata = {
    title: 'Explore Movies - CinePrix',
};

const page = async ({ searchParams }: MoviesPageProps) => {
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page) || 1;
    const movies = await discoverMovies({ page: currentPage });

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 rounded-full mb-4">
                    <Clapperboard className="size-5 text-red-400" />
                    <span className="text-red-400 font-medium text-sm">Discover Cinema</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    Explore <span className="text-gradient">Movies</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Browse through our extensive collection of {TOTAL_PAGES * 20}+ movies
                </p>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                {movies.map((movie, index) => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie}
                        index={index}
                    />
                ))}
            </div>

            {/* Empty State */}
            {movies.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Film className="size-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                    <p className="text-gray-500">Try refreshing the page or check back later.</p>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-16 mb-8">
                <PaginationComponent path="/movies" current={currentPage} total={TOTAL_PAGES} />
            </div>

            {/* Page Info */}
            <div className="text-center text-gray-500 text-sm">
                Page {currentPage} of {TOTAL_PAGES} • Showing {movies.length} movies
            </div>
        </div>
    );
};

export default page;
