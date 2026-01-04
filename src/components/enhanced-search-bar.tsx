'use client';

import { cn } from '@/lib/utils';
import { IMovie } from '@/types/api-response';
import axios from 'axios';
import { Search, TrendingUp, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchSuggestions } from './search-suggestions';

type Props = {
    onChange?: (query: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    showTrending?: boolean;
    showSuggestions?: boolean;
};

// 🔍 Enhanced Netflix-style Search Bar with Autocomplete
const EnhancedSearchBar = (props: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<IMovie[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 🚀 Debounced search - prevents excessive API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (props.onChange) {
                props.onChange(query);
            }
            
            // Fetch suggestions for dropdown
            if (props.showSuggestions && query.trim() && isFocused) {
                fetchSuggestions(query.trim());
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [query, props, isFocused]);

    // Fetch suggestions for autocomplete
    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        try {
            setSuggestionsLoading(true);
            const { data } = await axios.get('/search/api', { 
                params: { query: searchQuery } 
            });
            setSuggestions(data.results?.slice(0, 8) || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setSuggestionsLoading(false);
        }
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        setShowSuggestions(!!props.showSuggestions && query.trim().length > 0);
        
        if (pathname !== '/search') {
            router.push('/search');
        }
        if (props.onFocus) {
            props.onFocus();
        }
    }, [pathname, router, props, query]);

    const handleBlur = useCallback((e: React.FocusEvent) => {
        // Don't blur if clicking inside suggestions
        if (searchRef.current?.contains(e.relatedTarget as Node)) {
            return;
        }
        
        setTimeout(() => {
            setIsFocused(false);
            setShowSuggestions(false);
        }, 200);
    }, []);

    const clearSearch = useCallback(() => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
        }
    }, [query, router]);

    const handleSelectMovie = useCallback((movie: IMovie) => {
        setShowSuggestions(false);
        setQuery(movie.title);
    }, []);

    return (
        <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
            <form onSubmit={handleSubmit} className={cn(
                "flex items-center w-full gap-3 py-3 px-4 rounded-full transition-all duration-300 border-2",
                isFocused 
                    ? "bg-white border-red-500 shadow-lg shadow-red-500/20" 
                    : "bg-black/60 border-gray-600 hover:border-gray-500"
            )}>
                <Search className={cn(
                    "transition-colors duration-300 size-5",
                    isFocused ? "text-red-500" : "text-gray-400"
                )} />
                
                <input
                    className={cn(
                        "font-normal flex-1 bg-transparent outline-none text-base",
                        isFocused ? "text-gray-900 placeholder:text-gray-500" : "text-white placeholder:text-gray-400"
                    )}
                    placeholder={props.placeholder || "Search for movies..."}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoFocus={props.autoFocus || pathname === '/search'}
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="size-4 text-gray-500" />
                    </button>
                )}
            </form>

            {/* Search Suggestions Dropdown */}
            {props.showSuggestions && showSuggestions && (
                <SearchSuggestions
                    query={query}
                    results={suggestions}
                    onSelectMovie={handleSelectMovie}
                    loading={suggestionsLoading}
                />
            )}

            {/* Popular searches hint */}
            {props.showTrending && !query && isFocused && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-black/90 rounded-lg p-3 text-white text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                        <TrendingUp className="size-4" />
                        <span>Popular searches: Action, Marvel, Comedy, Horror</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedSearchBar;