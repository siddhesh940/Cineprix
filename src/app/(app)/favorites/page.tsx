'use client'

import MovieCard from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/demo-auth-context'
import { useFavorites } from '@/context/enhanced-favorites-context'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Film, Filter, Heart, Sparkles, Star, Trash2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function FavoritesPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites()
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'added' | 'rating' | 'year' | 'title'>('added')
  const [filterBy, setFilterBy] = useState<'all' | 'high-rated' | 'recent'>('all')

  // Sort favorites based on selection
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.vote_average || 0) - (a.vote_average || 0)
      case 'year':
        return new Date(b.release_date || '').getFullYear() - new Date(a.release_date || '').getFullYear()
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // Filter favorites
  const filteredFavorites = sortedFavorites.filter(movie => {
    switch (filterBy) {
      case 'high-rated':
        return (movie.vote_average || 0) >= 7.0
      case 'recent':
        return new Date(movie.release_date || '').getFullYear() >= new Date().getFullYear() - 5
      default:
        return true
    }
  })

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border-white/10 max-w-md w-full mx-auto overflow-hidden">
            <CardContent className="text-center p-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center"
              >
                <Heart className="size-10 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Sign in to save your favorite movies and access them across all your devices.
              </p>
              <Link href="/auth/login">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all">
                  Sign In to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Empty favorites state
  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border-white/10 overflow-hidden">
            <CardContent className="text-center p-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center"
              >
                <Film className="size-12 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">Your Collection Awaits</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Start building your movie collection by clicking the heart icon on movies you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/home">
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-5 rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all">
                    <Sparkles className="size-4 mr-2" />
                    Discover Movies
                  </Button>
                </Link>
                <Link href="/movies">
                  <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 px-6 py-5 rounded-xl font-semibold">
                    <TrendingUp className="size-4 mr-2" />
                    Browse All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header - More breathing room */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-2"
      >
        <div className="flex items-center gap-5">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-red-500/30 to-pink-500/30 ring-2 ring-red-500/20 shadow-lg shadow-red-500/20"
          >
            <Heart className="size-8 text-red-400 fill-red-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Favorites</h1>
            <p className="text-gray-400 mt-1">
              {favoritesCount} movie{favoritesCount !== 1 ? 's' : ''} in your collection
            </p>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="self-start sm:self-auto"
          >
            <Button
              onClick={clearFavorites}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 rounded-full px-5 py-2.5 transition-all duration-300"
            >
              <Trash2 className="size-4 mr-2" />
              Clear All
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filters Card - Better hierarchy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <Filter className="size-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="added">Recently Added</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Newest Movies</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium">Filter:</span>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="all">All Movies</option>
                  <option value="high-rated">High Rated (7.0+)</option>
                  <option value="recent">Recent (Last 5 Years)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Movies Grid - More gap for breathing room */}
      <AnimatePresence mode="wait">
        {filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl">
              <CardContent className="text-center p-12">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white/5 flex items-center justify-center ring-2 ring-white/10">
                  <Filter className="size-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No movies match your filters</p>
                <p className="text-gray-500 text-sm">Try adjusting your filter or sort options.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6"
          >
            {filteredFavorites.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Footer - Centered Glassmorphism Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center pt-4"
      >
        <div className="inline-flex items-center gap-3 p-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Total Pill */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 cursor-default"
          >
            <Heart className="size-4 text-red-400 fill-red-400" />
            <span className="text-base font-bold text-red-400">{favoritesCount}</span>
            <span className="text-xs text-red-300/70">Total</span>
          </motion.div>
          
          {/* Avg Rating Pill */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 cursor-default"
          >
            <Star className="size-4 text-yellow-400 fill-yellow-400" />
            <span className="text-base font-bold text-yellow-400">
              {favorites.length > 0 
                ? (favorites.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / favorites.length).toFixed(1)
                : 'N/A'
              }
            </span>
            <span className="text-xs text-yellow-300/70">Avg</span>
          </motion.div>
          
          {/* Showing Pill */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 cursor-default"
          >
            <Calendar className="size-4 text-blue-400" />
            <span className="text-base font-bold text-blue-400">{filteredFavorites.length}</span>
            <span className="text-xs text-blue-300/70">Showing</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
