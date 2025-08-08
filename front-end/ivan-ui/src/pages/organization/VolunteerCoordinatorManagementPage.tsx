import React, { useEffect, useState } from "react";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import { useAuth } from "@/hooks/useAuth";
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

  // State management for coordinators
  const [coordinators, setCoordinators] = useState<VolunteerCoordinatorDto[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State management for stats
  const [stats, setStats] = useState<VolunteerCoordinatorStatsDto | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // State management for management levels
  const [managementLevels, setManagementLevels] = useState<
    ManagementLevelDto[]
  >([]);
  const [managementLevelsLoading, setManagementLevelsLoading] = useState(false);
  const [managementLevelsError, setManagementLevelsError] = useState<
    string | null
  >(null);

  // State management for specializations
  const [specializations, setSpecializations] = useState<SpecializationDto[]>(
    []
  );
  const [specializationsLoading, setSpecializationsLoading] = useState(false);
  const [specializationsError, setSpecializationsError] = useState<
    string | null
  >(null);

  // State management for available managers
  const [availableManagers, setAvailableManagers] = useState<any[]>([]);
  const [availableManagersLoading, setAvailableManagersLoading] =
    useState(false);
  const [availableManagersError, setAvailableManagersError] = useState<
    string | null
  >(null);

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

    // Load coordinators
    setLoading(true);
    setError(null);
    try {
      const coordinatorsResult = await coordinatorsService.getAll();
      setCoordinators(coordinatorsResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load coordinators"
      );
    } finally {
      setLoading(false);
    }

    // Load stats
    setStatsLoading(true);
    setStatsError(null);
    try {
      const statsResult = await volunteerCoordinatorService.getCoordinatorStats(
        organizationId
      );
      setStats(statsResult);
    } catch (err) {
      setStatsError(
        err instanceof Error ? err.message : "Failed to load stats"
      );
    } finally {
      setStatsLoading(false);
    }

    // Load management levels
    setManagementLevelsLoading(true);
    setManagementLevelsError(null);
    try {
      const levelsResult =
        await volunteerCoordinatorService.getManagementLevels();
      setManagementLevels(levelsResult);
    } catch (err) {
      setManagementLevelsError(
        err instanceof Error ? err.message : "Failed to load management levels"
      );
    } finally {
      setManagementLevelsLoading(false);
    }

    // Load specializations
    setSpecializationsLoading(true);
    setSpecializationsError(null);
    try {
      const specializationsResult =
        await volunteerCoordinatorService.getSpecializations();
      setSpecializations(specializationsResult);
    } catch (err) {
      setSpecializationsError(
        err instanceof Error ? err.message : "Failed to load specializations"
      );
    } finally {
      setSpecializationsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadInitialData(); // Refresh all data
  };

  const handleUpdateSuccess = () => {
    loadInitialData(); // Refresh all data
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
