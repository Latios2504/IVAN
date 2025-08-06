import React, { useEffect } from "react";
import {
  useEventData,
  useEventStats,
  useEventCategories,
  useEventStatuses,
} from "@/hooks/useEventData";
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
  // Use the new useData hooks
  const events = useEventData();
  const stats = useEventStats();
  const categories = useEventCategories();
  const statuses = useEventStatuses();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      events.loadAll(),
      stats.loadAll(),
      categories.loadAll(),
      statuses.loadAll(),
    ]);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    events.loadAll();
    stats.loadAll();
  };

  const handleEditSuccess = () => {
    // Refresh data after edit
    events.loadAll();
    stats.loadAll();
  };

  // Determine loading state - loading if any critical data is loading
  const isLoading = events.loading && !events.data.length;

  // Combine errors from all hooks
  const hasError =
    events.error || stats.error || categories.error || statuses.error;
  const errorMessage =
    events.error || stats.error || categories.error || statuses.error;

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
        <Button onClick={loadInitialData} className="mt-4">
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
      {stats.data.length > 0 && stats.data[0] && (
        <EventDashboard stats={stats.data[0]} />
      )}

      {/* Filters */}
      <EventFilters categories={categories.data} statuses={statuses.data} />

      {/* Event List */}
      {events.data.length > 0 ? (
        <EventList events={events.data} onEventUpdated={handleEditSuccess} />
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
        categories={categories.data}
      />
    </div>
  );
}
