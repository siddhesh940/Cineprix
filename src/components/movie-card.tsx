'use client';

import { useFavorites } from '@/context/enhanced-favorites-context';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { IMovie } from '@/types/api-response';
import { IconStarFilled } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import Link from 'next/link';
import Image from './client/image';

type Props = {
    movie: IMovie;
    className?: string;
    index?: number;
};

const MovieCard = ({ movie, className, index = 0 }: Props) => {
    const { isFavorited, toggleFavorite } = useFavorites();
    const favorited = isFavorited(movie.id);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative group"
        >
            <Link href={`/movies/${movie.id}`} className="block" prefetch={false}>
                <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={cn(
                        'rounded-xl overflow-hidden relative aspect-[2/3] shadow-lg',
                        'bg-gray-900 border border-white/5',
                        'transition-all duration-500',
                        'group-hover:shadow-2xl group-hover:shadow-red-500/20',
                        'group-hover:border-red-500/30',
                        className
                    )}
                >
                    {/* Movie Poster */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={getImageUrl(movie.poster_path, 'w500')}
                            placeholderSrc={getImageUrl(movie.poster_path, 'w154')}
                            alt={movie.title}
                        />
                        {/* Shimmer loading effect */}
                        <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-0" />
                    </div>

                    {/* Gradient Overlay - Always visible but stronger on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Rating Badge - Top Left */}
                    <div className="absolute top-2 left-2 z-10">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10"
                        >
                            <IconStarFilled className="size-3.5 text-yellow-400" /> 
                            <span className="text-white text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
                        </motion.div>
                    </div>

                    {/* Play Button - Center on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="p-4 rounded-full bg-red-500/90 backdrop-blur-sm shadow-lg shadow-red-500/50 group-hover:scale-100 scale-75 transition-transform duration-300"
                        >
                            <Play className="size-6 text-white fill-white" />
                        </motion.div>
                    </div>

                    {/* Movie Info - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1 drop-shadow-lg">
                            {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                            <span className="font-medium">
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                            </span>
                            {movie.vote_count > 0 && (
                                <>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <span>{movie.vote_count.toLocaleString()} votes</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-red-500/10 via-transparent to-transparent" />
                    </div>
                </motion.div>
            </Link>
            
            {/* Favorite Button - Top Right */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(movie);
                }}
                className={cn(
                    "absolute top-2 right-2 p-2 rounded-full z-20",
                    "backdrop-blur-md transition-all duration-300",
                    "opacity-0 group-hover:opacity-100",
                    favorited 
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
                        : "bg-black/50 text-white hover:bg-red-500/80 border border-white/20"
                )}
            >
                <Heart 
                    className={cn(
                        "size-4 transition-transform duration-300",
                        favorited && "fill-current scale-110"
                    )} 
                />
            </motion.button>
        </motion.div>
    );
};

export default MovieCard;
