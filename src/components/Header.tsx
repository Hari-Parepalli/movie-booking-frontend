import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Menu, User, LogOut, Menu as MenuIcon, Search, MapPin, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import LoginDialog from "./LoginDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onOffersClick?: () => void;
  onEventsClick?: () => void;
}

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

const Header = ({ onSearch, onOffersClick, onEventsClick }: HeaderProps) => {
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { selectedCity, setSelectedCity } = useLocation();

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur-md border-b-2 border-red-600/50 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-red-500 drop-shadow-sm" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ReelRide
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <a href="#movies" className="text-gray-100 hover:text-red-400 transition-colors text-sm font-medium border-b-2 border-transparent hover:border-red-400 pb-1">
                Movies
              </a>
              <a href="#theaters" className="text-gray-100 hover:text-red-400 transition-colors text-sm font-medium border-b-2 border-transparent hover:border-red-400 pb-1">
                Theaters
              </a>
              <button 
                onClick={onOffersClick}
                className="text-gray-100 hover:text-red-400 transition-colors text-sm font-medium border-b-2 border-transparent hover:border-red-400 pb-1 cursor-pointer"
              >
                Offers
              </button>
              <button 
                onClick={onEventsClick}
                className="text-gray-100 hover:text-red-400 transition-colors text-sm font-medium border-b-2 border-transparent hover:border-red-400 pb-1 cursor-pointer"
              >
                Events
              </button>
            </nav>

            {/* Location Selector & Search */}
            <div className="hidden lg:flex items-center gap-6 mr-8">
              {/* City Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-100 hover:text-red-400 hover:bg-white/10 font-medium gap-2"
                  >
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{selectedCity}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-red-600/50">
                  <DropdownMenuLabel className="text-gray-300 text-xs font-bold">SELECT CITY</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-red-600/30" />
                  {popularCities.map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className={`cursor-pointer transition-colors ${
                        selectedCity === city
                          ? "bg-red-600 text-white font-semibold"
                          : "text-gray-200 hover:bg-white/10 hover:text-red-400"
                      }`}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search movies..."
                  className="pl-9 h-9 w-48 bg-white/10 text-gray-100 placeholder:text-gray-400 border-white/20 focus:border-red-500 text-sm"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-8">
              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-100 hover:text-red-400 hidden sm:flex"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative text-gray-100 hover:text-red-400"
                      >
                        <User className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-slate-900 border-red-600/50"
                  >
                    <DropdownMenuLabel className="flex flex-col py-2">
                      <span className="font-semibold text-gray-100">{user.name}</span>
                      <span className="text-xs text-gray-400">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-red-600/30" />
                    <DropdownMenuItem 
                      onClick={() => navigate("/my-bookings")}
                      className="text-gray-200 hover:text-red-400 cursor-pointer hover:bg-white/10"
                    >
                      <span className="text-sm">My Bookings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-200 hover:text-red-400 cursor-pointer hover:bg-white/10">
                      <span className="text-sm">Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-red-600/30" />
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="text-red-400 hover:text-red-300 hover:bg-white/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </>
              ) : (
                <Button
                  className="hidden md:flex bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Sign In
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-gray-100 hover:text-red-400"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-red-600/30 space-y-3">
              {/* Mobile City Selector */}
              <div className="space-y-2">
                <p className="text-gray-400 text-xs font-bold">📍 SELECT CITY</p>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        handleCityChange(city);
                        setShowMobileMenu(false);
                      }}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        selectedCity === city
                          ? "bg-red-600 text-white font-semibold"
                          : "bg-white/10 text-gray-200 hover:bg-white/20"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search movies..."
                  className="pl-9 w-full bg-white/10 text-gray-100 placeholder:text-gray-400 border-white/20 focus:border-red-500 text-sm"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 pt-2 border-t border-red-600/30">
                <a 
                  href="#movies"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 text-gray-200 hover:text-red-400 hover:bg-white/10 rounded transition-colors text-sm"
                >
                  Movies
                </a>
                <a 
                  href="#theaters"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 text-gray-200 hover:text-red-400 hover:bg-white/10 rounded transition-colors text-sm"
                >
                  Theaters
                </a>
                <button 
                  onClick={() => {
                    onOffersClick?.();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-200 hover:text-red-400 hover:bg-white/10 rounded transition-colors text-sm"
                >
                  Offers
                </button>
                <button 
                  onClick={() => {
                    onEventsClick?.();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-200 hover:text-red-400 hover:bg-white/10 rounded transition-colors text-sm"
                >
                  Events
                </button>
              </div>

              {/* Mobile Auth Button */}
              {!isAuthenticated && (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={() => {
                    setLoginDialogOpen(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
};

export default Header;