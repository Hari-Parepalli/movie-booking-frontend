import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Film } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import heroImage from "@/assets/hero-cinema.jpg";

const popularCities = [
  "Hyderabad",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad"
];

const Hero = () => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const { selectedCity, setSelectedCity } = useLocation();

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleBrowseMovies = () => {
    document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Darker Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Book Your
          </span>
          <br />
          <span className="text-white drop-shadow-lg">Movie Experience</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Discover the latest blockbusters and book your tickets in just a few clicks
        </p>

        {/* Location Selector */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 px-6 py-3 bg-white/95 hover:bg-white text-black rounded-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <MapPin className="h-5 w-5 text-red-500" />
              <span>{selectedCity}</span>
            </button>

            {/* Dropdown Menu */}
            {showCityDropdown && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl z-50 w-56 border border-gray-200">
                <div className="p-2">
                  <p className="text-xs text-gray-500 font-semibold px-3 py-2">SELECT CITY</p>
                  <div className="space-y-1">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-4 py-2.5 rounded transition-all ${
                          selectedCity === city
                            ? "bg-red-500 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{city}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call-To-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Browse Movies Button */}
          <Button
            onClick={handleBrowseMovies}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg group"
          >
            <Film className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            🎬 Browse Movies
          </Button>

          {/* Select City Button (Mobile-friendly alternative) */}
          <Button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/20 font-bold px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            <MapPin className="mr-2 h-5 w-5" />
            📍 Select City
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-14 flex justify-center items-center gap-8 text-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Instant Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Best Prices</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Easy Payment</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;