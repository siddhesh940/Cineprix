import CastCard from '@/components/cast-card';
import MovieCard from '@/components/movie-card';
import MovieInfo from '@/components/movie-info';
import { SimilarMovies } from '@/components/recommendations/similar-movies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getMovieInfo } from '@/utils/movies';
import { Film, Users } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const id = (await params).id;
    const response = await getMovieInfo(id);

    if (!response) return { title: 'Movie not found' };

    return {
        title: `${response.title} - CinePrix`,
        description: response.overview,

        openGraph: {
            title: response.title,
            description: response.overview,
            images: [
                {
                    url: `https://image.tmdb.org/t/p/w500/${response.backdrop_path}`,
                    width: 500,
                    height: 750,
                    alt: response.title,
                },
            ],
        },
    };
}

// 🎬 Enhanced Movie Details Page - Premium Design
const MovieDetailsPage = async (props: Props) => {
    const movieId = (await props.params).id;

    const response = await getMovieInfo(movieId);
    if (!response) return notFound();
    
    const { cast, similarMovies, trailers, ...movieInfo } = response;

    return (
        <div className="min-h-screen text-white space-y-8">
            {/* Hero Movie Information */}
            <div className="rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
                <MovieInfo info={{ ...movieInfo, trailers }} />
            </div>

            {/* Cast Section */}
            {cast && cast.length > 0 && (
                <Card className="w-full overflow-hidden bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
                                <Users className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-xl">Cast & Crew</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Meet the talented actors who bring this story to life
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max gap-4 pb-4">
                                {cast.map((actor, index) => (
                                    <CastCard key={`${actor.id}-${index}`} cast={actor} />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="h-2 bg-white/5" />
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* Similar Movies Section */}
            {similarMovies && similarMovies.length > 0 && (
                <Card className="w-full overflow-hidden bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
                                <Film className="size-5 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-xl">More Like This</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Discover similar movies you might enjoy
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max gap-4 pb-4">
                                {similarMovies.map((movie, index) => (
                                    <MovieCard 
                                        key={movie.id} 
                                        movie={movie}
                                        index={index}
                                        className="w-[180px]" 
                                    />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="h-2 bg-white/5" />
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
            
            {/* Enhanced Similar Movies with Recommendations */}
            <div className="rounded-2xl overflow-hidden">
                <SimilarMovies 
                    movieId={parseInt(movieId)} 
                    movieTitle={movieInfo.title}
                    showTitle={true}
                />
            </div>
        </div>
    );
};

export default MovieDetailsPage;