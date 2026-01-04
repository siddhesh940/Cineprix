import axios from 'axios';

// 🔧 Base configuration for TMDB API
const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_KEY, // ✅ Fixed: Now matches .env.local
    },
    timeout: 10000, // 10 seconds timeout
});

// 🛡️ Error handling interceptor
tmdbClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // API returned an error status
            console.error('TMDB API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Network error
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// 🎬 TMDB Image base URLs
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
    w92: '/w92',
    w154: '/w154', 
    w185: '/w185',
    w342: '/w342',
    w500: '/w500',
    w780: '/w780',
    original: '/original'
};

// 🖼️ Helper function to get full image URL
export const getImageUrl = (path: string, size: keyof typeof POSTER_SIZES = 'w500') => {
    if (!path) return '/placeholder-movie.jpg'; // Fallback image
    return `${TMDB_IMAGE_BASE_URL}${POSTER_SIZES[size]}${path}`;
};

export default tmdbClient;
