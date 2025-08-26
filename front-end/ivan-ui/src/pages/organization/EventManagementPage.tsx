import { useEffect, useState } from "react";
import { eventsService } from "@/services/eventsService";
import { useAuth } from "@/hooks/useAuth";
import type {
  EventDto,
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
      <div className="p-6 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 rounded-xl border border-red-200 dark:border-red-800 shadow-lg backdrop-blur-sm">
        <div className="text-red-700 dark:text-red-300 font-medium">
          Error: {eventsError}
        </div>
        <Button
          onClick={() => loadAllData()}
          className="mt-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Event Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage your organization's volunteer events
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <EventFilters categories={categories} statuses={statuses} />

      {/* Event List */}
      {events.length > 0 ? (
        <EventList events={events} onEventUpdated={handleEditSuccess} />
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
          <Plus className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first event to get started
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          >
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
