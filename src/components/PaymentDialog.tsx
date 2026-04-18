import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onPaymentSuccess: (transactionId: string, paymentMethod: string) => void;
  bookingDetails?: {
    movieTitle?: string;
    seats?: string;
    showTime?: string;
  };
}

type PaymentMethod = "upi" | "card" | null;

export default function PaymentDialog({
  open,
  onOpenChange,
  totalAmount,
  onPaymentSuccess,
  bookingDetails,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // UPI form
  const [upiId, setUpiId] = useState("");

  // Card form
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiiry: "",
    cvv: "",
  });

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      setError("Please enter a valid UPI ID");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success (90% success rate for demo)
      if (Math.random() > 0.1) {
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSuccess(true);

        setTimeout(() => {
          onPaymentSuccess(transactionId, "UPI");
          setIsProcessing(false);
          setUpiId("");
          setPaymentMethod(null);
          setSuccess(false);
          onOpenChange(false);
        }, 1500);
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment processing failed");
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (
      !cardDetails.cardNumber ||
      !cardDetails.cardholderName ||
      !cardDetails.expiiry ||
      !cardDetails.cvv
    ) {
      setError("Please fill in all card details");
      return;
    }

    // Validate card number (basic check)
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Card number should be 16 digits");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success
      if (Math.random() > 0.1) {
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSuccess(true);

        setTimeout(() => {
          onPaymentSuccess(transactionId, "Card");
          setIsProcessing(false);
          setCardDetails({ cardNumber: "", cardholderName: "", expiiry: "", cvv: "" });
          setPaymentMethod(null);
          setSuccess(false);
          onOpenChange(false);
        }, 1500);
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment processing failed");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">💳 Complete Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            Secure payment powered by ReelRide
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          {bookingDetails && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 space-y-2">
                {bookingDetails.movieTitle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">🎬 Movie</span>
                    <span className="font-semibold text-gray-100">{bookingDetails.movieTitle}</span>
                  </div>
                )}
                {bookingDetails.showTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">🕐 Time</span>
                    <span className="font-semibold text-gray-100">{bookingDetails.showTime}</span>
                  </div>
                )}
                {bookingDetails.seats && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">🪑 Seats</span>
                    <span className="font-semibold text-gray-100">{bookingDetails.seats}</span>
                  </div>
                )}
                <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-semibold text-lg">
                  <span className="text-gray-300">Total</span>
                  <span className="text-red-400">₹{totalAmount}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Selection */}
          {!paymentMethod ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">Choose Payment Method</p>

              {/* UPI Button */}
              <Button
                variant="outline"
                className="w-full h-20 border-slate-600 hover:border-red-600 hover:bg-red-600/10 flex flex-col items-start gap-2 p-4"
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-white">UPI Payment</span>
                </div>
                <span className="text-xs text-gray-400">Google Pay, PhonePe, Paytm</span>
              </Button>

              {/* Card Button */}
              <Button
                variant="outline"
                className="w-full h-20 border-slate-600 hover:border-red-600 hover:bg-red-600/10 flex flex-col items-start gap-2 p-4"
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-white">Debit / Credit Card</span>
                </div>
                <span className="text-xs text-gray-400">Visa, Mastercard, RuPay</span>
              </Button>

              <Alert className="bg-blue-600/20 border-blue-600/50 text-blue-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This is a demo. Use test card: 4532 1111 1111 1111
                </AlertDescription>
              </Alert>
            </div>
          ) : paymentMethod === "upi" ? (
            // UPI Payment Form
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="text-sm text-gray-400 hover:text-gray-300 p-0"
                onClick={() => {
                  setPaymentMethod(null);
                  setError(null);
                }}
              >
                ← Back
              </Button>

              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300 text-sm">UPI ID</Label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                    disabled={isProcessing}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-600/20 border-red-600/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-600/20 border-green-600/50">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300 text-xs">
                      Payment successful! ✓
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleUPIPayment}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Card Payment Form
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="text-sm text-gray-400 hover:text-gray-300 p-0"
                onClick={() => {
                  setPaymentMethod(null);
                  setError(null);
                }}
              >
                ← Back
              </Button>

              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300 text-sm">Cardholder Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardholderName: e.target.value })
                    }
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Card Number</Label>
                  <Input
                    placeholder="4532 1111 1111 1111"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, "");
                      if (/^\d*$/.test(value) && value.length <= 16) {
                        value = value.replace(/(\d{4})/g, "$1 ").trim();
                        setCardDetails({ ...cardDetails, cardNumber: value });
                      }
                    }}
                    maxLength={19}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-300 text-sm">Expiry Date</Label>
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }
                        setCardDetails({ ...cardDetails, expiiry: value });
                      }}
                      maxLength={5}
                      className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                      disabled={isProcessing}
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">CVV</Label>
                    <Input
                      placeholder="123"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 3) {
                          setCardDetails({ ...cardDetails, cvv: value });
                        }
                      }}
                      maxLength={3}
                      className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-600/20 border-red-600/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-600/20 border-green-600/50">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300 text-xs">
                      Payment successful! ✓
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleCardPayment}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
