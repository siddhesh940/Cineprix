import { Film } from 'lucide-react';

const Loader = () => {
    return (
        <div className="flex flex-1 text-center flex-col h-[98dvh] items-center justify-center gap-4 md:gap-6">
            {/* Animated Logo Container */}
            <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                
                {/* Spinning ring */}
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-500/50 animate-spin" style={{ animationDuration: '1s' }} />
                    
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="size-7 md:size-9 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Text */}
            <div className="space-y-1">
                <p className="text-lg md:text-xl font-semibold tracking-wider uppercase bg-gradient-to-r from-red-400 via-red-500 to-red-400 bg-clip-text text-transparent">
                    Loading
                </p>
                <div className="flex justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};

export default Loader;
