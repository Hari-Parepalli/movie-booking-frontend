import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Gift, Zap, Clock, Copy, Check, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  offer_type: "percentage" | "cashback" | "combo" | "special";
  code?: string;
  validity: string;
  expiryStatus: "today" | "this-week" | "this-month" | "normal"; // For urgency display
  terms: string;
  bank?: string; // Bank name (HDFC, SBI, etc.)
  bankLogo?: string; // SVG or URL to bank logo
}

const OFFERS: Offer[] = [
  {
    id: "1",
    title: "Weekend Bonanza",
    description: "Get 50% off on movie tickets every weekend",
    discount: "50% OFF",
    offer_type: "percentage",
    code: "WEEKEND50",
    validity: "Valid till 31st Dec 2024",
    expiryStatus: "this-month",
    terms: "Applicable on Friday to Sunday bookings only",
    bank: "HDFC Bank",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%23d4164b' font-size='24' font-weight='bold' font-family='Arial'%3EHDFC%3C/text%3E%3C/svg%3E",
  },
  {
    id: "2",
    title: "First Booking Offer",
    description: "Get ₹150 cashback on your first booking",
    discount: "₹150 CASHBACK",
    offer_type: "cashback",
    code: "FIRST150",
    validity: "Valid till 20th April 2024",
    expiryStatus: "today",
    terms: "Minimum booking value: ₹300",
    bank: "SBI",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%230066cc' font-size='22' font-weight='bold' font-family='Arial'%3ESBI%3C/text%3E%3C/svg%3E",
  },
  {
    id: "3",
    title: "Family Combo",
    description: "Book 4 tickets and get 1 free snacks voucher",
    discount: "1 FREE SNACK",
    offer_type: "combo",
    code: "FAMILY4",
    validity: "Valid till 15th May 2024",
    expiryStatus: "this-month",
    terms: "Valid for all shows everyday",
    bank: "Axis Bank",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%23da291c' font-size='22' font-weight='bold' font-family='Arial'%3EAXIS%3C/text%3E%3C/svg%3E",
  },
  {
    id: "4",
    title: "Flash Sale",
    description: "Limited time: Get 30% off on morning shows",
    discount: "30% OFF",
    offer_type: "percentage",
    code: "MORNING30",
    validity: "Valid till 20th April 2024",
    expiryStatus: "this-week",
    terms: "Applicable on shows before 12:00 PM",
    bank: "ICICI Bank",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%23003087' font-size='22' font-weight='bold' font-family='Arial'%3EICICI%3C/text%3E%3C/svg%3E",
  },
  {
    id: "5",
    title: "Student Discount",
    description: "Show your student ID and get 25% off",
    discount: "25% OFF",
    offer_type: "special",
    code: "STUDENT25",
    validity: "Valid throughout the year",
    expiryStatus: "normal",
    terms: "Valid student ID required at counter",
    bank: "IDBI Bank",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%23001a4d' font-size='22' font-weight='bold' font-family='Arial'%3EIDBI%3C/text%3E%3C/svg%3E",
  },
  {
    id: "6",
    title: "Birthday Special",
    description: "Celebrate your birthday with 40% discount",
    discount: "40% OFF",
    offer_type: "special",
    code: "BDAY40",
    validity: "7 days before and after birthday",
    expiryStatus: "normal",
    terms: "ID proof required. Valid on birthday month",
    bank: "Yes Bank",
    bankLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3Crect fill='%23ffffff' width='120' height='60'/%3E%3Ctext x='60' y='38' text-anchor='middle' fill='%23ff0000' font-size='24' font-weight='bold' font-family='Arial'%3EYES%3C/text%3E%3C/svg%3E",
  },
];

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-6 w-6" />;
      case "cashback":
        return <Gift className="h-6 w-6" />;
      case "combo":
        return <Zap className="h-6 w-6" />;
      default:
        return <Percent className="h-6 w-6" />;
    }
  };

  const getOfferColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "from-blue-500 to-blue-600";
      case "cashback":
        return "from-green-500 to-green-600";
      case "combo":
        return "from-purple-500 to-purple-600";
      case "special":
        return "from-orange-500 to-orange-600";
      default:
        return "from-primary to-accent";
    }
  };

  const getExpiryUrgency = (status: string) => {
    switch (status) {
      case "today":
        return { label: "⏳ Ends Today", color: "bg-red-600/20 text-red-300 border-red-600/50" };
      case "this-week":
        return { label: "⏰ Ends This Week", color: "bg-orange-600/20 text-orange-300 border-orange-600/50" };
      case "this-month":
        return { label: "📅 Ends This Month", color: "bg-yellow-600/20 text-yellow-300 border-yellow-600/50" };
      default:
        return { label: "✅ Valid Year-Round", color: "bg-green-600/20 text-green-300 border-green-600/50" };
    }
  };

  const handleCopyCode = (code: string, offerId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(offerId);
    toast({
      title: "Code Copied!",
      description: `"${code}" copied to clipboard`,
      duration: 2000,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="offers" className="py-16 px-4 bg-slate-950">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Exclusive Offers & Deals
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Save big on your movie tickets with our amazing offers and promotions
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <Card 
              key={offer.id}
              className="hover:shadow-2xl hover:shadow-red-600/40 transition-all duration-300 overflow-hidden bg-slate-800 border-slate-700 group cursor-pointer relative"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)",
              }}
            >
              {/* Animated Glow Background on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at center, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
                }}
              />

              {/* Offer Header with Icon */}
              <div className={`bg-gradient-to-r ${getOfferColor(offer.offer_type)} p-4 text-white relative z-10 group-hover:shadow-lg group-hover:shadow-current/50 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getOfferIcon(offer.offer_type)}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getExpiryUrgency(offer.expiryStatus).color} border`}
                  >
                    {getExpiryUrgency(offer.expiryStatus).label}
                  </Badge>
                </div>
                <p className="text-2xl font-bold group-hover:translate-y-0.5 transition-transform duration-300">{offer.discount}</p>
              </div>

              {/* Bank Logo Section */}
              {offer.bank && (
                <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border-b border-slate-600 relative z-10">
                  <div className="flex items-center gap-2">
                    {offer.bankLogo && (
                      <img 
                        src={offer.bankLogo} 
                        alt={offer.bank}
                        className="h-8 w-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span className="text-xs font-semibold text-gray-300">{offer.bank}</span>
                  </div>
                  <Badge variant="outline" className="bg-slate-800 border-slate-600 text-gray-300 text-xs">
                    Bank Offer
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg text-white group-hover:text-red-300 transition-colors duration-300">{offer.title}</CardTitle>
                <CardDescription className="text-gray-400">{offer.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                {offer.code && (
                  <div className="bg-slate-700/60 p-3 rounded-lg border border-slate-600 group-hover:border-red-600/50 transition-colors duration-300">
                    <p className="text-xs text-gray-400 mb-1">Promo Code</p>
                    <p className="text-lg font-mono font-bold text-red-400 tracking-widest">{offer.code}</p>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
                    {offer.validity}
                  </p>
                  <p className="italic text-gray-400 text-xs">{offer.terms}</p>
                </div>

                {/* Split Button CTA */}
                <div className="flex gap-2">
                  {offer.code ? (
                    <Button 
                      className="flex-1 bg-slate-700 hover:bg-red-600 text-white font-semibold transition-all duration-300 gap-2 border border-slate-600 hover:border-red-600 group/btn"
                      onClick={() => handleCopyCode(offer.code!, offer.id)}
                    >
                      {copiedCode === offer.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  ) : null}
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 gap-2 shadow-lg hover:shadow-xl hover:scale-105 group/btn"
                  >
                    <Send className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-600/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2 text-white">Get More Discounts</h3>
          <p className="text-gray-300 mb-4">
            Subscribe to our newsletter and get exclusive early access to new offers
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-red-600 bg-slate-800 text-white placeholder:text-gray-500"
            />
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
