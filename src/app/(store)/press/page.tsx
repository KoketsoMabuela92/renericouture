"use client";

import { useEffect, useState } from "react";
import { Newspaper, Calendar, MapPin, Clock, Image as ImageIcon } from "lucide-react";
import { Event } from "@/lib/types";

export default function PressPage() {
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <Newspaper className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Press</h1>
        <p className="text-neutral-500 max-w-md mx-auto">Media coverage, press releases, and brand assets.</p>
      </div>

      {/* Events Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Events</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 border border-neutral-200 rounded-xl">
            <Calendar className="h-8 w-8 mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`border rounded-xl overflow-hidden ${isPast(event.date) ? "opacity-60" : ""}`}
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
                    <ImageIcon className="h-10 w-10 text-neutral-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    {isPast(event.date) && (
                      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                        Past event
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Press Coverage Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Press Coverage</h2>
        <div className="space-y-6">
          {[
            { date: "March 2025", title: "Renéri Couture Featured in Vogue South Africa", source: "Vogue SA", excerpt: "The emerging luxury brand making waves with their commitment to sustainable African fashion." },
            { date: "January 2025", title: "Top 10 African Fashion Brands to Watch", source: "Business Day", excerpt: "Renéri Couture named among the continent's most promising luxury fashion houses." },
            { date: "November 2024", title: "Sustainable Luxury: The Renéri Story", source: "ELLE Magazine", excerpt: "How one Johannesburg brand is proving that luxury and sustainability can coexist." },
          ].map((article) => (
            <div key={article.title} className="bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-colors">
              <p className="text-xs text-neutral-500 mb-2">{article.date} — {article.source}</p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">{article.title}</h3>
              <p className="text-sm text-neutral-600">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 rounded-2xl p-8 text-center">
        <p className="text-white font-semibold mb-2">Press Inquiries</p>
        <p className="text-neutral-400 text-sm mb-4">For media requests, interviews, and brand assets:</p>
        <p className="text-white font-medium">press@renericouture.com</p>
      </div>
    </div>
  );
}
