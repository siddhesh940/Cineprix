import tmdbClient from '@/lib/tmdb';
import { IApiResponse, ICast, IMovie, IMovieInfo } from '@/types/api-response';
import { GenericAbortSignal } from 'axios';

interface DiscoverMoviesProps {
    page?: number;
    sort_by?: string;
    primary_release_year?: string;
    with_genres?: string;
    with_cast?: string;
    with_people?: string;
    with_original_language?: string;
}

// 🔍 Enhanced error handling for API calls
const handleApiError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error.response?.data || error.message);
    return [];
};

export const discoverMovies = async (props: DiscoverMoviesProps) => {
    try {
        const response = await tmdbClient.get<IApiResponse<IMovie[]>>('/discover/movie', {
            params: {
                page: props.page || 1,
                include_adult: false,
                include_video: false,
                ...(props.sort_by && { sort_by: props.sort_by }),
                ...(props.with_original_language && { with_original_language: props.with_original_language }),
                ...(props.primary_release_year && { primary_release_year: props.primary_release_year }),
                ...(props.with_genres && { with_genres: props.with_genres }),
                ...(props.with_cast && { with_cast: props.with_cast }),
                ...(props.with_people && { with_people: props.with_people }),
            },
        });

        return response.data.results;
    } catch (error) {
        return handleApiError(error, 'discoverMovies');
    }
};

// 🔥 Get trending movies (Step 2 requirement)
export const getTrendingMovies = async (page: number = 1) => {
    try {
        const response = await tmdbClient.get<IApiResponse<IMovie[]>>('/trending/movie/week', {
            params: { page }
        });
        return {
            results: response.data.results,
            totalPages: response.data.total_pages,
            page: response.data.page
        };
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return { results: [], totalPages: 0, page: 1 };
    }
};

// ⭐ Get popular movies 
export const getPopularMovies = async (page: number = 1) => {
    try {
        const response = await tmdbClient.get<IApiResponse<IMovie[]>>('/movie/popular', {
            params: { page }
        });
        return {
            results: response.data.results,
            totalPages: response.data.total_pages,
            page: response.data.page
        };
    } catch (error) {
        return handleApiError(error, 'getPopularMovies');
    }
};

// 🔍 Search movies (Step 3 requirement)
export const searchMovies = async (query: string, page: number = 1) => {
    try {
        if (!query.trim()) return { results: [], totalPages: 0, page: 1 };
        
        const response = await tmdbClient.get<IApiResponse<IMovie[]>>('/search/movie', {
            params: { 
                query: query.trim(),
                page,
                include_adult: false
            }
        });
        
        return {
            results: response.data.results,
            totalPages: response.data.total_pages,
            page: response.data.page
        };
    } catch (error) {
        return handleApiError(error, 'searchMovies');
    }
};

