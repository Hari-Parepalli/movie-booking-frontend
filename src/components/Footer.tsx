import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t-2 border-red-600/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-red-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ReelRide
              </h3>
            </div>
            <p className="text-gray-300">
              Your ultimate destination for movie ticket booking. Experience cinema like never before.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Movies */}
          <div>
            <h4 className="font-semibold text-white mb-4">Movies</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-red-400 transition-colors">Now Showing</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Coming Soon</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">IMAX</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">3D Movies</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-red-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2024 ReelRide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;