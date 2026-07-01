"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const handleToggleActive = async (event: Event) => {
    await fetch(`/api/admin/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !event.active }),
    });
    fetchEvents();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Events</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your calendar events ({events.length} events)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}

      {/* Events Grid */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No events found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                        <Badge variant={event.active ? "success" : "secondary"}>
                          {event.active ? "Active" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(event)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                        title={event.active ? "Deactivate" : "Activate"}
                      >
                        {event.active ? (
                          <Eye className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-neutral-400" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-neutral-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Event Form Component
function EventForm({
  event,
  onClose,
  onSaved,
}: {
  event: Event | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    location: event?.location || "",
    imageUrl: event?.imageUrl || "",
    active: event?.active !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      imageUrl: form.imageUrl || undefined,
      active: form.active,
    };

    const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events";
    const method = event ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto py-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">
            {event ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Event Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Description *
            </label>
            <textarea
              className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 min-h-[100px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Date *
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Time *
              </label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Location *
            </label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Sandton City, Johannesburg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Image URL
            </label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded border-neutral-300"
              />
              Active (visible to customers)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
