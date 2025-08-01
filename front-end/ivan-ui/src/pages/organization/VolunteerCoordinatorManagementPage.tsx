import React, { useEffect } from "react";
import { useVolunteerCoordinator } from "@/context/VolunteerCoordinatorContext";
import { VolunteerCoordinatorProvider } from "@/context/VolunteerCoordinatorContext";
import { VolunteerCoordinatorDashboard } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorDashboard";
import { VolunteerCoordinatorList } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorList";
import { VolunteerCoordinatorFilters } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorFilters";
import { CreateVolunteerCoordinatorDialog } from "@/components/organization/volunteer-coordinator-management/CreateVolunteerCoordinatorDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const VolunteerCoordinatorManagementContent = () => {
  const {
    coordinators,
    stats,
    managementLevels,
    specializations,
    availableManagers,
    loading,
    error,
    loadCoordinators,
    loadStats,
    loadManagementLevels,
    loadSpecializations,
    loadAvailableManagers,
  } = useVolunteerCoordinator();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadCoordinators(),
      loadStats(),
      loadManagementLevels(),
      loadSpecializations(),
      loadAvailableManagers(),
    ]);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadCoordinators();
    loadStats();
    loadAvailableManagers(); // Refresh managers list
  };

  const handleUpdateSuccess = () => {
    // Refresh data after updates
    loadCoordinators();
    loadStats();
    loadAvailableManagers();
  };

  if (loading && !coordinators.length) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Volunteer Coordinator Management
          </h1>
          <p className="text-gray-600">
            Manage your organization's volunteer coordinators
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coordinator
        </Button>
      </div>

      {/* Dashboard */}
      {stats && <VolunteerCoordinatorDashboard stats={stats} />}

      {/* Filters */}
      <VolunteerCoordinatorFilters
        managementLevels={managementLevels}
        specializations={specializations}
      />

      {/* Coordinator List */}
      {coordinators.length > 0 ? (
        <VolunteerCoordinatorList
          coordinators={coordinators}
          onCoordinatorUpdated={handleUpdateSuccess}
        />
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No volunteer coordinators found
          </h3>
          <p className="text-gray-600 mb-4">
            Add your first volunteer coordinator to get started
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Coordinator
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <CreateVolunteerCoordinatorDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
        managementLevels={managementLevels}
        specializations={specializations}
      />
    </div>
  );
};

export default function VolunteerCoordinatorManagementPage() {
  return (
    <VolunteerCoordinatorProvider>
      <VolunteerCoordinatorManagementContent />
    </VolunteerCoordinatorProvider>
  );
}
