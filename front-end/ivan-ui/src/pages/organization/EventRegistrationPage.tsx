import React, { useState } from "react";
import {
  useEventRegistration,
  EventRegistrationProvider,
} from "@/context/EventRegistrationContext";
import { useEvent } from "@/context/EventContext";
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
  const { events, loading } = useEvent();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Select Event:</span>
      </div>
      <Select
        value={selectedEvent?.eventId.toString() || ""}
        onValueChange={(value: string) => {
          if (value) {
            const event = events.find(
              (e: any) => e.eventId === parseInt(value)
            );
            onEventSelect(event || null);
          } else {
            onEventSelect(null);
          }
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Choose an event to manage registrations" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading events...
            </SelectItem>
          ) : events.length === 0 ? (
            <SelectItem value="empty" disabled>
              No events available
            </SelectItem>
          ) : (
            events.map((event: any) => (
              <SelectItem key={event.eventId} value={event.eventId.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{event.eventName}</span>
                  <Badge variant="outline" className="ml-2">
                    {event.statusName}
                  </Badge>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

const EmptyEventState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select an Event
        </h3>
        <p className="text-gray-600 mb-4">
          Choose an event from the dropdown above to start managing volunteer
          registrations.
        </p>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          View Event Settings
        </Button>
      </div>
    </div>
  );
};

const EventRegistrationPageContent: React.FC = () => {
  const { setSelectedEvent, selectedEventId, stats, loading, error } =
    useEventRegistration();
  const { events } = useEvent();
  const [selectedEvent, setSelectedEventLocal] = useState<Event | null>(null);

  const handleEventSelect = (event: Event | null) => {
    setSelectedEventLocal(event);
    setSelectedEvent(event?.eventId || null);
  };

  const currentEvent =
    selectedEvent || events.find((e) => e.eventId === selectedEventId);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <UserX className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load registrations
              </h3>
              <p className="text-gray-600 mb-4">{error?.message || error?.toString() || 'Đã xảy ra lỗi'}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <span>Event Registration Management</span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage volunteer registrations for your events
              </p>
            </div>

            <EventSelector
              onEventSelect={handleEventSelect}
              selectedEvent={currentEvent || null}
            />
          </div>
        </div>
      </div>

      {currentEvent ? (
        <>
          {/* Event Header */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentEvent.eventName}
                    </h2>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(
                            currentEvent.startDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(currentEvent.endDate).toLocaleDateString()}
                        </span>
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>{currentEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {currentEvent.statusName}
                  </Badge>
                  {stats && (
                    <Badge variant="secondary">
                      {stats.totalRegistrations} registrations
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <RegistrationAnalyticsDashboard />

          {/* Management Interface */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <RegistrationFilters />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <RegistrationList eventId={currentEvent.eventId} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyEventState />
      )}

      {/* Modals */}
      <RegistrationDetailDialog />
      <ApprovalDialog />
      <RejectionDialog />
      <BulkActionsDialog />
    </div>
  );
};

export default function EventRegistrationPage() {
  return (
    <EventRegistrationProvider>
      <EventRegistrationPageContent />
    </EventRegistrationProvider>
  );
}
