import React, { useEffect, useState } from "react";
import { eventsService } from "@/services/eventsService";
import { useAuth } from "@/hooks/useAuth";
import type {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventCategoryDto,
  EventStatusDto,
} from "@/types/events";
import { EventList } from "@/components/organization/event-management/EventList";
import { EventFilters } from "@/components/organization/event-management/EventFilters";
import { CreateEventDialog } from "@/components/organization/event-management/CreateEventDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventManagementPage() {
  const { user } = useAuth();

  // State management
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<EventCategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [statuses, setStatuses] = useState<EventStatusDto[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load all data on mount
  useEffect(() => {
    // Only load data if user has organization profile
    if (user?.organizationId) {
      loadAllData();
    } else if (user && !user.organizationId) {
      setEventsError("Organization profile not found. Please contact support.");
    }
  }, [user?.organizationId]);

  const loadAllData = async () => {
    // Check if user has organization profile
    if (!user?.organizationId) {
      setEventsError("Organization profile not found. Please contact support.");
      return;
    }

    // Load events - filter by organization's own events only
    setEventsLoading(true);
    setEventsError(null);
    try {
      const filters = {
        page: 1,
        size: 100,
        sortBy: "startDate",
        sortDirection: "desc" as const,
        organizationId: user.organizationId, // Only load this organization's events
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

    // Load categories
    setCategoriesLoading(true);
    try {
      const categoriesResult = await eventsService.getEventCategories();
      setCategories(categoriesResult);
    } catch (err) {
      console.warn("Failed to load categories:", err);
    } finally {
      setCategoriesLoading(false);
    }

    // Load statuses
    setStatusesLoading(true);
    try {
      const statusesResult = await eventsService.getEventStatuses();
      setStatuses(statusesResult);
    } catch (err) {
      console.warn("Failed to load statuses:", err);
    } finally {
      setStatusesLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadAllData(); // Refresh events data
  };

  const handleEditSuccess = () => {
    loadAllData(); // Refresh events data
  };

  // Determine loading state
  const isLoading = eventsLoading;

  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  if (eventsError) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error: {eventsError}</div>
        <Button onClick={() => loadAllData()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">
            Manage your organization's volunteer events
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Quản lý đăng ký sự kiện
            </CardTitle>
            <CardDescription>
              Xem và quản lý đăng ký tình nguyện viên cho các sự kiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/organization/event-registrations">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Xem đăng ký sự kiện
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Quản lý Coordinators
            </CardTitle>
            <CardDescription>
              Quản lý điều phối viên tình nguyện trong tổ chức
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/organization/volunteer-coordinators">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Quản lý Coordinators
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <EventFilters categories={categories} statuses={statuses} />

      {/* Event List */}
      {events.length > 0 ? (
        <EventList events={events} onEventUpdated={handleEditSuccess} />
      ) : (
        <div className="text-center py-12">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first event to get started
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
        categories={categories}
      />
    </div>
  );
}
