import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { apiService, Movie } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'%3E%3Crect fill='%23333' width='300' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='24' font-family='Arial' font-weight='bold'%3EMovie Poster%3C/text%3E%3C/svg%3E";

// Only use images from trusted domains
const getSafeImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return placeholderImage;
  
  // Accept data URLs
  if (imageUrl.startsWith('data:')) return imageUrl;
  
  // Accept HTTPS from trusted domains only
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

const MoviesSection = ({ 
  searchQuery = "", 
  location = "",
  onMoviesLoaded,
  onLoadingChange,
  selectedTheatre = null
}: { 
  searchQuery?: string
  location?: string
  onMoviesLoaded?: (movies: Movie[]) => void
  onLoadingChange?: (loading: boolean) => void
  selectedTheatre?: string | null
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock locations for movies (simulating theater availability)
  const movieLocations: Record<string, string[]> = {
    // This would come from your backend in a real scenario
    // For now, we'll use movie titles as keys and assign locations
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        onLoadingChange?.(true);
        setIsLoading(true);
        setError(null);
        const data = await apiService.getMovies();
        setAllMovies(data || []);
        setMovies(data || []);
        onMoviesLoaded?.(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch movies";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchMovies();
    
    // Refresh movies every 30 seconds for real-time updates
    const interval = setInterval(fetchMovies, 30000);
    return () => clearInterval(interval);
  }, [onMoviesLoaded, onLoadingChange]);

  // Handle search and location filtering - only when search is active
  useEffect(() => {
    if (searchQuery || location) {
      let filtered = allMovies;

      if (searchQuery.trim()) {
        filtered = filtered.filter((movie) => 
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (location.trim()) {
        filtered = filtered.filter((movie) => {
          const locations = movieLocations[movie.id] || [];
          return locations.some(loc => 
            loc.toLowerCase().includes(location.toLowerCase())
          );
        });
      }

      setMovies(filtered);
    } else {
      setMovies(allMovies);
    }
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

  return (
    <section id="movies" className="py-16 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Only show heading and content when no search is active */}
        {!searchQuery && !location && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Now Showing
                </span>
              </h2>
              {selectedTheatre ? (
                <div className="mb-4">
                  <p className="text-lg text-gray-200">
                    🎬 Movies at <span className="font-bold text-red-400">{selectedTheatre}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Catch the latest blockbusters in theaters near you
                </p>
              )}
            </div>

            {error && !error.includes('unavailable') && (
              <Alert variant="destructive" className="mb-8 bg-red-900/20 border-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
                  <p className="text-gray-400">Loading movies...</p>
                </div>
              </div>
            ) : allMovies.length > 0 ? (
              <>
                {/* Carousel Container */}
                <div className="relative group mb-12">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  {/* Movies Carousel */}
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {allMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex-shrink-0 w-72 snap-start transform transition-transform hover:scale-105 hover:shadow-2xl"
                      >
                        <MovieCard 
                          id={movie.id}
                          title={movie.title}
                          genre={movie.genre}
                          rating={movie.rating || 0}
                          image={getSafeImageUrl(movie.poster_url)}
                          banner={getSafeImageUrl(movie.banner_url)}
                          language="English"
                          releaseDate={movie.release_date || "TBA"}
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
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                <div className="text-center">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2">
                    View All Movies
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No movies available at the moment
                </p>
              </div>
            )}
          </>
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

export default MoviesSection;