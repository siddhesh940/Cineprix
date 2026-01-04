'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { IMovie } from '@/types/api-response';
import { motion } from 'framer-motion';
import ISO6391 from 'iso-639-1';
import { Info, Play, Plus, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface NetflixMovieCardProps {
  movie: IMovie;
  index: number;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: NetflixMovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  
  const isMovieFavorited = isFavorited(movie.id);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average?.toFixed(1);
  const language = movie.original_language ? ISO6391.getName(movie.original_language) : '';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMovieFavorited) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const getMatchPercentage = () => {
    // Simple algorithm based on rating
    const baseMatch = Math.round((movie.vote_average / 10) * 100);
    return Math.min(Math.max(baseMatch + Math.random() * 20 - 10, 60), 98);
  };

  return (
    <motion.div
      className="relative w-60 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-800">
          {/* Movie Poster */}
          <div className="aspect-[16/9] relative overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
              alt={movie.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading={priority ? 'eager' : 'lazy'}
            />
            
            {/* Netflix-style overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play button overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </motion.div>
          </div>

          {/* Hover Card Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 text-white"
          >
            <h3 className="font-bold text-sm mb-2 line-clamp-1">{movie.title}</h3>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold text-xs">
                  {getMatchPercentage()}% Match
                </span>
                {rating && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {rating} ★
                  </Badge>
                )}
              </div>
              {releaseYear && (
                <span className="text-gray-400 text-xs">{releaseYear}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200 p-2 h-8 w-8 rounded-full"
              >
                <Play className="w-3 h-3 fill-current" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 h-8 w-8 rounded-full border border-gray-600"
                onClick={handleFavoriteToggle}
              >
                <Plus className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 h-8 w-8 rounded-full border border-gray-600"
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 h-8 w-8 rounded-full border border-gray-600 ml-auto"
              >
                <Info className="w-3 h-3" />
              </Button>
            </div>

            {/* Genres or additional info */}
            {language && (
              <p className="text-gray-400 text-xs mt-2">
                {language} • HD
              </p>
            )}
          </motion.div>
        </div>
      </Link>

      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}
    </motion.div>
  );
}