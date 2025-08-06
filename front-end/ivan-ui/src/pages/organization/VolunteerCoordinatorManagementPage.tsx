import React, { useEffect } from "react";
import { useVolunteerCoordinators } from "@/hooks/useVolunteerCoordinatorData";
import { useAuth } from "@/hooks/useAuth";
import { VolunteerCoordinatorDashboard } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorDashboard";
import { VolunteerCoordinatorList } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorList_new";
import { VolunteerCoordinatorFilters } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorFilters_new";
import { CreateVolunteerCoordinatorDialog } from "@/components/organization/volunteer-coordinator-management/CreateVolunteerCoordinatorDialog_new";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import type { VolunteerCoordinatorFilterDto } from "@/types/volunteer-coordinator";

const VolunteerCoordinatorManagementPage = () => {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  const coordinatorHooks = useVolunteerCoordinators(organizationId);
  const {
    data: coordinators,
    loading,
    error,
    loadAll: loadCoordinators,
    stats,
    lookups,
    operations,
  } = coordinatorHooks;

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<VolunteerCoordinatorFilterDto>({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    loadInitialData();
  }, [organizationId]);

  const loadInitialData = async () => {
    if (!organizationId) return;

    await Promise.all([
      loadCoordinators(),
      stats.loadStats(),
      lookups.loadAll(),
    ]);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadCoordinators();
    stats.loadStats();
    lookups.loadAvailableManagers(); // Refresh managers list
  };

  const handleUpdateSuccess = () => {
    loadCoordinators();
    stats.loadStats();
    lookups.loadAvailableManagers();
  };

  const handleFiltersChange = (
    newFilters: Partial<VolunteerCoordinatorFilterDto>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      size: 10,
    });
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
      {stats.stats && <VolunteerCoordinatorDashboard stats={stats.stats} />}

      {/* Filters */}
      <VolunteerCoordinatorFilters
        organizationId={organizationId!}
        managementLevels={lookups.managementLevels}
        specializations={lookups.specializations}
        availableManagers={lookups.availableManagers}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Coordinator List */}
      {coordinators.length > 0 ? (
        <VolunteerCoordinatorList
          organizationId={organizationId!}
          coordinators={coordinators}
          onCoordinatorUpdated={handleUpdateSuccess}
        />
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No coordinators yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first volunteer coordinator.
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Coordinator
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <CreateVolunteerCoordinatorDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
        organizationId={organizationId!}
        managementLevels={lookups.managementLevels}
        specializations={lookups.specializations}
      />
    </div>
  );
};

export default VolunteerCoordinatorManagementPage;
