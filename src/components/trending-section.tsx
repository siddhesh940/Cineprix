
import { getTrendingMovies } from '@/utils/movies';
import ISO6391 from 'iso-639-1';
import { Calendar, Play, Star } from 'lucide-react';
import Link from 'next/link';
import CarouselComponent from './client/carousel';
import { Button } from './ui/button';

const TrendingSection = async () => {
    const trendingResult = await getTrendingMovies();
    const movies = trendingResult.results;

    return (
        <CarouselComponent>
            {movies.map(movie => (
                <Link href={`/movies/${movie.id}`} key={movie.id} className="w-full block">
                    {/* Desktop Hero Banner */}
                    <div className="hidden w-full relative bg-black overflow-hidden h-[32rem] 2xl:h-[36rem] md:grid rounded-2xl">
                        {/* Background Image with Parallax Effect */}
                        <div className="absolute inset-0">
                            <img 
                                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]" 
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                                alt={movie.title} 
                            />
                            {/* Multi-layer gradient overlay for cinematic effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center h-full">
                            <div className="flex flex-col gap-5 w-full max-w-2xl p-10 lg:p-14">
                                {/* Featured Badge */}
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                        Featured
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                                        Trending #{movies.indexOf(movie) + 1}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="font-bold text-4xl lg:text-5xl xl:text-6xl text-white leading-tight drop-shadow-lg">
                                    {movie.title}
                                </h2>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-full">
                                        <Star className="size-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-yellow-400">{movie.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 text-gray-400" />
                                        <span className="font-medium">{movie.release_date}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                        {ISO6391.getName(movie.original_language)}
                                    </span>
                                </div>

                                {/* Overview */}
                                <p className="text-gray-300 text-base lg:text-lg leading-relaxed line-clamp-3 max-w-xl">
                                    {movie.overview}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 mt-2">
                                    <Button 
                                        size="lg" 
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 group"
                                    >
                                        <Play className="size-5 mr-2 group-hover:scale-110 transition-transform fill-white" />
                                        Watch Now
                                    </Button>
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 font-semibold px-8 py-6 rounded-xl transition-all duration-300"
                                    >
                                        More Info
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
                    </div>

                    {/* Mobile Hero Banner */}
                    <div className="md:hidden h-[28rem] w-full relative bg-black overflow-hidden rounded-2xl">
                        {/* Background */}
                        <div className="absolute inset-0">
                            <img 
                                className="w-full h-full object-cover" 
                                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} 
                                alt={movie.title} 
                            />
                        </div>

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-purple-950/30" />

                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                            {/* Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full">
                                    FEATURED
                                </span>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                                    <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-yellow-400 text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="font-bold text-2xl text-white leading-tight mb-2 drop-shadow-lg">
                                {movie.title}
                            </h2>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-gray-300 text-sm mb-3">
                                <span>{movie.release_date}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                <span>{ISO6391.getName(movie.original_language)}</span>
                            </div>

                            {/* Overview */}
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                {movie.overview}
                            </p>

                            {/* Button */}
                            <Button 
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-5 rounded-xl shadow-lg shadow-red-500/30"
                            >
                                <Play className="size-4 mr-2 fill-white" />
                                Watch Now
                            </Button>
                        </div>
                    </div>
                </Link>
            ))}
        </CarouselComponent>
    );
};

export default TrendingSection;
