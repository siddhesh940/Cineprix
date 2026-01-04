import MovieCard from '@/components/movie-card';
import { MovieRecommendations } from '@/components/recommendations/movie-recommendations';
import TrendingSection from '@/components/trending-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { discoverMovies, getTrendingMovies } from '@/utils/movies';
import { Award, Clapperboard, Film, Flame, Ghost, Globe, Laugh, Rocket, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home - CinePrix',
};

// Category icons mapping
const categoryIcons: Record<string, any> = {
    'Trending Now': Flame,
    'Popular Worldwide': Globe,
    'Action & Adventure': Zap,
    'Comedy Gold': Laugh,
    'Sci-Fi Wonders': Rocket,
    'Horror Nightmares': Ghost,
    'Leonardo DiCaprio Collection': Award,
    'Tom Cruise Action': Clapperboard,
    'Bollywood Blockbusters': Film,
};

// Netflix-Style Categories with Enhanced UI
const getMovieCategories = async () => {
    try {
        const [trendingResult, popularMovies] = await Promise.all([
            getTrendingMovies(),
            discoverMovies({ sort_by: 'popularity.desc' })
        ]);
        
        return [
            {
                title: 'Trending Now',
                description: 'What\'s hot and trending this week',
                movies: trendingResult.results,
                priority: true,
            },
            {
                title: 'Popular Worldwide',
                description: 'Discover the most popular movies right now',
                movies: popularMovies,
            },
            {
                title: 'Action & Adventure',
                description: 'Adrenaline-pumping action and thrilling adventures',
                movies: await discoverMovies({ with_genres: '28', sort_by: 'vote_count.desc' }),
            },
            {
                title: 'Comedy Gold',
                description: 'Laugh out loud with these comedy masterpieces',
                movies: await discoverMovies({ with_genres: '35', sort_by: 'vote_average.desc' }),
            },
            {
                title: 'Sci-Fi Wonders',
                description: 'Explore futuristic worlds and mind-bending stories',
                movies: await discoverMovies({ with_genres: '878', sort_by: 'vote_count.desc' }),
            },
            {
                title: 'Horror Nightmares',
                description: 'Spine-chilling thrills that will keep you awake',
                movies: await discoverMovies({ with_genres: '27', sort_by: 'vote_average.desc' }),
            },
            {
                title: 'Leonardo DiCaprio Collection',
                description: 'Masterful performances from the Oscar winner',
                movies: await discoverMovies({ with_people: '6194', sort_by: 'vote_count.desc' }),
            },
            {
                title: 'Tom Cruise Action',
                description: 'High-octane adventures with the Mission Impossible star',
                movies: await discoverMovies({ with_people: '500', sort_by: 'popularity.desc' }),
            },
            {
                title: 'Bollywood Blockbusters',
                description: 'The best of Indian cinema and entertainment',
                movies: await discoverMovies({ with_original_language: 'hi', sort_by: 'vote_count.desc' }),
            },
        ];
    } catch (error) {
        console.error('Error loading movie categories:', error);
        return [];
    }
};

// Premium Movie Category Section
const MovieCategorySection = ({ category, index }: { category: any; index: number }) => {
    const IconComponent = categoryIcons[category.title] || Film;
    
    return (
        <div 
            className="w-full"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Card className="w-full overflow-hidden bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 border-white/5 backdrop-blur-sm hover:border-white/10 transition-all duration-500">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${category.priority ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                                <IconComponent className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                                    {category.title}
                                    {category.priority && (
                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full">
                                            HOT
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-gray-500 text-sm mt-0.5">
                                    {category.description}
                                </CardDescription>
                            </div>
                        </div>
                        <span className="text-gray-600 text-sm font-medium">
                            {category.movies?.length} movies
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <ScrollArea className="w-full">
                        <div className="flex gap-4 pb-4">
                            {category.movies?.map((movie: any, movieIndex: number) => (
                                <div key={movie.id} className="flex-shrink-0 w-[140px] md:w-[160px]">
                                    <MovieCard 
                                        movie={movie} 
                                        index={movieIndex}
                                    />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="h-2 bg-white/5" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default async function Home() {
    const categories = await getMovieCategories();
    const filteredCategories = categories.filter(category => category.movies && category.movies.length > 0);

    return (
        <div className="min-h-screen text-white">
            <div className="space-y-8 w-full">
                {/* Hero Trending Section */}
                <section className="w-full -mx-2 md:-mx-5 px-2 md:px-5">
                    <TrendingSection />
                </section>

                {/* Movie Categories */}
                <section className="space-y-6">
                    {filteredCategories.map((category, index) => (
                        <MovieCategorySection 
                            key={category.title} 
                            category={category}
                            index={index}
                        />
                    ))}
                </section>
                
                {/* Recommendations Section - Premium "Made for You" */}
                <section className="mt-12 pt-8 border-t border-white/5">
                    {/* Section divider gradient */}
                    <div className="relative">
                        <div className="absolute -top-8 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
                    </div>
                    
                    <Card className="overflow-hidden bg-gradient-to-br from-purple-950/40 via-gray-900/80 to-pink-950/40 border-purple-500/20 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10">
                        <CardContent className="p-8 md:p-10">
                            <MovieRecommendations 
                                title="Made for You" 
                                showCategories={true}
                            />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
