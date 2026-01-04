'use client';

import { motion } from 'framer-motion';

export function NetflixLoader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Netflix-style loading animation */}
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-600 font-bold text-4xl lg:text-5xl"
        >
          CINEPRIX
        </motion.div>
        
        {/* Loading Animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-red-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white text-lg font-medium"
        >
          Loading your cinema experience...
        </motion.p>
      </div>
    </div>
  );
}

export function NetflixCardSkeleton() {
  return (
    <div className="w-60 space-y-2">
      <div className="aspect-[16/9] bg-gray-800 rounded-lg animate-pulse" />
      <div className="space-y-2 p-2">
        <div className="h-4 bg-gray-800 rounded animate-pulse" />
        <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

export function NetflixRowSkeleton() {
  return (
    <div className="mb-8">
      <div className="px-4 lg:px-12 mb-4">
        <div className="h-8 bg-gray-800 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-96 animate-pulse" />
      </div>
      
      <div className="px-4 lg:px-12">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <NetflixCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}