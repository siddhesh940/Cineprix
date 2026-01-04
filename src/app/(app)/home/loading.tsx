import { NetflixRowSkeleton } from '@/components/netflix/netflix-loader';

export default function Loading() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Skeleton */}
      <div className="h-[85vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
      
      {/* Rows Skeleton */}
      <div className="py-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <NetflixRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}