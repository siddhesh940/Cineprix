import CastCard from '@/components/cast-card';
import MovieCard from '@/components/movie-card';
import MovieInfo from '@/components/movie-info';
import { SimilarMovies } from '@/components/recommendations/similar-movies';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getMovieInfo } from '@/utils/movies';
import { Film, Users } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

/* ================================
   SEO Metadata (Next.js 15 Safe)
================================ */
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const response = await getMovieInfo(params.id);

  if (!response) {
    return {
      title: 'Movie not found - CinePrix',
    };
  }

  return {
    title: `${response.title} - CinePrix`,
    description: response.overview,
    openGraph: {
      title: response.title,
      description: response.overview,
      images: response.backdrop_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w780/${response.backdrop_path}`,
              width: 780,
              height: 439,
              alt: response.title,
            },
          ]
        : [],
    },
  };
}

/* ================================
   Movie Details Page
================================ */
export default async function MovieDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getMovieInfo(params.id);
  if (!response) notFound();

  const { cast, similarMovies, trailers, ...movieInfo } = response;

  return (
    <div className="min-h-screen space-y-8 text-white">
      {/* 🎬 Hero Section */}
      <div className="rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
        <MovieInfo info={{ ...movieInfo, trailers }} />
      </div>

      {/* 👥 Cast Section */}
      {cast?.length > 0 && (
        <Card className="rounded-2xl border-white/5 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/20 p-2.5 ring-1 ring-blue-500/30">
                <Users className="size-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">
                  Cast & Crew
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Meet the talented actors who bring this story to life
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max gap-4 pb-4">
                {cast.map((actor) => (
                  <CastCard key={actor.id} cast={actor} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2 bg-white/5" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* 🎞️ Similar Movies */}
      {similarMovies?.length > 0 && (
        <Card className="rounded-2xl border-white/5 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/20 p-2.5 ring-1 ring-purple-500/30">
                <Film className="size-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">
                  More Like This
                </CardTitle>
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

      {/* ⭐ Smart Recommendations */}
      <div className="overflow-hidden rounded-2xl">
        <SimilarMovies
          movieId={Number(params.id)}
          movieTitle={movieInfo.title}
          showTitle
        />
      </div>
    </div>
  );
}
