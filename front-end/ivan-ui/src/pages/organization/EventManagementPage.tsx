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
      <div className="p-6 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 rounded-xl border border-red-200 dark:border-red-800 shadow-lg backdrop-blur-sm">
        <div className="text-red-700 dark:text-red-300 font-medium">Error: {eventsError}</div>
        <Button onClick={() => loadAllData()} className="mt-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600">
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
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Event Management</h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage your organization's volunteer events
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-t-lg border-b border-green-200 dark:border-green-800">
            <CardTitle className="text-lg flex items-center text-green-900 dark:text-green-100">
              <Users className="w-5 h-5 mr-2" />
              Quản lý đăng ký sự kiện
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Xem và quản lý đăng ký tình nguyện viên cho các sự kiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/organization/event-registrations">
              <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900">
                <FileText className="w-4 h-4 mr-2" />
                Xem đăng ký sự kiện
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 border border-orange-200 dark:border-orange-800 shadow-lg">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-t-lg border-b border-orange-200 dark:border-orange-800">
            <CardTitle className="text-lg flex items-center text-orange-900 dark:text-orange-100">
              <Users className="w-5 h-5 mr-2" />
              Quản lý Coordinators
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Quản lý điều phối viên tình nguyện trong tổ chức
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/organization/volunteer-coordinators">
              <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900">
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
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
          <Plus className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first event to get started
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
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
