import React, { useState, useEffect } from "react";
import { eventsService } from "@/services/eventsService";
import type { EventDto } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Import only the core registration management components
import RegistrationList from "@/components/organization/event-registration-management/RegistrationList";
import RegistrationFilters from "@/components/organization/event-registration-management/RegistrationFilters";
import type { RegistrationFilters as RegistrationFiltersType } from "@/types/eventRegistration";

// Simple event summary interface for internal use
interface EventSummary {
  eventId: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  statusName?: string;
}

interface EventSelectorProps {
  onEventSelect: (event: EventSummary | null) => void;
  selectedEvent: EventSummary | null;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  onEventSelect,
  selectedEvent,
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      // Only load events if user is authenticated and has organizationId
      if (!user?.organizationId) {
        setEventsError("Organization ID not found");
        return;
      }

      setEventsLoading(true);
      setEventsError(null);
      try {
        const filters = {
          page: 1,
          size: 100,
          sortBy: "startDate",
          sortDirection: "desc" as const,
          organizationId: user.organizationId, // Filter by organization's own events only
        };
        const result = await eventsService.getEvents(filters);
        setEvents(result.items);
      } catch (err) {
        setEventsError(
          err instanceof Error ? err.message : "Failed to load events"
        );
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [user?.organizationId]);

  const handleEventChange = (eventId: string) => {
    if (eventId === "none") {
      onEventSelect(null);
    } else {
      const event = events.find(
        (e: EventDto) => e.eventId.toString() === eventId
      );
      if (event) {
        const eventSummary: EventSummary = {
          eventId: event.eventId,
          eventName: event.eventName,
          description: event.description || "",
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location || "",
          statusName: event.statusName || "",
        };
        onEventSelect(eventSummary);
      } else {
        onEventSelect(null);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50 border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-100/80 via-emerald-100/80 to-teal-100/80 dark:from-green-900/50 dark:via-emerald-900/50 dark:to-teal-900/50 border-b border-green-200/50 dark:border-green-800/50">
        <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          Select Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        {eventsError ? (
          <div className="text-center py-4 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-red-950/50 dark:via-rose-950/50 dark:to-pink-950/50 rounded-lg border border-red-200/50 dark:border-red-800/50">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{eventsError}</p>
          </div>
        ) : (
          <>
            <Select
              value={selectedEvent?.eventId.toString() || "none"}
              onValueChange={handleEventChange}
              disabled={eventsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    eventsLoading
                      ? "Loading your events..."
                      : events.length === 0
                      ? "No events found for your organization"
                      : "Choose an event to manage registrations"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {events.length === 0
                    ? "No events available"
                    : "Select an event..."}
                </SelectItem>
                {events?.map((event: EventDto) => (
                  <SelectItem
                    key={event.eventId}
                    value={event.eventId.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <span>{event.eventName}</span>
                      <Badge variant="outline">{event.statusName}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {selectedEvent && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/50 dark:via-amber-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50 shadow-sm">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">{selectedEvent.eventName}</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {selectedEvent.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-yellow-800 dark:text-yellow-200">
                <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                {new Date(selectedEvent.startDate).toLocaleDateString()}
              </span>
              <Badge variant="outline" className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300">{selectedEvent.statusName}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Event Registration Management Page
const EventRegistrationManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);
  const [filters, setFilters] = useState<RegistrationFiltersType>({
    page: 1,
    size: 10,
  });

  // Handle filter changes
  const handleFiltersChange = (
    newFilters: Partial<RegistrationFiltersType>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters when event changes
  useEffect(() => {
    if (selectedEvent) {
      setFilters({
        page: 1,
        size: 10,
      });
    }
  }, [selectedEvent]);

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/80 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-purple-900/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
            Event Registration Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage volunteer registrations for your events
          </p>
        </div>
      </div>

      <EventSelector
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
      />

      {selectedEvent ? (
        <div className="space-y-4">
          <RegistrationFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <RegistrationList
            eventId={selectedEvent.eventId}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950/50 dark:via-slate-950/50 dark:to-zinc-950/50 border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Please select an event to view and manage registrations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRegistrationManagement;
