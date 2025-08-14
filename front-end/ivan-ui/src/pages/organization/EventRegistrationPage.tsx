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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        {eventsError ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm">{eventsError}</p>
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
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{selectedEvent.eventName}</h4>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(selectedEvent.startDate).toLocaleDateString()}
              </span>
              <Badge variant="outline">{selectedEvent.statusName}</Badge>
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Event Registration Management
          </h1>
          <p className="text-muted-foreground">
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
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Please select an event to view and manage registrations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRegistrationManagement;
