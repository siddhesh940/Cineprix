'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/favorites-context';
import { IMovie } from '@/types/api-response';
import { AnimatePresence, motion } from 'framer-motion';
import ISO6391 from 'iso-639-1';
import { Heart, Info, Play, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeroBannerProps {
  movie: IMovie;
  autoPlay?: boolean;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [muted, setMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  const isFavorited = favorites.some(fav => fav.id === movie.id);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const language = movie.original_language ? ISO6391.getName(movie.original_language) : '';
  
  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Auto-hide details after 5 seconds
  useEffect(() => {
    if (showDetails) {
      const timer = setTimeout(() => setShowDetails(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showDetails]);

  return (
    <div className="relative w-full h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Netflix-style gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl lg:max-w-3xl"
          >
            {/* Netflix Original Badge (if high rating) */}
            {movie.vote_average >= 8.0 && (
              <Badge className="mb-4 bg-red-600 text-white font-bold px-3 py-1 text-sm">
                CINEPRIX ORIGINAL
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* Movie Info */}
            <div className="flex items-center gap-4 mb-4 text-white/80">
              <span className="bg-white/20 px-3 py-1 rounded text-sm font-medium">
                {movie.vote_average?.toFixed(1)} ★
              </span>
              {releaseYear && (
                <span className="text-lg font-medium">{releaseYear}</span>
              )}
              {language && (
                <span className="text-sm bg-white/10 px-2 py-1 rounded">
                  {language}
                </span>
              )}
              <Badge variant="outline" className="text-white border-white/30">
                HD
              </Badge>
            </div>

            {/* Description */}
            <AnimatePresence>
              <motion.p
                initial={{ opacity: 1, height: 'auto' }}
                animate={{ 
                  opacity: showDetails ? 1 : 1, 
                  height: showDetails ? 'auto' : 'auto' 
                }}
                className="text-white/90 text-lg mb-6 leading-relaxed max-w-xl"
              >
                {showDetails 
                  ? movie.overview 
                  : movie.overview?.length > 150 
                    ? `${movie.overview.slice(0, 150)}...` 
                    : movie.overview
                }
              </motion.p>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href={`/movies/${movie.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </Button>
              </Link>
              
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30 font-semibold px-6"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 p-3 rounded-full"
                onClick={handleFavoriteToggle}
              >
                <Heart 
                  className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 p-3 rounded-full"
                onClick={() => setMuted(!muted)}
              >
                {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Age Rating Overlay */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded px-3 py-2">
          <span className="text-white text-sm font-medium">
            PG-{movie.vote_average >= 7 ? '13' : '16'}
          </span>
        </div>
      </div>
    </div>
  );
}