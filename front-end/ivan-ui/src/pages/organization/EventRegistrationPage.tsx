import React, { useState, useEffect } from "react";
import { useEventRegistrations } from "@/hooks/useEventRegistrationData";
import { useEventData } from "@/hooks/useEventData";
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
import type { Event } from "@/types/eventRegistration";

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
  onEventSelect: (event: Event | null) => void;
  selectedEvent: Event | null;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  onEventSelect,
  selectedEvent,
}) => {
  const {
    data: events,
    loading: eventsLoading,
    loadAll: loadEvents,
  } = useEventData();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEventChange = (eventId: string) => {
    if (eventId === "none") {
      onEventSelect(null);
    } else {
      const event = events.find((e) => e.eventId.toString() === eventId);
      onEventSelect(event || null);
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
            {events?.map((event) => (
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
  // Initialize the registration hooks with eventId
  const registrations = useEventRegistrations(eventId);

  // Load initial data
  useEffect(() => {
    registrations.loadAll();
    registrations.stats.loadStats();
  }, [eventId]);

  // Create a context-like object to pass down
  const contextValue = {
    eventId,
    ...registrations,
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
