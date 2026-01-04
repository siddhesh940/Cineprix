import { Metadata } from 'next';
import SearchResults from './result-new';

export const metadata: Metadata = {
    title: 'Search Movies - CinePrix',
    description: 'Search through thousands of movies and find your next favorite film.',
};

// 🔍 Netflix-style Search Page
const SearchPage = () => {
    return (
        <div>
            <SearchResults />
        </div>
    );
};

export default SearchPage;
