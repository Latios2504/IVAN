import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import { useAuth } from "@/context/AuthContext";
import { VolunteerCoordinatorDashboard } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorDashboard";
import { VolunteerCoordinatorList } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorList";
import { VolunteerCoordinatorFilters } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorFilters";
import { CreateVolunteerCoordinatorDialog } from "@/components/organization/volunteer-coordinator-management/CreateVolunteerCoordinatorDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import type {
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorDto,
  VolunteerCoordinatorStatsDto,
  ManagementLevelDto,
  SpecializationDto,
} from "@/types/volunteer-coordinator";

const VolunteerCoordinatorManagementPage = () => {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  // Service adapter for volunteer coordinators
  const coordinatorsService = {
    getAll: async (): Promise<VolunteerCoordinatorDto[]> => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const result =
        await volunteerCoordinatorService.getOrganizationCoordinators(
          {}, // empty filters for initial load
          organizationId
        );
      return result.items;
    },
  };

  const coordinatorsApi = useApi<VolunteerCoordinatorDto, never, never>(
    coordinatorsService
  );

  // Service adapter for stats
  const statsService = {
    getAll: async (): Promise<VolunteerCoordinatorStatsDto[]> => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const stats = await volunteerCoordinatorService.getCoordinatorStats(
        organizationId
      );
      return [stats]; // Wrap in array for consistency with useApi
    },
  };

  const statsApi = useApi<VolunteerCoordinatorStatsDto, never, never>(
    statsService
  );

  // Service adapter for management levels
  const managementLevelsService = {
    getAll: async (): Promise<ManagementLevelDto[]> => {
      return await volunteerCoordinatorService.getManagementLevels();
    },
  };

  const managementLevelsApi = useApi<ManagementLevelDto, never, never>(
    managementLevelsService
  );

  // Service adapter for specializations
  const specializationsService = {
    getAll: async (): Promise<SpecializationDto[]> => {
      return await volunteerCoordinatorService.getSpecializations();
    },
  };

  const specializationsApi = useApi<SpecializationDto, never, never>(
    specializationsService
  );

  // Service adapter for available managers
  const availableManagersService = {
    getAll: async (): Promise<any[]> => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return await volunteerCoordinatorService.getAvailableManagers(
        organizationId
      );
    },
  };

  const availableManagersApi = useApi(availableManagersService);

  // Extract data from API responses
  const coordinators = coordinatorsApi.data || [];
  const loading = coordinatorsApi.loading;
  const error = coordinatorsApi.error;
  const stats = statsApi.data?.[0]; // Extract single stats object
  const managementLevels = managementLevelsApi.data || [];
  const specializations = specializationsApi.data || [];
  const availableManagers = availableManagersApi.data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState<VolunteerCoordinatorFilterDto>({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    loadInitialData();
  }, [organizationId]);

  const loadInitialData = async () => {
    if (!organizationId) return;

    await Promise.all([
      coordinatorsApi.loadAll(),
      statsApi.loadAll(),
      managementLevelsApi.loadAll(),
      specializationsApi.loadAll(),
      availableManagersApi.loadAll(),
    ]);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    coordinatorsApi.loadAll();
    statsApi.loadAll();
    availableManagersApi.loadAll(); // Refresh managers list
  };

  const handleUpdateSuccess = () => {
    coordinatorsApi.loadAll();
    statsApi.loadAll();
    availableManagersApi.loadAll();
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
      {stats && <VolunteerCoordinatorDashboard stats={stats} />}

      {/* Filters */}
      <VolunteerCoordinatorFilters
        organizationId={organizationId!}
        managementLevels={managementLevels}
        specializations={specializations}
        availableManagers={availableManagers}
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
        managementLevels={managementLevels}
        specializations={specializations}
      />
    </div>
  );
};

export default VolunteerCoordinatorManagementPage;
