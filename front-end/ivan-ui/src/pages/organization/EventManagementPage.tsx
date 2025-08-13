import React, { useEffect, useState } from "react";
import { eventsService } from "@/services/eventsService";
import type { PagedResultDto } from "@/types/common";
import type {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventStatsDto,
  EventCategoryDto,
  EventStatusDto,
} from "@/types/events";
import { EventDashboard } from "@/components/organization/event-management/EventDashboard";
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

export default function EventManagementPageNew() {
  // Service adapters
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
    getById: async (id: number | string): Promise<EventDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await eventService.getOrganizationEvent(numericId);
    },
    create: async (data: CreateEventDto): Promise<EventDto> => {
      const eventId = await eventService.createEvent(data);
      // Return the created event by fetching it
      return await eventService.getOrganizationEvent(eventId);
    },
    update: async (
      id: number | string,
      data: UpdateEventDto
    ): Promise<EventDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      await eventService.updateEvent(numericId, data);
      // Return the updated event by fetching it
      return await eventService.getOrganizationEvent(numericId);
    },
    delete: async (id: number | string): Promise<void> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await eventService.deleteEvent(numericId);
    },
  };

  const eventStatsService = {
    getAll: async (): Promise<EventStatsDto[]> => {
      const result = await eventService.getOrganizationStats();
      return [result]; // Wrap in array for consistency
    },
  };

  const eventCategoriesService = {
    getAll: async (): Promise<EventCategoryDto[]> => {
      return await eventService.getEventCategories();
    },
  };

  const eventStatusesService = {
    getAll: async (): Promise<EventStatusDto[]> => {
      return await eventService.getEventStatuses();
    },
  };

  // State management
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [stats, setStats] = useState<EventStatsDto[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<EventCategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [statuses, setStatuses] = useState<EventStatusDto[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [statusesError, setStatusesError] = useState<string | null>(null);

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // Load events
    setEventsLoading(true);
    setEventsError(null);
    try {
      const eventsResult = await eventDataService.getAll();
      setEvents(eventsResult);
    } catch (err) {
      setEventsError(
        err instanceof Error ? err.message : "Failed to load events"
      );
    } finally {
      setEventsLoading(false);
    }

    // Load stats
    setStatsLoading(true);
    setStatsError(null);
    try {
      const statsResult = await eventStatsService.getAll();
      setStats(statsResult);
    } catch (err) {
      setStatsError(
        err instanceof Error ? err.message : "Failed to load stats"
      );
    } finally {
      setStatsLoading(false);
    }

    // Load categories
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const categoriesResult = await eventCategoriesService.getAll();
      setCategories(categoriesResult);
    } catch (err) {
      setCategoriesError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setCategoriesLoading(false);
    }

    // Load statuses
    setStatusesLoading(true);
    setStatusesError(null);
    try {
      const statusesResult = await eventStatusesService.getAll();
      setStatuses(statusesResult);
    } catch (err) {
      setStatusesError(
        err instanceof Error ? err.message : "Failed to load statuses"
      );
    } finally {
      setStatusesLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadAllData(); // Refresh all data
  };

  const handleEditSuccess = () => {
    // Refresh data after edit
    loadAllData(); // Refresh all data
  };

  // Determine loading state - loading if any critical data is loading
  const isLoading = eventsLoading;

  // Combine errors from all hooks
  const hasError =
    eventsError || statsError || categoriesError || statusesError;
  const errorMessage =
    eventsError || statsError || categoriesError || statusesError;

  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  if (hasError) {
    return (
      <div className="p-6">
        <div className="text-red-600">
          Error:{" "}
          {typeof errorMessage === "string" ? errorMessage : "Đã xảy ra lỗi"}
        </div>
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

      {/* Dashboard */}
      {stats.length > 0 && stats[0] && <EventDashboard stats={stats[0]} />}

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
