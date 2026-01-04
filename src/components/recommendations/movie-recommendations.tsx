'use client';

import MovieCard from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/context/enhanced-favorites-context';
import { RecommendationData, RecommendationService } from '@/utils/recommendation-service';
import { motion } from 'framer-motion';
import { Film, Heart, Palette, RefreshCw, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MovieRecommendationsProps {
  currentMovieId?: number;
  title?: string;
  showCategories?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function MovieRecommendations({ 
  currentMovieId, 
  title = "Recommended for You",
  showCategories = true 
}: MovieRecommendationsProps) {
  const { favorites } = useFavorites();
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await RecommendationService.generateRecommendations(
        favorites,
        currentMovieId
      );
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecommendations();
  }, [favorites.length, currentMovieId]);

  if (loading) {
    return (
      <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="size-8 text-purple-400/70" />
          </motion.div>
          <span className="text-gray-400 text-sm">Loading recommendations...</span>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.categories.length === 0) {
    return (
      <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardContent className="text-center p-8 md:p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          <div className="flex flex-col items-center max-w-md mx-auto relative">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-2 ring-white/10">
              <Heart className="size-10 text-gray-500" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Start Building Your Taste Profile
            </h3>
            <p className="text-gray-400 text-center">
              Add movies to your favorites to get personalized recommendations!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header with integrated Refresh Button */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="size-6 text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
            <p className="text-gray-500 text-sm mt-0.5">Personalized picks based on your taste</p>
          </div>
        </div>
        
        {/* Refresh Button - Right aligned with micro-interaction */}
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="self-start sm:self-auto"
        >
          <Button
            onClick={refreshRecommendations}
            disabled={refreshing}
            className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-5 py-2.5 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <RefreshCw className={`size-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>
      </motion.div>

      {/* Recommendation Categories - More spacing between cards */}
      {showCategories && recommendations.categories.map((category, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="bg-black/30 border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500">
            <CardHeader className="border-b border-white/5 p-6">
              <CardTitle className="text-white flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/10">
                  <TrendingUp className="size-5 text-purple-400" />
                </div>
                <div>
                  <span className="block text-lg font-bold">{category.name}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    {category.movies.length} movies curated for you
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {category.movies.map((movie, movieIndex) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: movieIndex * 0.05 }}
                  >
                    <MovieCard movie={movie} index={movieIndex} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Personal Stats - Premium Glassmorphism Footer */}
      {favorites.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center pt-6"
        >
          <div className="inline-flex items-center gap-3 md:gap-4 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
            {/* Favorites Pill */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 cursor-default"
            >
              <Heart className="size-4 text-purple-400 fill-purple-400" />
              <span className="text-lg font-bold text-purple-400">{favorites.length}</span>
              <span className="text-xs text-purple-300/70 hidden sm:inline">Favorites</span>
            </motion.div>
            
            {/* Recommendations Pill */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-500/30 cursor-default"
            >
              <Film className="size-4 text-pink-400" />
              <span className="text-lg font-bold text-pink-400">{recommendations.personalizedMovies.length}</span>
              <span className="text-xs text-pink-300/70 hidden sm:inline">Picks</span>
            </motion.div>
            
            {/* Avg Rating Pill */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 cursor-default"
            >
              <Star className="size-4 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">
                {favorites.length > 0 
                  ? (favorites.reduce((acc, m) => acc + (m.vote_average || 0), 0) / favorites.length).toFixed(1)
                  : 'N/A'
                }
              </span>
              <span className="text-xs text-yellow-300/70 hidden sm:inline">Avg</span>
            </motion.div>
            
            {/* Genres Pill */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 cursor-default"
            >
              <Palette className="size-4 text-green-400" />
              <span className="text-lg font-bold text-green-400">
                {RecommendationService.analyzeUserPreferences(favorites).favoriteGenres.length}
              </span>
              <span className="text-xs text-green-300/70 hidden sm:inline">Genres</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}