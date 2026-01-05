'use client';

import { useFavorites } from '@/context/enhanced-favorites-context';
import { cn } from '@/lib/utils';
import { IMovie } from '@/types/api-response';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RecommendationBadgeProps {
  movie: IMovie;
  className?: string;
}

export function RecommendationBadge({ movie, className }: RecommendationBadgeProps) {
  const { favorites } = useFavorites();
  const [isRecommended, setIsRecommended] = useState(false);

  useEffect(() => {
    // Simple recommendation logic based on favorites
    if (favorites.length > 0) {
      const isInFavorites = favorites.some(fav => fav.id === movie.id);
      const hasSimilarGenres = favorites.some(fav => 
        fav.genre_ids?.some(genreId => movie.genre_ids?.includes(genreId))
      );
      setIsRecommended(!isInFavorites && hasSimilarGenres);
    }
  }, [movie, favorites]);

  if (!isRecommended) {
    return null;
  }

  return (
    <div className={cn(
      "absolute bottom-2 left-2 right-2 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-lg p-2 text-white text-xs z-10",
      className
    )}>
      <div className="flex items-center gap-1 mb-1">
        <Sparkles className="size-3" />
        <span className="font-semibold">Recommended</span>
      </div>
      <div className="opacity-90">
        Based on your favorites
      </div>
    </div>
  );
}

// Enhanced Movie Card with Recommendation Badge
export function RecommendationMovieCard({ movie, className, showBadge = true }: {
  movie: IMovie;
  className?: string;
  showBadge?: boolean;
}) {
  return (
    <div className="relative group">
      {showBadge && <RecommendationBadge movie={movie} />}
      {/* Your existing MovieCard content would go here */}
    </div>
  );
}