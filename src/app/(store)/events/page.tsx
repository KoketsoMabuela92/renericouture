"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { Calendar, MapPin, Clock, Image as ImageIcon } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-3">Events</h1>
        <p className="text-neutral-600">Join us for exclusive events, pop-ups, and experiences.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 border border-neutral-200 rounded-xl">
          <Calendar className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
          <h2 className="text-lg font-medium text-neutral-900 mb-2">No upcoming events</h2>
          <p className="text-sm text-neutral-500">Check back soon for new events.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-xl overflow-hidden ${
                isPast(event.date) ? "opacity-60" : ""
              }`}
            >
              {event.imageUrl ? (
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-neutral-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-neutral-300" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">{event.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  {isPast(event.date) && (
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Past event
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
