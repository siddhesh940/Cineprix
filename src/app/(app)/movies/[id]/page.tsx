import CastCard from '@/components/cast-card';
import MovieCard from '@/components/movie-card';
import MovieInfo from '@/components/movie-info';
import { SimilarMovies } from '@/components/recommendations/similar-movies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getMovieInfo } from '@/utils/movies';
import { Film, Users } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

/* =========================
   NEXT.JS 15 INTERFACES
========================= */
interface PageProps {
  params: Promise<{ id: string }>;
}

/* =========================
   METADATA GENERATION
========================= */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params;
  const movie = await getMovieInfo(resolvedParams.id);

  if (!movie) {
    return { title: 'Movie Not Found - CinePix' };
  }

  return {
    title: `${movie.title} - CinePix`,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path
        ? [`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`]
        : [],
    },
  };
}

/* =========================
   PAGE COMPONENT (NO PROPS)
========================= */
export default async function MovieDetailsPage(
  { params }: PageProps
) {
  const resolvedParams = await params;
  const movie = await getMovieInfo(resolvedParams.id);

  if (!movie) notFound();

  const { cast, similarMovies, trailers, ...movieInfo } = movie;

  return (
    <div className="min-h-screen space-y-10 text-white">
      
      {/* HERO */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur">
        <MovieInfo info={{ ...movieInfo, trailers }} />
      </div>

      {/* CAST */}
      {cast?.length > 0 && (
        <Card className="bg-gray-900/50 border-white/10 rounded-2xl">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" />
              <div>
                <CardTitle>Cast & Crew</CardTitle>
                <CardDescription>Actors in this movie</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {cast.map(actor => (
                  <CastCard
                    key={actor.id}
                    cast={actor}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* SIMILAR MOVIES */}
      {similarMovies?.length > 0 && (
        <Card className="bg-gray-900/50 border-white/10 rounded-2xl">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <Film className="text-purple-400" />
              <div>
                <CardTitle>More Like This</CardTitle>
                <CardDescription>Recommended movies</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {similarMovies.map((m, index) => (
                  <MovieCard
                    key={m.id}
                    movie={m}
                    index={index}
                    className="w-[180px]"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* AI RECOMMENDATIONS */}
      <SimilarMovies
        movieId={Number(resolvedParams.id)}
        movieTitle={movieInfo.title}
        showTitle
      />
    </div>
  );
}
