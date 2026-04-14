import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService, Booking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Calendar, MapPin, Ticket, Download, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationLoading, setCancellationLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      navigate("/");
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getUserBookings(user.id, token);
        setBookings(data || []);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err.message || "Failed to fetch bookings";
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user, token, navigate, toast]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return;

    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellationLoading(bookingId);
      await apiService.cancelBooking(bookingId, token);
      
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));

      toast({
        title: "✅ Booking Cancelled",
        description: "Your booking has been cancelled successfully",
      });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to cancel booking";
      toast({
        title: "❌ Cancellation Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setCancellationLoading(null);
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Generate a simple text-based ticket
    const ticketText = `
╔════════════════════════════════════════╗
║         MOVIE TICKET - E-TICKET         ║
╚════════════════════════════════════════╝

📽️  MOVIE: ${booking.title}
🎟️  BOOKING ID: ${booking.id}
👤  NAME: ${user?.name}
📧  EMAIL: ${user?.email}

🪑  SEATS: ${booking.seats} Seat(s)
💳  AMOUNT PAID: ₹${booking.total_price || 0}
📅  BOOKING DATE: ${new Date(booking.created_at).toLocaleDateString()}
⏰  SHOW DATE: ${booking.booking_date}

✅  STATUS: ${booking.status.toUpperCase()}

Please arrive 15 minutes before the show time.
Thank you for booking with us!

═════════════════════════════════════════
Generated on: ${new Date().toLocaleString()}
    `.trim();

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(ticketText));
    element.setAttribute("download", `ticket-${booking.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "✅ Ticket Downloaded",
      description: "Your e-ticket has been downloaded",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">Please sign in to view your bookings.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-red-600/50 p-4 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-300 text-sm">View and manage your movie bookings</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="border-red-600 text-red-400 hover:bg-red-600/10"
          >
            ← Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading your bookings...</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mb-8 bg-red-900/20 border-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {bookings.length === 0 && !isLoading && !error && (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto text-center">
            <CardHeader>
              <Ticket className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <CardTitle className="text-white">No Bookings Yet</CardTitle>
              <CardDescription className="text-gray-400">
                You haven't booked any movie tickets yet. Start exploring now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card 
              key={booking.id}
              className={`overflow-hidden transition-all ${
                booking.status === "cancelled"
                  ? "bg-slate-800/50 border-slate-700/50 opacity-75"
                  : "bg-slate-800 border-slate-700 hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/20"
              }`}
            >
              {/* Poster */}
              {booking.poster_url && (
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img 
                    src={booking.poster_url}
                    alt={booking.title}
                    className={`w-full h-full object-cover transition-opacity ${
                      booking.status === "cancelled" ? "opacity-50" : ""
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {booking.status === "cancelled" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <X className="h-12 w-12 text-red-500" />
                    </div>
                  )}
                </div>
              )}

              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {booking.title}
                    </CardTitle>
                    <Badge 
                      className={`flex-shrink-0 ${
                        booking.status === "confirmed"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Ticket className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Booking ID: <span className="font-mono text-xs text-gray-400">{booking.id.slice(0, 8)}...</span></span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Ticket className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>{booking.seats} Seat(s)</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Show: {new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Booked: {new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="text-lg font-bold text-red-400">₹{booking.total_price || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                    onClick={() => handleDownloadTicket(booking)}
                    disabled={booking.status === "cancelled"}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>

                  {booking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-600/50 text-red-300 hover:bg-red-600/10 hover:text-red-400"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellationLoading === booking.id}
                    >
                      {cancellationLoading === booking.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
