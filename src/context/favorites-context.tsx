'use client';

import { useAuth } from '@/context/demo-auth-context';
import { createClientSupabase } from '@/lib/supabase';
import { IMovie } from '@/types/api-response';
import { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
    favorites: IMovie[];
    watchlist: IMovie[];
    loading: boolean;
    error: string | null;
    // Favorites
    addToFavorites: (movie: IMovie) => Promise<void>;
    removeFromFavorites: (movieId: number) => Promise<void>;
    isFavorited: (movieId: number) => boolean;
    // Watchlist
    addToWatchlist: (movie: IMovie) => Promise<void>;
    removeFromWatchlist: (movieId: number) => Promise<void>;
    isInWatchlist: (movieId: number) => boolean;
    // Legacy support
    toggleFavorite: (movie: IMovie) => Promise<void>;
    setFavorites: React.Dispatch<React.SetStateAction<IMovie[]>>;
}

// Database types
interface FavoriteRecord {
    id?: string;
    user_id: string;
    movie_id: number;
    movie_title: string;
    movie_poster: string;
    movie_year: number | null;
    created_at?: string;
}

interface WatchlistRecord {
    id?: string;
    user_id: string;
    movie_id: number;
    movie_title: string;
    movie_poster: string;
    movie_year: number | null;
    created_at?: string;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<IMovie[]>([]);
    const [watchlist, setWatchlist] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const supabase = createClientSupabase();

    // Load user's favorites and watchlist when user changes
    useEffect(() => {
        if (user) {
            loadUserData();
        } else {
            // Clear data when user logs out
            setFavorites([]);
            setWatchlist([]);
        }
    }, [user]);

    const loadUserData = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);

        try {
            // Load favorites
            const { data: favoritesData, error: favError } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', user.id) as { data: FavoriteRecord[] | null; error: any };

            if (favError) throw favError;

            // Load watchlist
            const { data: watchlistData, error: watchError } = await supabase
                .from('watchlist')
                .select('*')
                .eq('user_id', user.id) as { data: WatchlistRecord[] | null; error: any };

            if (watchError) throw watchError;

            // Convert to IMovie format
            const favoritesMovies = (favoritesData || []).map((fav: FavoriteRecord) => ({
                id: fav.movie_id,
                title: fav.movie_title,
                poster_path: fav.movie_poster,
                release_date: fav.movie_year ? `${fav.movie_year}-01-01` : '',
                // Add other required IMovie properties with defaults
                overview: '',
                backdrop_path: '',
                vote_average: 0,
                vote_count: 0,
                popularity: 0,
                adult: false,
                genre_ids: [],
                original_language: '',
                original_title: fav.movie_title,
                video: false
            } as IMovie));

            const watchlistMovies = (watchlistData || []).map((watch: WatchlistRecord) => ({
                id: watch.movie_id,
                title: watch.movie_title,
                poster_path: watch.movie_poster,
                release_date: watch.movie_year ? `${watch.movie_year}-01-01` : '',
                // Add other required IMovie properties with defaults
                overview: '',
                backdrop_path: '',
                vote_average: 0,
                vote_count: 0,
                popularity: 0,
                adult: false,
                genre_ids: [],
                original_language: '',
                original_title: watch.movie_title,
                video: false
            } as IMovie));

            setFavorites(favoritesMovies);
            setWatchlist(watchlistMovies);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Favorites functions
    const addToFavorites = async (movie: IMovie) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    movie_id: movie.id,
                    movie_title: movie.title,
                    movie_poster: movie.poster_path,
                    movie_year: movie.release_date ? new Date(movie.release_date).getFullYear() : null
                });

            if (error) throw error;

            setFavorites(prev => [...prev, movie]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to favorites');
        }
    };

    const removeFromFavorites = async (movieId: number) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('movie_id', movieId);

            if (error) throw error;

            setFavorites(prev => prev.filter(fav => fav.id !== movieId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
        }
    };

    const isFavorited = (movieId: number) => {
        return favorites.some(fav => fav.id === movieId);
    };

    // Legacy support for existing components
    const toggleFavorite = async (movie: IMovie) => {
        if (isFavorited(movie.id)) {
            await removeFromFavorites(movie.id);
        } else {
            await addToFavorites(movie);
        }
    };

    // Watchlist functions
    const addToWatchlist = async (movie: IMovie) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('watchlist')
                .insert({
                    user_id: user.id,
                    movie_id: movie.id,
                    movie_title: movie.title,
                    movie_poster: movie.poster_path,
                    movie_year: movie.release_date ? new Date(movie.release_date).getFullYear() : null
                });

            if (error) throw error;

            setWatchlist(prev => [...prev, movie]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to watchlist');
        }
    };

    const removeFromWatchlist = async (movieId: number) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('watchlist')
                .delete()
                .eq('user_id', user.id)
                .eq('movie_id', movieId);

            if (error) throw error;

            setWatchlist(prev => prev.filter(watch => watch.id !== movieId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove from watchlist');
        }
    };

    const isInWatchlist = (movieId: number) => {
        return watchlist.some(watch => watch.id === movieId);
    };

    const value = {
        favorites,
        watchlist,
        loading,
        error,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        // Legacy support
        toggleFavorite,
        setFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Custom hook
export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
