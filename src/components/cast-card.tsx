import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { ICast } from '@/types/api-response';
import Image from './client/image';

type Props = {
    cast: ICast;
    className?: string;
};

// Premium Cast Card Component
const CastCard = ({ cast, className }: Props) => {
    return (
        <div className="group cursor-pointer">
            <div className={cn(
                'rounded-xl overflow-hidden relative h-52 md:h-64 aspect-[3/4]',
                'bg-gray-900 border border-white/5',
                'shadow-lg transition-all duration-500',
                'group-hover:shadow-2xl group-hover:shadow-red-500/10',
                'group-hover:border-red-500/20 group-hover:-translate-y-1',
                className
            )}>
                {/* Profile Image */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={getImageUrl(cast.profile_path || '', 'w342')}
                        placeholderSrc={getImageUrl(cast.profile_path || '', 'w154')}
                        alt={cast.name}
                    />
                </div>

                {/* Gradient overlay - stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Cast information */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-sm md:text-base line-clamp-1 text-white group-hover:text-red-400 transition-colors duration-300">
                        {cast.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mt-1 group-hover:text-gray-300 transition-colors">
                        as <span className="text-gray-300 font-medium">{cast.character}</span>
                    </p>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default CastCard;
