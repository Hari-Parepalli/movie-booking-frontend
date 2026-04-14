import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiService, Booking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, Download, Home, Calendar, MapPin, 
  Ticket, AlertCircle, Loader2, Mail 
} from "lucide-react";

export default function BookingSuccess() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      navigate("/");
      return;
    }

    if (!bookingId) {
      navigate("/my-bookings");
      return;
    }

    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getBookingById(bookingId, token);
        setBooking(data);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Failed to fetch booking details";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [isAuthenticated, user, token, bookingId, navigate]);

  const handleSendEmail = async () => {
    if (!booking || !user || !token) return;

    try {
      setSendingEmail(true);
      // Call backend to send email
      await apiService.sendBookingConfirmationEmail(booking.id, user.email, token);
      setEmailSent(true);
      setTimeout(() => setSendingEmail(false), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send email");
      setSendingEmail(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!booking) return;

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
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Please sign in to view booking details.</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-red-600 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Error Loading Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">{error || "Booking not found"}</p>
            <Button 
              onClick={() => navigate("/my-bookings")} 
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-red-600/50 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Booking Confirmation</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/50 rounded-lg p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-300">Your movie tickets have been successfully booked.</p>
          </div>
        </div>

        {/* Ticket Card */}
        <Card className="bg-slate-800 border-slate-700 mb-6 overflow-hidden">
          {/* Movie Poster */}
          {booking.poster_url && (
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img 
                src={booking.poster_url}
                alt={booking.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl text-white mb-2">{booking.title}</CardTitle>
                <Badge className="bg-green-600 text-white">
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
              <Ticket className="h-8 w-8 text-red-500 flex-shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Booking ID</p>
                <p className="text-white font-mono font-bold text-sm break-all">{booking.id}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Number of Seats</p>
                <p className="text-white font-bold text-lg">{booking.seats}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Show Date
                </p>
                <p className="text-white font-bold">
                  {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Booking Date</p>
                <p className="text-white font-bold">
                  {new Date(booking.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-600/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Amount Paid</p>
              <p className="text-3xl font-bold text-red-400">₹{booking.total_price || 0}</p>
            </div>

            {/* Email Status */}
            {emailSent && (
              <Alert className="bg-green-900/20 border-green-600/50">
                <Mail className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-300">
                  ✅ Confirmation email sent successfully to {user?.email}
                </AlertDescription>
              </Alert>
            )}

            {/* Person Details */}
            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
              <p className="text-gray-400 text-sm">Booked by</p>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>

            {/* Important Notice */}
            <Alert className="bg-blue-900/20 border-blue-600/50">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-300">
                Please arrive 15 minutes before the show time. Carry this e-ticket or show your booking ID at the entrance.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadTicket}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
            >
              <Download className="h-5 w-5" />
              Download Ticket
            </Button>

            <Button
              onClick={handleSendEmail}
              disabled={sendingEmail || emailSent}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : emailSent ? (
                <>
                  <Mail className="h-5 w-5" />
                  Email Sent
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Send Email
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={() => navigate("/my-bookings")}
            variant="outline"
            className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            View All Bookings
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
