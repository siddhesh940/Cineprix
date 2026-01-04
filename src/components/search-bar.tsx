'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = {
    onChange?: (query: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    showTrending?: boolean;
};

// 🔍 Premium Netflix-style Search Bar
const SearchBar = (props: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (props.onChange) {
                props.onChange(query);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, props]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        if (pathname !== '/search') {
            router.push('/search');
        }
        if (props.onFocus) {
            props.onFocus();
        }
    }, [pathname, router, props]);

    const handleBlur = useCallback(() => {
        setTimeout(() => setIsFocused(false), 200);
    }, []);

    const clearSearch = useCallback(() => {
        setQuery('');
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && pathname !== '/search') {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    }, [query, pathname, router]);

    const popularSearches = ['Action', 'Marvel', 'Comedy', 'Horror', 'Sci-Fi', 'Drama'];

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
                <motion.div 
                    initial={false}
                    animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "relative flex items-center w-full gap-3 py-4 px-5 rounded-2xl transition-all duration-500",
                        "border-2 backdrop-blur-xl",
                        isFocused 
                            ? "bg-white/95 border-red-500 shadow-2xl shadow-red-500/20" 
                            : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    )}
                >
                    {/* Search Icon with Animation */}
                    <motion.div
                        animate={isFocused ? { rotate: 0, scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Search className={cn(
                            "size-5 transition-colors duration-300",
                            isFocused ? "text-red-500" : "text-gray-400"
                        )} />
                    </motion.div>
                    
                    <input
                        className={cn(
                            "font-medium flex-1 bg-transparent outline-none text-base",
                            isFocused 
                                ? "text-gray-900 placeholder:text-gray-400" 
                                : "text-white placeholder:text-gray-500"
                        )}
                        placeholder={props.placeholder || "Search movies, actors, directors..."}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoFocus={props.autoFocus || pathname === '/search'}
                    />

                    {/* Clear Button */}
                    <AnimatePresence>
                        {query && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={clearSearch}
                                className={cn(
                                    "p-1.5 rounded-full transition-colors",
                                    isFocused 
                                        ? "hover:bg-gray-100 text-gray-500" 
                                        : "hover:bg-white/10 text-gray-400"
                                )}
                            >
                                <X className="size-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Keyboard Shortcut Hint */}
                    {!isFocused && !query && (
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg">
                            <span className="text-xs text-gray-500 font-mono">/</span>
                        </div>
                    )}

                    {/* Glow Effect */}
                    {isFocused && (
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-red-500/20 blur-xl" />
                    )}
                </motion.div>
            </form>

            {/* Popular Searches Dropdown */}
            <AnimatePresence>
                {props.showTrending && !query && isFocused && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-3 left-0 right-0 bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-2xl z-50"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                            <TrendingUp className="size-4 text-red-400" />
                            <span className="font-medium">Popular searches</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map((term) => (
                                <motion.button
                                    key={term}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => {
                                        setQuery(term);
                                        if (props.onChange) props.onChange(term);
                                    }}
                                    className="px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-white rounded-full text-sm font-medium transition-all duration-200 border border-white/5 hover:border-red-500/30"
                                >
                                    {term}
                                </motion.button>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                            <Sparkles className="size-3.5 text-purple-400" />
                            <span>Press Enter to search</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
