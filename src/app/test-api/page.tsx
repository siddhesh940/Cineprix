'use client';

import { IMovie } from '@/types/api-response';
import { getTrendingMovies, testApiConnection } from '@/utils/movies';
import { useEffect, useState } from 'react';

// 🧪 API Test Page - Use this to verify TMDB integration
export default function TestApiPage() {
    const [apiStatus, setApiStatus] = useState<'testing' | 'success' | 'failed'>('testing');
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const runTests = async () => {
            // Test 1: API Connection
            console.log('🧪 Testing TMDB API Connection...');
            const connectionTest = await testApiConnection();
            setApiStatus(connectionTest ? 'success' : 'failed');

            // Test 2: Fetch Sample Data
            if (connectionTest) {
                console.log('📡 Fetching trending movies...');
                const result = await getTrendingMovies();
                setMovies(result.results.slice(0, 5)); // Show only 5 for testing
                console.log('✅ Sample movies:', result.results.slice(0, 3));
            }

            setLoading(false);
        };

        runTests();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg">Testing TMDB API Connection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">🧪 TMDB API Integration Test</h1>
            
            {/* API Status */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">📡 API Connection Status</h2>
                <div className={`p-4 rounded-lg ${
                    apiStatus === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : apiStatus === 'failed'
                        ? 'bg-red-100 border border-red-400 text-red-700'
                        : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                }`}>
                    {apiStatus === 'success' && '✅ API Connection Successful!'}
                    {apiStatus === 'failed' && '❌ API Connection Failed!'}
                    {apiStatus === 'testing' && '⏳ Testing...'}
                </div>
            </div>

            {/* Environment Check */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">🔧 Environment Variables</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p>API Key Status: {process.env.NEXT_PUBLIC_TMDB_KEY ? '✅ Present' : '❌ Missing'}</p>
                    <p>API Key Length: {process.env.NEXT_PUBLIC_TMDB_KEY?.length || 0} characters</p>
                </div>
            </div>

            {/* Sample Data */}
            {apiStatus === 'success' && movies.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">🎬 Sample Movies Data</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {movies.map((movie) => (
                            <div key={movie.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">Release: {movie.release_date}</p>
                                <p className="text-sm text-gray-600 mb-2">Rating: ⭐ {movie.vote_average.toFixed(1)}</p>
                                <p className="text-sm text-gray-500 line-clamp-3">{movie.overview}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">🚀 Next Steps</h2>
                <ul className="space-y-2 text-blue-700">
                    <li>✅ Step 1: TMDB API Integration Complete!</li>
                    <li>⏭️ Ready for Step 2: Home Page + Trending Movies</li>
                    <li>📝 You can delete this test page once everything works</li>
                </ul>
            </div>
        </div>
    );
}