import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, MapPin, Users, Leaf
} from "lucide-react";
import { Link } from "react-router-dom";

// Dummy Data
const initialEvents = [
  {
    title: "Community Clean-Up Drive",
    date: "2025-09-23T08:00", // ISO format for datetime-local
    location: "Central Park, Sector 5",
    organizer: "Municipal Corporation",
    participants: 45,
    type: "Cleanup",
    joined: false, // track if current user joined
  },
  {
    title: "Composting Workshop",
    date: "2025-10-15T14:00",
    location: "Community Center, Block A",
    organizer: "Green Initiative Group",
    participants: 23,
    type: "Workshop",
    joined: false,
  },
];

const recentActivities = [
  { type: "Clean-up Drive", description: "Joined the community clean-up", points: 20, time: "2h ago" },
  { type: "Workshop", description: "Attended composting workshop", points: 15, time: "1d ago" },
];

export default function Activities() {
  const [events, setEvents] = useState(initialEvents);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    organizer: "",
    type: "",
    participants: 0,
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    setEvents([...events, { ...newEvent, joined: false }]);
    setNewEvent({ title: "", date: "", location: "", organizer: "", type: "", participants: 0 });
  };

  // Join event only once
  const handleJoin = (index: number) => {
    setEvents((prev) =>
      prev.map((event, i) =>
        i === index && !event.joined
          ? { ...event, participants: event.participants + 1, joined: true }
          : event
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Join and participate in eco-friendly activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="secondary">{event.type}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" /> {new Date(event.date).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" /> {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="mr-1 h-4 w-4" /> {event.participants} participants
                    </span>
                    <Button
                      size="sm"
                      variant={event.joined ? "secondary" : "outline"}
                      onClick={() => handleJoin(index)}
                      disabled={event.joined}
                    >
                      {event.joined ? "Joined" : "Join"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Event */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule an Event</CardTitle>
            <CardDescription>Create your own eco-activity</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded text-black placeholder:text-gray-400"
              />

              {/* Updated datetime input */}
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className={`w-full p-2 border rounded ${newEvent.date ? 'text-black' : 'text-gray-400'}`}
              />

              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full p-2 border rounded text-black placeholder:text-gray-400"
              />

              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="bg-success">+{activity.points} pts</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About Us */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            About Us
          </CardTitle>
          <CardDescription>Learn more about our mission</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We are committed to promoting sustainable waste management practices
            through community engagement and awareness campaigns.
          </p>
          <Button asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
