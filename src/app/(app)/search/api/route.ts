import { searchMovies } from '@/utils/movies';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    
    // 🔍 Enhanced search with pagination
    const res = await searchMovies(query, page);

    return Response.json(res);
}
