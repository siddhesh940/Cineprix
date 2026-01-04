import { IMovie } from '@/types/api-response';
import { getPersonalizedRecommendations, getSimilarMovies } from './movies';

export interface RecommendationData {
  personalizedMovies: IMovie[];
  similarMovies: IMovie[];
  trendingNow: IMovie[];
  categories: {
    name: string;
    movies: IMovie[];
  }[];
}

export class RecommendationService {
  static analyzeUserPreferences(favorites: IMovie[]) {
    if (!favorites.length) {
      return {
        favoriteGenres: [],
        averageRating: 0,
        preferredDecades: [],
        topActors: [],
      };
    }

    // Extract genres from favorite movies
    const genreCount: { [key: number]: number } = {};
    const decades: { [key: string]: number } = {};
    let totalRating = 0;

    favorites.forEach(movie => {
      // Count genres
      if (movie.genre_ids) {
        movie.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      }

      // Count decades
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear();
        const decade = `${Math.floor(year / 10) * 10}s`;
        decades[decade] = (decades[decade] || 0) + 1;
      }

      // Sum ratings
      totalRating += movie.vote_average || 0;
    });

    // Sort genres by frequency
    const favoriteGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genreId]) => parseInt(genreId));

    // Sort decades by preference
    const preferredDecades = Object.entries(decades)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([decade]) => decade);

    return {
      favoriteGenres,
      averageRating: totalRating / favorites.length,
      preferredDecades,
      topActors: [], // Could be enhanced with cast data
    };
  }

  static async generateRecommendations(
    favorites: IMovie[],
    currentMovieId?: number
  ): Promise<RecommendationData> {
    const preferences = this.analyzeUserPreferences(favorites);
    const excludeIds = favorites.map(m => m.id);
    
    if (currentMovieId) {
      excludeIds.push(currentMovieId);
    }

    try {
      const [personalizedMoviesResult, similarMoviesResult] = await Promise.all([
        getPersonalizedRecommendations(preferences.favoriteGenres, excludeIds),
        currentMovieId ? getSimilarMovies(currentMovieId) : Promise.resolve({ results: [] })
      ]);

      // Ensure we have arrays to work with
      const personalizedMovies = Array.isArray(personalizedMoviesResult) ? personalizedMoviesResult : [];
      const similarMovies = similarMoviesResult && typeof similarMoviesResult === 'object' && 'results' in similarMoviesResult && Array.isArray(similarMoviesResult.results) ? similarMoviesResult.results : [];

      const categories = [
        {
          name: 'Because You Liked',
          movies: favorites.length > 0 ? personalizedMovies.slice(0, 10) : []
        },
        {
          name: 'More Like This',
          movies: similarMovies.slice(0, 8)
        },
        {
          name: 'Popular Picks',
          movies: personalizedMovies.slice(10, 18)
        }
      ].filter(category => category.movies.length > 0);

      return {
        personalizedMovies: personalizedMovies.slice(0, 12),
        similarMovies: similarMovies.slice(0, 8),
        trendingNow: personalizedMovies.slice(0, 6),
        categories
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        personalizedMovies: [],
        similarMovies: [],
        trendingNow: [],
        categories: []
      };
    }
  }

  static getRecommendationReasons(movie: IMovie, userPreferences: any): string[] {
    const reasons: string[] = [];

    // Genre-based reasons
    if (movie.genre_ids && userPreferences.favoriteGenres.length > 0) {
      const matchingGenres = movie.genre_ids.filter(id => 
        userPreferences.favoriteGenres.includes(id)
      );
      if (matchingGenres.length > 0) {
        reasons.push('Matches your favorite genres');
      }
    }

    // Rating-based reasons
    if (movie.vote_average && movie.vote_average >= userPreferences.averageRating) {
      reasons.push('Highly rated');
    }

    // Decade-based reasons
    if (movie.release_date) {
      const year = new Date(movie.release_date).getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;
      if (userPreferences.preferredDecades.includes(decade)) {
        reasons.push(`From your favorite decade (${decade})`);
      }
    }

    // Default reasons if none found
    if (reasons.length === 0) {
      if (movie.popularity && movie.popularity > 50) {
        reasons.push('Popular choice');
      }
      if (movie.vote_average && movie.vote_average > 7) {
        reasons.push('Critics favorite');
      }
    }

    return reasons.slice(0, 2); // Limit to 2 reasons
  }
}