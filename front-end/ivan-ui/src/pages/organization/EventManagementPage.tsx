import React, { useEffect } from "react";
import { useEvent } from "@/context/EventContext";
import { EventDashboard } from "@/components/organization/event-management/EventDashboard";
import { EventList } from "@/components/organization/event-management/EventList";
import { EventFilters } from "@/components/organization/event-management/EventFilters";
import { CreateEventDialog } from "@/components/organization/event-management/CreateEventDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EventManagementPage() {
  const {
    events,
    stats,
    categories,
    statuses,
    loading,
    error,
    loadEvents,
    loadStats,
    loadCategories,
    loadStatuses,
  } = useEvent();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadEvents(),
      loadStats(),
      loadCategories(),
      loadStatuses(),
    ]);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadEvents();
    loadStats();
  };

  const handleEditSuccess = () => {
    // Refresh data after edit
    loadEvents();
    loadStats();
  };

  if (loading && !events.length) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error: {error}</div>
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

      {/* Dashboard */}
      {stats && <EventDashboard stats={stats} />}

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
