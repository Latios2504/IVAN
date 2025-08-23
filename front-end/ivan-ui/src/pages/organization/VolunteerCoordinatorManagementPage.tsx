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
} from "@/types/volunteerCoordinator";

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
        await volunteerCoordinatorService.getCoordinatorsByOrganization(
          organizationId,
          {} // empty filters for initial load
        );
      return result.items || [];
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
    sortBy: "CreatedAt",
    sortOrder: "desc",
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

    // Load available managers (for now, use coordinators as potential managers)
    setAvailableManagersLoading(true);
    setAvailableManagersError(null);
    try {
      // For now, we'll use the coordinators list as available managers
      // In a real scenario, this might be a separate API call for organization users
      const managersResult = coordinators.map(coord => coord.user).filter(user => user);
      setAvailableManagers(managersResult);
    } catch (err) {
      setAvailableManagersError(
        err instanceof Error ? err.message : "Failed to load available managers"
      );
    } finally {
      setAvailableManagersLoading(false);
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
      sortBy: "CreatedAt",
      sortOrder: "desc",
    });
  };

  if (loading && !coordinators.length) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 rounded-xl border border-red-200 dark:border-red-800 shadow-lg backdrop-blur-sm">
        <div className="text-red-700 dark:text-red-300 font-medium">Error: {error}</div>
        <Button onClick={loadInitialData} className="mt-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg">
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
            Volunteer Coordinator Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage your organization's volunteer coordinators
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
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
          availableManagers={availableManagers}
        />
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <Users className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No coordinators yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first volunteer coordinator.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add First Coordinator
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <CreateVolunteerCoordinatorDialog
        isOpen={showCreateDialog}
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
