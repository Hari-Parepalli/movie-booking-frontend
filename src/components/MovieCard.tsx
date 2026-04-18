import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock, Volume2, Play, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import BookingDialog from "./BookingDialog";

interface MovieCardProps {
  id: string;
  title: string;
  genre: string;
  rating?: number;
  image: string;
  banner?: string;
  language?: string;
  releaseDate?: string;
  duration?: number; // in minutes
}

const MovieCard = ({ 
  id,
  title, 
  genre, 
  rating = 0, 
  image,
  banner,
  language = "English", 
  releaseDate = "TBA",
  duration = 120
}: MovieCardProps) => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handlePlayTrailer = () => {
    // For demo purposes, show a message or open YouTube
    toast({
      title: "🎬 Coming Soon",
      description: `Trailer for "${title}" will be available soon!`,
    });
    // In production, you could open a video modal here
  };

  const handleViewShows = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to book tickets",
        variant: "destructive",
      });
      return;
    }
    
    // Open booking dialog
    setBookingDialogOpen(true);
  };

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'%3E%3Crect fill='%23333' width='300' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='24' font-family='Arial' font-weight='bold'%3EMovie Poster%3C/text%3E%3C/svg%3E";

  // Only use image if it's a data URL or from a trusted domain
  const getSafeImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return placeholderImage;
    
    // Accept data URLs (SVG, PNG, etc)
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // Accept HTTPS URLs only from specific trusted domains
    const trustedDomains = ['imgur.com', 'unsplash.com', 'pexels.com', 'pixabay.com', 'cloudinary.com', 'image.tmdb.org'];
    const url = new URL(imageUrl).hostname.toLowerCase();
    
    const isTrusted = trustedDomains.some(domain => url.includes(domain));
    
    // If from trusted domain, use it; otherwise use placeholder
    return isTrusted ? imageUrl : placeholderImage;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRatingColor = (rate: number) => {
    if (rate >= 8) return "bg-gradient-to-r from-green-600 to-emerald-600";
    if (rate >= 7) return "bg-gradient-to-r from-blue-600 to-cyan-600";
    if (rate >= 6) return "bg-gradient-to-r from-yellow-500 to-orange-600";
    return "bg-gradient-to-r from-red-600 to-pink-600";
  };

  return (
    <>
      <Card 
        className="group overflow-hidden border-slate-700 hover:border-red-600/80 transition-all duration-300 cursor-pointer bg-slate-800 hover:shadow-red-600/25"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: isHovered ? '0 20px 25px -5px rgba(220, 38, 38, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Poster Image Container */}
        <div className="relative overflow-hidden h-80 bg-slate-900 group/image">
          {banner && banner !== placeholderImage && (
            <img 
              src={banner} 
              alt={`${title} banner`}
              className="absolute w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              onError={() => {}}
            />
          )}
          
          {/* Main Poster - Full Visibility */}
          <img 
            src={getSafeImageUrl(image)} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 relative z-10"
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
          />

          {/* Subtle Dark Overlay on Hover Only */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <button 
              onClick={handlePlayTrailer}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-2xl hover:shadow-red-600/50 hover:scale-110"
            >
              <Play className="h-8 w-8 fill-white" />
            </button>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 z-30 flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-slate-900/80 backdrop-blur-sm text-gray-200 border-0 text-xs font-semibold">
              <Volume2 className="h-3 w-3 mr-1" />
              {language}
            </Badge>
          </div>

          {/* Rating Badge - Top Right */}
          {rating > 0 && (
            <div className={`absolute top-3 right-3 ${getRatingColor(rating)} px-3 py-1 rounded-full shadow-lg z-30 flex items-center gap-1 text-white font-bold text-sm hover:scale-110 transition-transform`}>
              <Star className="h-4 w-4 fill-white" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-base mb-1 line-clamp-2 text-white" title={title}>
              {title}
            </h3>
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold">{genre}</p>
          </div>

          {/* Movie Info */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-700">
            {/* Duration */}
            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              <span>{formatDuration(duration)}</span>
            </div>

            {/* Release Date */}
            {releaseDate && releaseDate !== "TBA" && (
              <div className="flex items-center gap-1.5 text-gray-300">
                <Calendar className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                <span>{releaseDate}</span>
              </div>
            )}
          </div>

          {/* View Shows Button */}
          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 rounded-lg transition-all duration-200 gap-2 shadow-lg hover:shadow-xl"
            onClick={handleViewShows}
          >
            <Eye className="h-4 w-4" />
            View Shows
          </Button>
        </CardContent>
      </Card>

      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        movie={{
          id,
          title,
          genre,
          rating,
          posterUrl: image,
        }}
      />
    </>
  );
};

export default MovieCard;