// 🎬 Get movie details (Step 4 requirement)
export const getMovieDetails = async (movieId: number) => {
    try {
        const response = await tmdbClient.get<IMovieInfo>(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

// 🎭 Get movie cast
export const getMovieCast = async (movieId: number) => {
    try {
        const response = await tmdbClient.get<{ cast: ICast[] }>(`/movie/${movieId}/credits`);
        return response.data.cast;
    } catch (error) {
        return handleApiError(error, 'getMovieCast');
    }
};

// 📺 Get movie videos (trailers) - Step 5 requirement
export const getMovieVideos = async (movieId: number) => {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}/videos`);
        const videos = response.data.results;
        
        // Filter for YouTube trailers
        const trailers = videos.filter((video: any) => 
            video.site === 'YouTube' && 
            video.type === 'Trailer'
        );
        
        return trailers;
    } catch (error) {
        console.error('Error fetching movie videos:', error);
        return [];
    }
};

// 💡 Get similar movies (Step 8 requirement)
export const getSimilarMovies = async (movieId: number, page: number = 1) => {
    try {
        const response = await tmdbClient.get<IApiResponse<IMovie[]>>(`/movie/${movieId}/similar`, {
            params: { page }
        });
        return {
            results: response.data.results,
            totalPages: response.data.total_pages,
            page: response.data.page
        };
    } catch (error) {
        return handleApiError(error, 'getSimilarMovies');
    }
};

// 🏷️ Get movie genres
export const getMovieGenres = async () => {
    try {
        const response = await tmdbClient.get('/genre/movie/list');
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};

// 🧪 Test API connection
export const testApiConnection = async () => {
    try {
        const response = await tmdbClient.get('/configuration');
        console.log('✅ TMDB API Connection Successful!');
        console.log('API Status:', response.status);
        return true;
    } catch (error) {
        console.error('❌ TMDB API Connection Failed:', error);
        return false;
    }
};

// enum MovieType {
//     TV = 'tv',
//     MOVIE = 'movie',
// }

interface SearchMoviesProps {
    query: string;
    page?: number;
    type?: string;
    signal?: AbortSignal | GenericAbortSignal;
}

// 🎬 Enhanced movie info with all Step 4 requirements  
export const getMovieInfo = async (id: string) => {
    try {
        const [movieData, similarMovies, castData, videosData] = await Promise.all([
            tmdbClient.get<IMovieInfo>(`/movie/${id}`, {
                params: { language: 'en-US' },
            }),
            tmdbClient.get<IApiResponse<IMovie[]>>(`/movie/${id}/similar`, {
                params: { language: 'en-US' },
            }),
            tmdbClient.get<{ cast: ICast[] }>(`/movie/${id}/credits`, {
                params: { language: 'en-US' },
            }),
            tmdbClient.get(`/movie/${id}/videos`, {
                params: { language: 'en-US' },
            })
        ]);

        // Filter for YouTube trailers
        const trailers = videosData.data.results?.filter((video: any) => 
            video.site === 'YouTube' && video.type === 'Trailer'
        ) || [];

        return {
            ...movieData.data,
            cast: castData.data.cast.slice(0, 20), // Limit to top 20 cast members
            similarMovies: similarMovies.data.results.slice(0, 12), // Limit similar movies
            trailers: trailers.slice(0, 3), // Get up to 3 trailers
        };
    } catch (error) {
        console.error('Error fetching movie info:', error);
        return null;
    }
};

// 🎯 Step 8: Recommendation System API Functions
export const getRecommendedMovies = async (movieId: number): Promise<IMovie[]> => {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}/recommendations`);
        return response.data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        return [];
    }
};

export const getMoviesByGenre = async (genreId: number, page = 1): Promise<IMovie[]> => {
    try {
        const response = await tmdbClient.get('/discover/movie', {
            params: {
                with_genres: genreId,
                sort_by: 'vote_average.desc',
                'vote_count.gte': 100,
                page
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return [];
    }
};

export const getPersonalizedRecommendations = async (favoriteGenres: number[], excludeMovieIds: number[] = []): Promise<IMovie[]> => {
    try {
        if (favoriteGenres.length === 0) {
            // Fallback to popular movies if no genre preferences
            return await getPopularMovies();
        }

        const recommendations: IMovie[] = [];
        
        // Get movies from each favorite genre
        for (const genreId of favoriteGenres.slice(0, 3)) { // Limit to top 3 genres
            const genreMovies = await getMoviesByGenre(genreId);
            const filteredMovies = genreMovies
                .filter(movie => !excludeMovieIds.includes(movie.id))
                .slice(0, 8);
            recommendations.push(...filteredMovies);
        }

        // Remove duplicates and shuffle
        const uniqueRecommendations = recommendations.filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id)
        );
        
        return shuffleArray(uniqueRecommendations).slice(0, 20);
    } catch (error) {
        console.error('Error generating personalized recommendations:', error);
        return await getPopularMovies();
    }
};

// Utility function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const getGenres = async (): Promise<{ id: number; name: string }[]> => {
    try {
        const response = await tmdbClient.get('/genre/movie/list');
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};

// 🎬 End of Recommendation System Functions
