'use client';
import { useFavorites } from '@/context/enhanced-favorites-context';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { IMovie, IMovieInfo } from '@/types/api-response';
import { motion } from 'framer-motion';
import ISO6391 from 'iso-639-1';
import { Award, Calendar, Clock, DollarSign, Film, Globe, Heart, Star, Users } from 'lucide-react';
import RatingCompComponent from './client/rating';
import { TrailerPreview, YouTubeTrailer } from './youtube-trailer';

type Props = {
    info: IMovieInfo & { trailers?: any[] };
};

// Premium Movie Info Component
const MovieInfo = ({ info }: Props) => {
    const { isFavorited, toggleFavorite } = useFavorites();
    const favorited = isFavorited(info.id);

    // Format currency values
    const formatCurrency = (amount: number) => {
        if (amount === 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format runtime
    const formatRuntime = (minutes: number) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Enhanced movie details
    const movieDetails = [
        { 
            icon: <Calendar className="size-5" />, 
            label: 'Release Date', 
            value: info?.release_date ? new Date(info.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA',
            color: 'text-blue-400'
        },
        { 
            icon: <Clock className="size-5" />, 
            label: 'Runtime', 
            value: formatRuntime(info?.runtime),
            color: 'text-green-400'
        },
        { 
            icon: <Star className="size-5" />, 
            label: 'Rating', 
            value: `${info?.vote_average?.toFixed(1)}/10`,
            color: 'text-yellow-400'
        },
        { 
            icon: <Users className="size-5" />, 
            label: 'Votes', 
            value: info?.vote_count?.toLocaleString() || 'N/A',
            color: 'text-purple-400'
        },
        { 
            icon: <Globe className="size-5" />, 
            label: 'Language', 
            value: ISO6391.getName(info?.original_language) || info?.original_language,
            color: 'text-cyan-400'
        },
    ];

    const additionalDetails = [
        { label: 'Budget', value: formatCurrency(info?.budget || 0), icon: <DollarSign className="size-4" /> },
        { label: 'Revenue', value: formatCurrency(info?.revenue || 0), icon: <DollarSign className="size-4" /> },
        { label: 'Status', value: info?.status || 'N/A', icon: <Film className="size-4" /> },
        { label: 'Original Title', value: info?.original_title || 'N/A', icon: <Award className="size-4" /> },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Backdrop with enhanced overlays */}
            <div className="absolute inset-0">
                <img 
                    className="w-full h-full object-cover" 
                    src={getImageUrl(info?.backdrop_path, 'original')} 
                    alt={`${info?.title} backdrop`} 
                />
                {/* Multi-layer gradient overlays for cinematic depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 p-6 lg:p-10">
                {/* Movie Poster */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto lg:mx-0"
                >
                    <div className="relative group">
                        <img 
                            className="w-full max-w-[320px] h-auto rounded-2xl shadow-2xl shadow-black/50 border border-white/10" 
                            src={getImageUrl(info?.poster_path, 'w500')} 
                            alt={`${info?.title} poster`} 
                        />
                        
                        {/* Poster glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        
                        {/* Favorite Button on poster */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(info as unknown as IMovie)}
                            className={cn(
                                "absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300",
                                favorited 
                                    ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
                                    : "bg-black/50 text-white hover:bg-red-500/80 border border-white/20"
                            )}
                        >
                            <Heart className={cn("size-6", favorited && "fill-current")} />
                        </motion.button>

                        {/* Trailer Preview Overlay */}
                        {info?.trailers && info.trailers.length > 0 && (
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <TrailerPreview 
                                    trailers={info.trailers} 
                                    movieTitle={info?.title || ''} 
                                    onPlayClick={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Movie Information */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-white space-y-6"
                >
                    {/* Title and Tagline */}
                    <div className="space-y-3">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-shadow-lg"
                        >
                            {info?.title}
                        </motion.h1>
                        {info?.tagline && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-gray-300 italic font-light"
                            >
                                "{info.tagline}"
                            </motion.p>
                        )}
                        
                        {/* Rating */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full backdrop-blur-sm border border-yellow-500/30">
                                <Star className="size-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-lg font-bold text-yellow-400">
                                    {info?.vote_average?.toFixed(1)}
                                </span>
                            </div>
                            <RatingCompComponent 
                                rating={info?.vote_average} 
                                starDimension={20} 
                                className="text-yellow-400"
                            />
                            <span className="text-gray-400 text-sm">
                                ({info?.vote_count?.toLocaleString()} reviews)
                            </span>
                        </motion.div>
                    </div>

                    {/* Genres */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-2"
                    >
                        {info?.genres?.map((genre, index) => (
                            <motion.span 
                                key={genre.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-sm font-medium text-red-300 border border-red-500/30 transition-colors cursor-default"
                            >
                                {genre.name}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Overview */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="space-y-2"
                    >
                        <h3 className="text-lg font-semibold text-white/90">Overview</h3>
                        <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-4xl">
                            {info?.overview || 'No overview available.'}
                        </p>
                    </motion.div>

                    {/* Main Movie Details */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
                    >
                        {movieDetails.map((detail, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className={cn("mb-2", detail.color)}>{detail.icon}</div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider">{detail.label}</p>
                                <p className="font-semibold text-white">{detail.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Additional Details */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                    >
                        {additionalDetails.map((detail, index) => (
                            <div 
                                key={index} 
                                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                            >
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    {detail.icon}
                                    <span className="text-xs uppercase tracking-wider">{detail.label}</span>
                                </div>
                                <p className="font-semibold text-white text-sm line-clamp-1">{detail.value}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        {/* YouTube Trailer Component */}
                        {info?.trailers && (
                            <YouTubeTrailer 
                                trailers={info.trailers} 
                                movieTitle={info?.title || ''} 
                                posterUrl={getImageUrl(info?.poster_path, 'w500')}
                                movieYear={info?.release_date ? new Date(info.release_date).getFullYear().toString() : undefined}
                                imdbId={info?.imdb_id}
                            />
                        )}
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleFavorite(info as unknown as IMovie)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300",
                                favorited
                                    ? "bg-red-500/20 text-red-400 border-2 border-red-500/50 shadow-lg shadow-red-500/20"
                                    : "bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/30"
                            )}
                        >
                            <Heart className={cn("size-5", favorited && "fill-red-400")} />
                            <span>
                                {favorited ? 'In Favorites' : 'Add to Favorites'}
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default MovieInfo;
