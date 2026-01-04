'use client';

import { Skeleton } from '@/components/ui/skeleton';

const MovieCardSkeleton = () => {
    return (
        <div className="rounded-lg overflow-hidden border relative h-44 md:h-52 2xl:h-56 aspect-[3/4] md:aspect-[3/4] shadow-md">
            <Skeleton className="absolute inset-0 w-full h-full" />
            <Skeleton className="absolute px-1.5 py-0.5 top-1 left-1 w-12 h-6 rounded" />
        </div>
    );
};

// Grid of movie card skeletons for loading state
export const MovieGridSkeleton = () => {
    return (
        <div className="flex w-max space-x-4 pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
};

export default MovieCardSkeleton;