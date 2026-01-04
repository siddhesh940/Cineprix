'use client';

import MovieCard from '@/components/movie-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IMovie } from '@/types/api-response';
import { getSimilarMovies } from '@/utils/movies';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Film, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SimilarMoviesProps {
  movieId: number;
  movieTitle: string;
  showTitle?: boolean;
}

export function SimilarMovies({ movieId, movieTitle, showTitle = true }: SimilarMoviesProps) {
  const [similarMovies, setSimilarMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadSimilarMovies = async () => {
      try {
        setLoading(true);
        const result = await getSimilarMovies(movieId);
        // Extract results array from the response object
        const movies = Array.isArray(result) ? [] : result.results || [];
        setSimilarMovies(movies);
      } catch (error) {
        console.error('Error loading similar movies:', error);
        setSimilarMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadSimilarMovies();
    }
  }, [movieId]);

  if (loading) {
    return (
      <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Film className="size-8 text-yellow-400/70" />
          </motion.div>
          <span className="text-gray-400 text-sm">Finding similar movies...</span>
        </CardContent>
      </Card>
    );
  }

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
      {showTitle && (
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 ring-1 ring-yellow-500/30">
              <Zap className="size-5 text-yellow-400" />
            </div>
            <div>
              <span className="block">More Like "{movieTitle}"</span>
              <span className="text-sm text-gray-400 font-normal">
                {similarMovies.length} suggestions based on your selection
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? 'p-6' : 'pt-6 p-6'}>
        <motion.div 
          layout
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4`}
        >
          <AnimatePresence mode="popLayout">
            {Array.isArray(similarMovies) && similarMovies.slice(0, showAll ? similarMovies.length : 8).map((movie, index) => (
              <motion.div 
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index > 7 ? (index - 8) * 0.05 : 0 }}
                className="w-full"
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {Array.isArray(similarMovies) && similarMovies.length > 8 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10 hover:text-yellow-300 transition-all"
            >
              <span className="text-sm font-medium">
                {showAll 
                  ? 'Show less' 
                  : `View all ${similarMovies.length} similar movies`
                }
              </span>
              <motion.div
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="size-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}