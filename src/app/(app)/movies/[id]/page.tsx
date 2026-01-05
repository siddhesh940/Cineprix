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

/* ✅ Next.js 15 compliant PageProps */
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/* ---------------- Metadata ---------------- */
export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const movie = await getMovieInfo(id);

  if (!movie) {
    return { title: 'Movie not found - CinePix' };
  }

  return {
    title: `${movie.title} - CinePix`,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`,
              width: 1200,
              height: 630,
              alt: movie.title,
            },
          ]
        : [],
    },
  };
}

/* ---------------- Page ---------------- */
export default async function MovieDetailsPage(
  props: PageProps
) {
  const { id } = await props.params;
  const data = await getMovieInfo(id);

  if (!data) notFound();

  const { cast, similarMovies, trailers, ...movieInfo } = data;

  return (
    <div className="min-h-screen space-y-8 text-white">
      <div className="rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
        <MovieInfo info={{ ...movieInfo, trailers }} />
      </div>

      {cast?.length > 0 && (
        <Card className="bg-gray-900/40 border-white/5 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" />
              <div>
                <CardTitle>Cast & Crew</CardTitle>
                <CardDescription>
                  Actors who brought this story to life
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea>
              <div className="flex w-max gap-4 pb-4">
                {cast.map(actor => (
                  <CastCard key={actor.id} cast={actor} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {similarMovies?.length > 0 && (
        <Card className="bg-gray-900/40 border-white/5 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Film className="text-purple-400" />
              <div>
                <CardTitle>More Like This</CardTitle>
                <CardDescription>
                  Movies you might enjoy
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea>
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <SimilarMovies
        movieId={Number(id)}
        movieTitle={movieInfo.title}
        showTitle
      />
    </div>
  );
}
