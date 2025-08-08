import React, { useState, useEffect } from "react";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { eventService } from "@/services/eventService";
import type { PagedResultDto } from "@/types/common";
import type {
  Registration,
  RegistrationFilters as RegistrationFilterType,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  EventSummary,
} from "@/types/eventRegistration";
import type { EventDto, CreateEventDto, UpdateEventDto } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Calendar,
  Settings,
  FileText,
  ClipboardList,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";

// Import the registration management components
import RegistrationList from "@/components/organization/event-registration-management/RegistrationList";
import RegistrationAnalyticsDashboard from "@/components/organization/event-registration-management/RegistrationAnalyticsDashboard";
import RegistrationFilters from "@/components/organization/event-registration-management/RegistrationFilters";

// Temporary placeholder modal components (will be implemented next)
const RegistrationDetailDialog: React.FC = () => null;
const ApprovalDialog: React.FC = () => null;
const RejectionDialog: React.FC = () => null;
const BulkActionsDialog: React.FC = () => null;

interface EventSelectorProps {
  onEventSelect: (event: EventSummary | null) => void;
  selectedEvent: EventSummary | null;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  onEventSelect,
  selectedEvent,
}) => {
  // Event service adapter
  const eventDataService = {
    getAll: async (): Promise<EventDto[]> => {
      const filters = {
        page: 1,
        size: 100,
        sortBy: "startDate",
        sortDirection: "desc" as const,
      };
      const result = await eventService.getOrganizationEvents(filters);
      return result.items;
    },
  };

  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const result = await eventDataService.getAll();
        setEvents(result);
      } catch (err) {
        setEventsError(
          err instanceof Error ? err.message : "Failed to load events"
        );
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

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
        <Select
          value={selectedEvent?.eventId.toString() || "none"}
          onValueChange={handleEventChange}
          disabled={eventsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an event to manage registrations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select an event...</SelectItem>
            {events?.map((event: EventDto) => (
              <SelectItem key={event.eventId} value={event.eventId.toString()}>
                <div className="flex items-center gap-2">
                  <span>{event.eventName}</span>
                  <Badge variant="outline">{event.statusName}</Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

// Registration Context Provider Component that provides eventId to child components
interface RegistrationProviderProps {
  eventId: number;
  children: React.ReactNode;
}

const RegistrationProvider: React.FC<RegistrationProviderProps> = ({
  eventId,
  children,
}) => {
  // Registration service adapter
  const registrationDataService = {
    getAll: async (): Promise<Registration[]> => {
      const filters: RegistrationFilterType = {
        page: 1,
        size: 100,
        sortBy: "applicationDate",
        sortOrder: "desc",
      };
      const result = await eventRegistrationService.getRegistrations(
        eventId,
        filters
      );
      return result.items;
    },
    getById: async (id: number | string): Promise<Registration> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await eventRegistrationService.getRegistration(eventId, numericId);
    },
    update: async (
      id: number | string,
      data: ApproveRegistrationRequest | RejectRegistrationRequest
    ): Promise<Registration> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      if ("approvedDate" in data) {
        await eventRegistrationService.approveRegistration(
          eventId,
          numericId,
          data as ApproveRegistrationRequest
        );
      } else {
        await eventRegistrationService.rejectRegistration(
          eventId,
          numericId,
          data as RejectRegistrationRequest
        );
      }
      return await eventRegistrationService.getRegistration(eventId, numericId);
    },
  };

  // Initialize the registration state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState<string | null>(
    null
  );

  // Load initial data
  useEffect(() => {
    const loadRegistrations = async () => {
      setRegistrationsLoading(true);
      setRegistrationsError(null);
      try {
        const result = await registrationDataService.getAll();
        setRegistrations(result);
      } catch (err) {
        setRegistrationsError(
          err instanceof Error ? err.message : "Failed to load registrations"
        );
      } finally {
        setRegistrationsLoading(false);
      }
    };

    loadRegistrations();
  }, [eventId]);

  // Create a context-like object to pass down
  const contextValue = {
    eventId,
    data: registrations,
    loading: registrationsLoading,
    error: registrationsError,
  };

  // Use React Context or just pass as props to children
  return (
    <div data-event-id={eventId}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            registrationContext: contextValue,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

// Main Event Registration Management Page
const EventRegistrationManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);

  if (!selectedEvent) {
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

        <EmptyState
          icon={ClipboardList}
          title="No Event Selected"
          description="Please select an event to view and manage registrations."
          show={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Registration Management
          </h1>
          <p className="text-muted-foreground">
            Managing registrations for: {selectedEvent.eventName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Event Selector */}
      <EventSelector
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
      />

      {/* Registration Management */}
      <div className="space-y-6">
        {/* TODO: Pass selectedEvent.eventId to these components after migration */}
        {/* Analytics Dashboard */}
        {/* <RegistrationAnalyticsDashboard /> */}

        <Separator />

        {/* Filters */}
        {/* <RegistrationFilters /> */}

        {/* Registration List */}
        {/* <RegistrationList /> */}

        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Registration management components will be migrated next...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal Dialogs */}
      <RegistrationDetailDialog />
      <ApprovalDialog />
      <RejectionDialog />
      <BulkActionsDialog />
    </div>
  );
};

export default EventRegistrationManagement;
