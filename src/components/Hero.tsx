import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

const Hero = () => {
  const handleBrowseMovies = () => {
    document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Strong overlay with blur for premium feel and better text readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        <h1 className="mb-6 animate-fade-in">
          <div className="text-3xl md:text-4xl text-gray-200 font-medium mb-2 drop-shadow-lg">
            Book Your
          </div>
          <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg leading-tight">
            Movie Experience
          </div>
        </h1>
        
        <p className="text-base md:text-lg text-gray-100 mb-10 max-w-xl mx-auto drop-shadow-md animate-fade-in delay-100 font-light">
          Discover the latest blockbusters and book your tickets in just a few clicks
        </p>

        {/* Call-To-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
          {/* Browse Movies Button - PRIMARY */}
          <Button
            onClick={handleBrowseMovies}
            size="md"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 text-base group transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
          >
            <Film className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            🎬 Browse Movies
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-200 text-sm animate-fade-in delay-400">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-lg">✓</span>
            <span>Instant Booking</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-lg">✓</span>
            <span>Best Prices</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-lg">✓</span>
            <span>Easy Payment</span>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;