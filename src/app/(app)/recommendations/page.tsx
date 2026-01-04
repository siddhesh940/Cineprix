'use client';

import { MovieRecommendations } from '@/components/recommendations/movie-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/demo-auth-context';
import { useFavorites } from '@/context/enhanced-favorites-context';
import { motion } from 'framer-motion';
import { Brain, Film, Heart, Sparkles, Star, Wand2, Zap } from 'lucide-react';
import Link from 'next/link';

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

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { favorites, favoritesCount } = useFavorites();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[60vh] flex items-center justify-center p-4"
      >
        <Card className="bg-gradient-to-br from-gray-900/80 via-purple-950/30 to-gray-900/80 border-white/10 backdrop-blur-sm max-w-md mx-auto overflow-hidden">
          <CardContent className="text-center p-8 relative">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center ring-2 ring-purple-500/20">
                <Sparkles className="size-10 text-purple-400" />
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-3 relative"
            >
              Sign In for Recommendations
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-6 relative"
            >
              Discover movies tailored to your taste. Sign in to get personalized recommendations.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-purple-500/20">
                  <Sparkles className="size-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (favoritesCount === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-white/10">
            <Sparkles className="size-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Recommendations</h1>
            <p className="text-gray-400">Discover movies you'll love</p>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900/60 via-purple-950/20 to-gray-900/60 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardContent className="text-center p-8 md:p-12 relative">
              {/* Background decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center ring-2 ring-white/10">
                  <Heart className="size-12 text-gray-500" />
                </div>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-3 relative">
                Help Us Learn Your Taste
              </h3>
              <p className="text-gray-400 text-lg mb-2 max-w-xl mx-auto relative">
                Add movies to your favorites to unlock personalized recommendations!
              </p>
              <p className="text-gray-500 text-sm mb-10 max-w-lg mx-auto relative">
                The more movies you favorite, the better our suggestions become.
              </p>
            
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 relative">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="text-center p-6 bg-gradient-to-br from-purple-900/40 to-purple-900/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Brain className="size-7 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Smart Algorithms</h4>
                  <p className="text-gray-400 text-sm">
                    Our AI analyzes your preferences to suggest movies you'll actually want to watch.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="text-center p-6 bg-gradient-to-br from-pink-900/40 to-pink-900/10 rounded-2xl border border-pink-500/20 backdrop-blur-sm"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Wand2 className="size-7 text-pink-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Personalized Lists</h4>
                  <p className="text-gray-400 text-sm">
                    Get curated collections based on your favorite genres, ratings, and viewing habits.
                  </p>
                </motion.div>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
                <Link href="/home">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 shadow-lg shadow-purple-500/20">
                      <Heart className="size-4 mr-2" />
                      Start Adding Favorites
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/movies">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-6">
                      <Film className="size-4 mr-2" />
                      Browse All Movies
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header with User Stats */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-white/10"
          >
            <Sparkles className="size-7 text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Recommendations</h1>
            <p className="text-gray-400">
              Based on your <span className="text-purple-400 font-medium">{favoritesCount}</span> favorite movie{favoritesCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {/* Premium Floating Stats Panel */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex-shrink-0"
        >
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
            {/* Favorites */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20"
            >
              <Heart className="size-5 text-purple-400 fill-purple-400" />
              <div className="text-left">
                <div className="text-lg font-bold text-purple-400 leading-none">{favoritesCount}</div>
                <div className="text-[10px] text-purple-300/60 mt-0.5">Favorites</div>
              </div>
            </motion.div>
            
            {/* Avg Rating */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/20"
            >
              <Star className="size-5 text-yellow-400 fill-yellow-400" />
              <div className="text-left">
                <div className="text-lg font-bold text-yellow-400 leading-none">
                  {favorites.length > 0 
                    ? (favorites.reduce((acc, m) => acc + (m.vote_average || 0), 0) / favorites.length).toFixed(1)
                    : 'N/A'
                  }
                </div>
                <div className="text-[10px] text-yellow-300/60 mt-0.5">Avg Rating</div>
              </div>
            </motion.div>
            
            {/* Daily Picks */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20"
            >
              <Zap className="size-5 text-blue-400" />
              <div className="text-left">
                <div className="text-lg font-bold text-blue-400 leading-none">New</div>
                <div className="text-[10px] text-blue-300/60 mt-0.5">Daily Picks</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recommendations Component */}
      <motion.div variants={itemVariants}>
        <MovieRecommendations 
          title="Curated Just for You" 
          showCategories={true} 
        />
      </motion.div>
    </motion.div>
  );
}