import { Skeleton } from '@/components/ui/skeleton';

// 🎬 Enhanced Loading state for movie details page - Step 4
export default function MovieDetailsLoading() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section Loading */}
            <div className="relative">
                <Skeleton className="w-full h-[70vh] rounded-none bg-gray-800" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 grid lg:grid-cols-[300px_1fr] gap-8 p-6 lg:p-8">
                    {/* Poster skeleton */}
                    <div className="mx-auto lg:mx-0">
                        <Skeleton className="w-full max-w-[300px] h-[450px] rounded-xl bg-gray-700" />
                    </div>

                    {/* Info skeleton */}
                    <div className="space-y-6 text-white">
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-3/4 bg-gray-700" />
                            <Skeleton className="h-6 w-1/2 bg-gray-700" />
                            <Skeleton className="h-6 w-40 bg-gray-700" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-20 bg-gray-700" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-16 bg-gray-700 rounded-full" />
                                <Skeleton className="h-8 w-20 bg-gray-700 rounded-full" />
                                <Skeleton className="h-8 w-18 bg-gray-700 rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-700" />
                                <Skeleton className="h-4 w-4/5 bg-gray-700" />
                                <Skeleton className="h-4 w-3/5 bg-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-32 bg-gray-700" />
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 bg-gray-700 rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section Loading */}
            <div className="container mx-auto px-4 py-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40 bg-gray-700" />
                        <Skeleton className="h-4 w-60 bg-gray-700" />
                    </div>
                    
                    <div className="flex space-x-6 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0">
                                <Skeleton className="h-48 md:h-64 w-36 rounded-xl bg-gray-700" />
                                <Skeleton className="h-4 w-32 mt-2 bg-gray-700" />
                                <Skeleton className="h-3 w-24 mt-1 bg-gray-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
