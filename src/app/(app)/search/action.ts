'use server';

import { searchMovies } from '@/utils/movies';

const searchMovieAction = async (query: string, signal?: AbortSignal) => {
    const res = await searchMovies(query, 1); // Use query string and default page 1
    return res;
};

export default searchMovieAction;
