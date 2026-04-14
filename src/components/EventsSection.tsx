import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Zap } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "premiere" | "concert" | "festival" | "workshop";
  attendees: number;
  image?: string;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Blockbuster Movie Night",
    description: "Join us for an exclusive premiere screening of the latest blockbuster with celebrity guests",
    date: "15 April 2024",
    location: "PVR Cinemas, Mumbai",
    type: "premiere",
    attendees: 500,
  },
  {
    id: "2",
    title: "Indie Film Festival",
    description: "Celebrate independent cinema with a curated selection of award-winning indie films",
    date: "20-22 April 2024",
    location: "INOX Multiplex, Bangalore",
    type: "festival",
    attendees: 800,
  },
  {
    id: "3",
    title: "Concert Experience",
    description: "Live music concert featuring top artists, combined with immersive cinema experience",
    date: "25 April 2024",
    location: "Multiplicity, Delhi",
    type: "concert",
    attendees: 1200,
  },
  {
    id: "4",
    title: "Filmmaker Workshop",
    description: "Learn filmmaking techniques from industry experts and renowned directors",
    date: "28 April 2024",
    location: "Cinepolis, Hyderabad",
    type: "workshop",
    attendees: 150,
  },
  {
    id: "5",
    title: "Horror Night Special",
    description: "Back-to-back horror movie marathon with thrilling surprises and special effects",
    date: "30 April 2024",
    location: "BookMyShow Premium, Pune",
    type: "festival",
    attendees: 350,
  },
  {
    id: "6",
    title: "Animation Showcase",
    description: "Discover the world of animation with screenings of latest animated films and shorts",
    date: "5 May 2024",
    location: "Galaxy Cinemas, Kolkata",
    type: "premiere",
    attendees: 400,
  },
];

export default function EventsSection() {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "premiere":
        return { badge: "bg-red-600 text-white", icon: "🎬" };
      case "concert":
        return { badge: "bg-purple-600 text-white", icon: "🎤" };
      case "festival":
        return { badge: "bg-blue-600 text-white", icon: "🎪" };
      case "workshop":
        return { badge: "bg-green-600 text-white", icon: "🎓" };
      default:
        return { badge: "bg-gray-600 text-white", icon: "📽️" };
    }
  };

  const getEventTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <section id="events" className="py-16 px-4 bg-slate-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Upcoming Events
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience cinema like never before with our special events and exclusive screenings
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event) => {
            const eventType = getEventTypeColor(event.type);
            return (
              <Card 
                key={event.id}
                className="hover:shadow-xl transition-all overflow-hidden group bg-slate-800 border-slate-700"
              >
                {/* Event Type Badge */}
                <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={eventType.badge}>
                      <span className="mr-1">{eventType.icon}</span>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-red-400 transition-colors text-white">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{event.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{event.attendees}+ Attending</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold">
                        <Zap className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                      <Button className="flex-1 border-gray-600 text-gray-300 hover:bg-slate-700">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Event Calendar CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-600/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
          <p className="text-gray-300 mb-6">
            Don't miss out on exciting events and exclusive premieres
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold">View Full Calendar</Button>
            <Button className="border-red-600 text-gray-300 hover:bg-slate-700">Get Notifications</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
