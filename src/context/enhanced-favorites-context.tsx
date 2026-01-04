'use client';

import { useAuth } from '@/context/demo-auth-context';
import { IMovie } from '@/types/api-response';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: IMovie[];
  addToFavorites: (movie: IMovie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorited: (movieId: number) => boolean;
  toggleFavorite: (movie: IMovie) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<IMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuth();

  // Load favorites when user changes and auth is loaded
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Loading favorites for user:', user.id);
        // Load favorites for the logged-in user
        const userFavorites = localStorage.getItem(`moviesprix-favorites-${user.id}`);
        console.log('Found favorites in localStorage:', userFavorites);
        if (userFavorites) {
          try {
            const parsedFavorites = JSON.parse(userFavorites);
            console.log('Parsed favorites:', parsedFavorites);
            setFavorites(parsedFavorites);
          } catch (error) {
            console.error('Error parsing favorites:', error);
            setFavorites([]);
          }
        } else {
          console.log('No favorites found for user, setting empty array');
          setFavorites([]);
        }
        setIsLoaded(true);
      } else {
        console.log('No user logged in, clearing favorites');
        // When user logs out, don't clear favorites immediately
        // Just set to empty array for UI purposes
        setFavorites([]);
        setIsLoaded(false);
      }
    }
  }, [user, loading]);

  // Save favorites to localStorage whenever favorites change (but only after initial load)
  useEffect(() => {
    if (user && isLoaded) {
      console.log('Saving favorites for user:', user.id, favorites);
      // Always save to user-specific key
      localStorage.setItem(`moviesprix-favorites-${user.id}`, JSON.stringify(favorites));
      console.log('Favorites saved to localStorage');
    }
  }, [favorites, user, isLoaded]);

  const addToFavorites = (movie: IMovie) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorited = prevFavorites.some(fav => fav.id === movie.id);
      if (!isAlreadyFavorited) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => fav.id !== movieId)
    );
  };

  const isFavorited = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  const toggleFavorite = (movie: IMovie) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorited = prevFavorites.some(fav => fav.id === movie.id);
      
      if (isAlreadyFavorited) {
        return prevFavorites.filter(fav => fav.id !== movie.id);
      } else {
        return [...prevFavorites, movie];
      }
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    if (user) {
      localStorage.removeItem(`moviesprix-favorites-${user.id}`);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}