import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchResults from "@/components/SearchResults";
import MoviesSection from "@/components/MoviesSection";
import TheatresSection from "@/components/TheatresSection";
import OffersSection from "@/components/OffersSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";

const Index = () => {
  const { selectedCity, setSelectedCity } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery("");
    setLocation("");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setLocation(city);
  };

  const handleTheatreSelect = (theatreId: string, theatreName: string) => {
    setSelectedTheatre(theatreName);
    // Scroll to movies section smoothly
    setTimeout(() => {
      const moviesSection = document.getElementById("movies");
      if (moviesSection) {
        moviesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleOffersClick = () => {
    setShowOffers(!showOffers);
    setShowEvents(false); // Close events if open
    setTimeout(() => {
      const offersSection = document.getElementById("offers");
      if (offersSection) {
        offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleEventsClick = () => {
    setShowEvents(!showEvents);
    setShowOffers(false); // Close offers if open
    setTimeout(() => {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        onSearch={setSearchQuery} 
        onOffersClick={handleOffersClick}
        onEventsClick={handleEventsClick}
      />
      <Hero />
      {(searchQuery || location) && (
        <SearchResults
          searchQuery={searchQuery}
          location={location}
          allMovies={allMovies}
          isLoading={isSearchLoading}
          onClear={handleClearSearch}
        />
      )}
      <MoviesSection 
        searchQuery={searchQuery} 
        location={location}
        onMoviesLoaded={setAllMovies}
        onLoadingChange={setIsSearchLoading}
        selectedTheatre={selectedTheatre}
      />
      <TheatresSection onTheatreSelect={handleTheatreSelect} />
      {showOffers && <OffersSection />}
      {showEvents && <EventsSection />}
      <Footer />
    </div>
  );
};

export default Index;
