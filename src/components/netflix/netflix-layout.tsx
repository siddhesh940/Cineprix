'use client';

import { IMovie } from '@/types/api-response';
import { HeroBanner } from './hero-banner';
import { NetflixRow } from './netflix-row';
import { motion } from 'framer-motion';

interface NetflixLayoutProps {
  heroMovie?: IMovie;
  categories: {
    title: string;
    description?: string;
    movies: IMovie[];
    priority?: boolean;
  }[];
  children?: React.ReactNode;
}

export function NetflixLayout({ heroMovie, categories, children }: NetflixLayoutProps) {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Banner */}
      {heroMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroBanner movie={heroMovie} />
        </motion.div>
      )}

      {/* Additional content (like recommendations) */}
      {children && (
        <div className="py-8">
          {children}
        </div>
      )}

      {/* Movie Categories */}
      <div className="pb-16">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
          >
            <NetflixRow
              title={category.title}
              description={category.description}
              movies={category.movies}
              priority={category.priority}
            />
          </motion.div>
        ))}
      </div>

      {/* Netflix-style bottom spacer */}
      <div className="h-20" />
    </div>
  );
}