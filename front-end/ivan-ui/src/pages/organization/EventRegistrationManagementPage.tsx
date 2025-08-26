import React, { useState, useEffect, useMemo } from "react";
import { eventsService } from "@/services/eventsService";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import type { EventDto } from "@/types/events";
import type { RegistrationDTO } from "@/types/eventRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/common/StatsCard";
import { Calendar, Users, UserCheck, UserX, Clock } from "lucide-react";
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
          <div className="text-center py-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-destructive text-sm font-medium">{eventsError}</p>
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
          <div className="mt-4 p-4 bg-muted rounded-lg border">
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
  const [registrations, setRegistrations] = useState<RegistrationDTO[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Load registration statistics
  const loadRegistrationStats = async (eventId: number) => {
    setStatsLoading(true);
    try {
      const result = await eventRegistrationService.getEventRegistrations(
        eventId,
        undefined, // no status filter to get all
        1,
        1000 // get all registrations for stats
      );
      setRegistrations(result.items || []);
    } catch (error) {
      console.error('Failed to load registration stats:', error);
      setRegistrations([]);
    } finally {
      setStatsLoading(false);
    }
  };

  // Calculate registration statistics
  const registrationStats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter(r => r.statusName?.toLowerCase() === 'pending').length;
    const approved = registrations.filter(r => r.statusName?.toLowerCase() === 'approved').length;
    const rejected = registrations.filter(r => r.statusName?.toLowerCase() === 'rejected').length;
    
    return { total, pending, approved, rejected };
  }, [registrations]);

  // Handle filter changes
  const handleFiltersChange = (
    newFilters: Partial<RegistrationFiltersType>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters and load stats when event changes
  useEffect(() => {
    if (selectedEvent) {
      setFilters({
        page: 1,
        size: 10,
      });
      loadRegistrationStats(selectedEvent.eventId);
    } else {
      setRegistrations([]);
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
        <div className="space-y-6">
          {/* Registration Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Registrations"
              value={registrationStats.total}
              icon={Users}
              description="All volunteer registrations"
            />
            <StatsCard
              title="Pending Review"
              value={registrationStats.pending}
              icon={Clock}
              description="Awaiting approval"
            />
            <StatsCard
              title="Approved"
              value={registrationStats.approved}
              icon={UserCheck}
              description="Confirmed volunteers"
            />
            <StatsCard
              title="Rejected"
              value={registrationStats.rejected}
              icon={UserX}
              description="Declined applications"
            />
          </div>

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
            <p className="text-muted-foreground font-medium">
              Please select an event to view and manage registrations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRegistrationManagement;
