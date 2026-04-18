import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import { Loader2, X } from "lucide-react";
import PaymentDialog from "./PaymentDialog";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: {
    id: string;
    title: string;
    genre: string;
    rating?: number;
    posterUrl?: string;
  };
}

interface Seat {
  id: string;
  number: string;
  row: string;
  booked: boolean;
  selected: boolean;
  price: number;
}

const SEAT_PRICE = 250; // Price per seat in INR
const SEAT_ROWS = ["A", "B", "C", "D", "E"];
const SEATS_PER_ROW = 12;
const SHOW_TIMES = ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"];

export default function BookingDialog({ open, onOpenChange, movie }: BookingDialogProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"showtime" | "seats" | "confirm" | "payment">("showtime");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedShowTime, setSelectedShowTime] = useState("");
  const [seats, setSeats] = useState<Seat[]>(
    SEAT_ROWS.flatMap((row, rowIdx) =>
      Array.from({ length: SEATS_PER_ROW }, (_, i) => ({
        id: `${row}${i + 1}`,
        number: String(i + 1),
        row,
        booked: Math.random() > 0.7, // 30% of seats are booked
        selected: false,
        price: SEAT_PRICE,
      }))
    )
  );
  const [isBooking, setIsBooking] = useState(false);
  const { user, isAuthenticated, token } = useAuth();
  const { toast } = useToast();

  if (!isAuthenticated || !user || !token) {
    return null;
  }

  const selectedSeats = seats.filter((s) => s.selected);
  const totalPrice = selectedSeats.length * SEAT_PRICE;
  const CONVENIENCE_FEE = 99;
  const GST = Math.round((totalPrice + CONVENIENCE_FEE) * 0.18);
  const TOTAL_AMOUNT = totalPrice + CONVENIENCE_FEE + GST;

  const toggleSeat = (seatId: string) => {
    if (step !== "seats") return;
    setSeats(
      seats.map((s) =>
        s.id === seatId && !s.booked ? { ...s, selected: !s.selected } : s
      )
    );
  };

  const handlePaymentSuccess = async (transactionId: string, paymentMethod: string) => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsBooking(true);
      const seatNames = selectedSeats.map((s) => s.id).join(",");
      const response = await apiService.createBooking(
        user.id,
        movie.id,
        selectedSeats.length,
        seatNames,
        new Date().toISOString().split('T')[0],
        TOTAL_AMOUNT,
        token
      );

      // Check if booking was successful (backend returns bookingId on success)
      if (response && (response.bookingId || response.success)) {
        const bookingId = response.bookingId || response.booking?.id;
        
        toast({
          title: "✅ Booking Confirmed!",
          description: `Your tickets for ${movie.title} have been booked.`,
        });
        
        setTimeout(() => {
          onOpenChange(false);
          setPaymentDialogOpen(false);
          // Reset form
          setStep("showtime");
          setSelectedShowTime("");
          // Navigate to booking success page with booking ID
          navigate(`/booking-success?bookingId=${bookingId}`);
        }, 500);
      } else if (response?.error) {
        toast({
          title: "❌ Booking Failed",
          description: response.error || "Unable to complete booking",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Booking Failed",
          description: response?.message || "Unable to complete booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error.message || 
                          "Failed to complete booking";
      toast({
        title: "❌ Booking Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirmBooking = () => {
    // Open payment dialog - seats were already validated before reaching confirm step
    setPaymentDialogOpen(true);
  };

  const handleClose = () => {
    setStep("showtime");
    setSelectedShowTime("");
    onOpenChange(false);
  };

  const handleNextStep = () => {
    if (step === "showtime") {
      if (!selectedShowTime) {
        toast({
          title: "Select a showtime",
          description: "Please choose a show time to continue",
          variant: "destructive",
        });
        return;
      }
      setStep("seats");
    } else if (step === "seats") {
      if (selectedSeats.length === 0) {
        toast({
          title: "Select seats",
          description: "Please select at least one seat",
          variant: "destructive",
        });
        return;
      }
      setStep("confirm");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Book Tickets - {movie.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex gap-2 pt-2">
              <Badge variant="secondary">{movie.genre}</Badge>
              {movie.rating && (
                <Badge variant="outline">⭐ {movie.rating.toFixed(1)}/10</Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Show Time Selection */}
          {step === "showtime" && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Select a Show Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SHOW_TIMES.map((time) => (
                    <Button
                      key={time}
                      variant={selectedShowTime === time ? "default" : "outline"}
                      className="h-20 sm:h-16 text-xs sm:text-sm"
                      onClick={() => setSelectedShowTime(time)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold">{time}</span>
                        <span className="text-xs text-muted-foreground">Available</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full h-12" size="lg">
                Next: Select Seats
              </Button>
            </>
          )}

          {/* Step 2: Seat Selection */}
          {step === "seats" && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Your Seats</h3>
                <div className="bg-gradient-to-b from-muted to-muted/50 p-4 rounded-lg mb-6">
                  <div className="text-center text-sm text-muted-foreground mb-4 font-semibold">
                    SCREEN
                  </div>
                  <div className="space-y-3">
                    {SEAT_ROWS.map((row) => (
                      <div key={row} className="flex justify-center gap-2 items-center">
                        <span className="w-6 text-center text-sm font-semibold">{row}</span>
                        <div className="flex gap-1 flex-wrap justify-center max-w-md">
                          {seats
                            .filter((s) => s.row === row)
                            .map((seat) => (
                              <button
                                key={seat.id}
                                onClick={() => toggleSeat(seat.id)}
                                disabled={seat.booked}
                                className={`w-10 h-10 sm:w-8 sm:h-8 rounded text-xs font-semibold transition-all ${
                                  seat.booked
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : seat.selected
                                    ? "bg-primary text-primary-foreground scale-110"
                                    : "bg-secondary text-secondary-foreground hover:bg-primary/50"
                                }`}
                              >
                                {seat.number}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Selected Seats:{" "}
                  {selectedSeats.length > 0 ? (
                    <span className="text-primary font-semibold">
                      {selectedSeats.map((s) => s.id).join(", ")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setStep("showtime")}
                  className="flex-1 h-11"
                >
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1 h-11" size="lg">
                  Next: Confirm Booking
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirm" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Movie</span>
                    <span className="font-semibold">{movie.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Show Time</span>
                    <span className="font-semibold">{selectedShowTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-semibold">
                      {selectedSeats.map((s) => s.id).join(", ")}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount ({selectedSeats.length} seats × ₹{SEAT_PRICE})</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Convenience Fee</span>
                      <span>₹{CONVENIENCE_FEE}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%)</span>
                      <span>₹{GST}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg text-primary">₹{TOTAL_AMOUNT}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("seats")}
                  className="flex-1"
                  disabled={isBooking}
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Booking - ₹{TOTAL_AMOUNT}</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    <PaymentDialog
      open={paymentDialogOpen}
      onOpenChange={setPaymentDialogOpen}
      totalAmount={TOTAL_AMOUNT}
      onPaymentSuccess={handlePaymentSuccess}
      bookingDetails={{
        movieTitle: movie.title,
        seats: selectedSeats.map((s) => s.id).join(", "),
        showTime: selectedShowTime,
      }}
    />
    </>
  );
}
