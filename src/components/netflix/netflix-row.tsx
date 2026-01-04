'use client';

import { IMovie } from '@/types/api-response';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { MovieCard } from './netflix-movie-card';
import { Button } from '@/components/ui/button';

interface NetflixRowProps {
  title: string;
  movies: IMovie[];
  description?: string;
  priority?: boolean;
}

export function NetflixRow({ title, movies, description, priority }: NetflixRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cardWidth = 240; // Width of each movie card
  const visibleCards = 6; // Number of cards to scroll at once
  const scrollAmount = cardWidth * visibleCards;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let newPosition;
    if (direction === 'left') {
      newPosition = Math.max(scrollPosition - scrollAmount, 0);
    } else {
      newPosition = Math.min(scrollPosition + scrollAmount, maxScroll);
    }

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
    setShowLeftArrow(newPosition > 0);
    setShowRightArrow(newPosition < maxScroll - 10); // 10px tolerance
  };

  const handleScrollEvent = () => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setScrollPosition(currentScroll);
    setShowLeftArrow(currentScroll > 10);
    setShowRightArrow(currentScroll < maxScroll - 10);
  };

  if (!movies?.length) return null;

  return (
    <div className="relative group mb-8">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 px-4 lg:px-12">
        <div>
          <h2 className="text-white text-xl lg:text-2xl font-bold flex items-center gap-2">
            {title}
            {priority && (
              <span className="text-red-500 text-lg animate-pulse">🔥</span>
            )}
          </h2>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Movies Container */}
      <div className="relative px-4 lg:px-12">
        {/* Left Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden group-hover:block"
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 backdrop-blur-sm"
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden group-hover:block"
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 backdrop-blur-sm"
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScrollEvent}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="flex-shrink-0"
            >
              <MovieCard 
                movie={movie} 
                index={index}
                priority={priority && index < 6} // First 6 cards are priority
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}