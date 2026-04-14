import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Clock, MapIcon, Star, Film } from "lucide-react";

interface Theatre {
  id: string;
  name: string;
  city: string;
  screens: number;
  location: string;
  phone: string;
  hours: string;
  featured: boolean;
  rating: number; // 1-5
  logo: string; // URL to theater logo/image
  showtimes: string[]; // Array of show times like ["10:30 AM", "1:45 PM", "6:00 PM"]
}

const THEATRES: Theatre[] = [
  {
    id: "1",
    name: "PVR Cinemas",
    city: "Mumbai",
    screens: 5,
    location: "High Street Phoenix, Lower Parel",
    phone: "+91-22-1234-5678",
    hours: "10:00 AM - 11:00 PM",
    featured: true,
    rating: 4.8,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%23ef4444' font-size='48' font-weight='bold' font-family='Arial'%3EPVR%3C/text%3E%3C/svg%3E",
    showtimes: ["10:30 AM", "1:45 PM", "4:30 PM", "7:15 PM", "10:00 PM"],
  },
  {
    id: "2",
    name: "INOX Multiplex",
    city: "Bangalore",
    screens: 4,
    location: "Forum Value Mall, Whitefield",
    phone: "+91-80-9876-5432",
    hours: "9:30 AM - 12:00 AM",
    featured: true,
    rating: 4.6,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%23fbbf24' font-size='48' font-weight='bold' font-family='Arial'%3EINOX%3C/text%3E%3C/svg%3E",
    showtimes: ["9:30 AM", "12:45 PM", "3:30 PM", "6:45 PM", "9:30 PM"],
  },
  {
    id: "3",
    name: "Multiplicity",
    city: "Delhi",
    screens: 6,
    location: "DLF PromeNade, Vasant Kunj",
    phone: "+91-11-5555-5555",
    hours: "10:00 AM - 11:30 PM",
    featured: false,
    rating: 4.4,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%233b82f6' font-size='38' font-weight='bold' font-family='Arial'%3EMulti%3C/text%3E%3C/svg%3E",
    showtimes: ["10:00 AM", "1:15 PM", "4:00 PM", "7:00 PM", "10:15 PM"],
  },
  {
    id: "4",
    name: "Cinepolis",
    city: "Hyderabad",
    screens: 3,
    location: "Inorbit Mall, HITEC City",
    phone: "+91-40-6666-6666",
    hours: "10:00 AM - 10:30 PM",
    featured: false,
    rating: 4.5,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%2306b6d4' font-size='42' font-weight='bold' font-family='Arial'%3ECiné%3C/text%3E%3C/svg%3E",
    showtimes: ["10:15 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:00 PM"],
  },
  {
    id: "5",
    name: "BookMyShow Premium",
    city: "Pune",
    screens: 4,
    location: "Seasons Mall, Aundh",
    phone: "+91-20-7777-7777",
    hours: "10:00 AM - 11:00 PM",
    featured: true,
    rating: 4.7,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%238b5cf6' font-size='36' font-weight='bold' font-family='Arial'%3EBMS%3C/text%3E%3C/svg%3E",
    showtimes: ["10:00 AM", "1:00 PM", "4:30 PM", "7:15 PM", "10:00 PM"],
  },
  {
    id: "6",
    name: "Galaxy Cinemas",
    city: "Kolkata",
    screens: 3,
    location: "South City Mall, Alipore",
    phone: "+91-33-8888-8888",
    hours: "10:30 AM - 10:00 PM",
    featured: false,
    rating: 4.3,
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231f2937' width='100' height='100'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='%23ec4899' font-size='42' font-weight='bold' font-family='Arial'%3EGXY%3C/text%3E%3C/svg%3E",
    showtimes: ["10:30 AM", "1:45 PM", "5:00 PM", "8:00 PM", "10:30 PM"],
  },
];

export default function TheatresSection({ 
  onTheatreSelect 
}: { 
  onTheatreSelect?: (theatreId: string, theatreName: string) => void 
}) {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const cities = ["All", ...new Set(THEATRES.map((t) => t.city))];
  
  const filteredTheatres = selectedCity === "All" 
    ? THEATRES 
    : THEATRES.filter((t) => t.city === selectedCity);

  const handleViewMovies = (theatre: Theatre) => {
    onTheatreSelect?.(theatre.id, theatre.name);
  };

  return (
    <section id="theaters" className="py-16 px-4 bg-slate-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Find Theatres Near You
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore our network of premium cinemas across major cities
          </p>
        </div>

        {/* City Filter - Dropdown */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-xs">
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Select City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white hover:border-red-600 focus:border-red-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="text-gray-200 hover:bg-slate-700 cursor-pointer">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Theatres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheatres.map((theatre) => (
            <Card 
              key={theatre.id} 
              className={`overflow-hidden hover:shadow-2xl hover:shadow-red-600/30 transition-all bg-slate-800 border-slate-700 group cursor-pointer ${
                theatre.featured ? "ring-2 ring-red-600" : ""
              }`}
            >
              {/* Theater Logo Section */}
              <div className="relative h-32 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={theatre.logo} 
                  alt={theatre.name}
                  className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234b5563' width='100' height='100'/%3E%3C/svg%3E";
                  }}
                />
                {theatre.featured && (
                  <Badge className="absolute top-2 right-2 bg-red-600 text-white">Featured</Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <MapIcon className="h-5 w-5 text-red-500" />
                      {theatre.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {theatre.city}
                    </CardDescription>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(theatre.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < theatre.rating
                          ? "fill-yellow-400 text-yellow-400 opacity-50"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-300 ml-1">({theatre.rating})</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Theater Details */}
                <div className="space-y-1.5 text-sm text-gray-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                    <span className="text-xs">{theatre.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-xs">{theatre.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-xs">{theatre.hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-red-500 text-base">📽️</span>
                    <span className="text-xs">{theatre.screens} Screens</span>
                  </p>
                </div>

                {/* Show Timings */}
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                    <Film className="h-4 w-4 text-red-500" />
                    Show Timings
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {theatre.showtimes.slice(0, 4).map((time, idx) => (
                      <Badge key={idx} variant="outline" className="bg-slate-700 border-red-600/50 text-gray-200 text-xs py-0.5">
                        {time}
                      </Badge>
                    ))}
                    {theatre.showtimes.length > 4 && (
                      <Badge variant="outline" className="bg-slate-700 border-red-600/50 text-gray-400 text-xs py-0.5">
                        +{theatre.showtimes.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => handleViewMovies(theatre)}
                >
                  <Film className="h-4 w-4" />
                  View Movies
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTheatres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No theatres found in {selectedCity}. Please try another city.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
