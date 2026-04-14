import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { apiService, Movie } from "@/lib/api";
import { Button } from "@/components/ui/button";

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'%3E%3Crect fill='%23333' width='300' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='24' font-family='Arial' font-weight='bold'%3EMovie Poster%3C/text%3E%3C/svg%3E";

const getSafeImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return placeholderImage;
  if (imageUrl.startsWith('data:')) return imageUrl;
  try {
    const url = new URL(imageUrl);
    const trustedDomains = ['imgur.com', 'unsplash.com', 'pexels.com', 'pixabay.com', 'cloudinary.com', 'image.tmdb.org'];
    const hostname = url.hostname.toLowerCase();
    const isTrusted = trustedDomains.some(domain => hostname.includes(domain));
    return isTrusted ? imageUrl : placeholderImage;
  } catch {
    return placeholderImage;
  }
};

interface SearchResultsProps {
  searchQuery: string;
  location: string;
  allMovies: Movie[];
  isLoading: boolean;
  onClear: () => void;
}

const SearchResults = ({ searchQuery, location, allMovies, isLoading, onClear }: SearchResultsProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let results = allMovies;

    if (searchQuery.trim()) {
      results = results.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (location.trim()) {
      results = results.filter((movie) => {
        // Location filtering logic here
        return true; // Placeholder until backend supports location
      });
    }

    setFilteredMovies(results);
  }, [searchQuery, location, allMovies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!searchQuery && !location) return null;

  return (
    <section className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 border-b-2 border-red-600/50 shadow-2xl py-6 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white">
              Search Results
              {searchQuery && <span className="text-red-500 ml-2">"{searchQuery}"</span>}
              {location && <span className="text-pink-500 ml-2">📍 {location}</span>}
            </h3>
            <p className="text-sm text-gray-300">
              Found <span className="text-red-500 font-semibold">{filteredMovies.length}</span> movie{filteredMovies.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2 border-red-600 text-red-500 hover:bg-red-600/20"
          >
            <X className="h-4 w-4" />
            Clear Search
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-red-500 mr-3" />
            <span className="text-gray-300">Searching...</span>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Horizontal Scroll Container - NO SCROLLBAR */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-0 snap-x snap-mandatory"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="flex-shrink-0 w-56 snap-start transform transition-transform hover:scale-105 hover:shadow-2xl"
                >
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    genre={movie.genre}
                    rating={movie.rating || 0}
                    image={getSafeImageUrl(movie.poster_url)}
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-400">No movies found matching your search criteria</p>
          </div>
        )}
      </div>

      {/* Hide scrollbar for all browsers */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SearchResults;
