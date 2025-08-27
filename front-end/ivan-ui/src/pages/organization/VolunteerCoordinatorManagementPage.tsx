import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Send } from "lucide-react";
import { VolunteerCoordinatorDashboard } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorDashboard";
import { VolunteerCoordinatorList } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorList";
import { VolunteerCoordinatorFilters } from "@/components/organization/volunteer-coordinator-management/VolunteerCoordinatorFilters";
import { CreateCoordinatorRequestModal } from "@/components/organization/volunteer-coordinator-management/CreateCoordinatorRequestModal";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { useAuth } from "@/hooks/useAuth";
import type {
  VolunteerCoordinatorDto,
  VolunteerCoordinatorStatsDto,
  ManagementLevelDto,
  SpecializationDto,
  VolunteerCoordinatorFilterDto,
} from "@/types/volunteerCoordinator";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";

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

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<VolunteerCoordinatorFilterDto>({
    page: 1,
    size: 10,
    sortBy: "CreatedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    loadInitialData();
  }, [organizationId]);

  // Load coordinators when filters change (except page changes which are handled separately)
  useEffect(() => {
    if (organizationId) {
      loadCoordinators();
    }
  }, [filters.search, filters.isActive]); // Only trigger on search and status changes

  const loadCoordinators = async (currentFilters = filters) => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const result =
        await volunteerCoordinatorService.getCoordinatorsByOrganization(
          organizationId,
          currentFilters
        );
      setCoordinators(result.items);
      setTotalPages(Math.ceil(result.totalCount / currentFilters.size));
      setTotalItems(result.totalCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách điều phối viên"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    if (!organizationId) return;

    // Load coordinators with filters
    await loadCoordinators();

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
        err instanceof Error ? err.message : "Không thể tải thống kê"
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
        err instanceof Error ? err.message : "Không thể tải cấp độ quản lý"
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
        err instanceof Error ? err.message : "Không thể tải chuyên môn"
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
      const managersResult = coordinators
        .map((coord) => coord.user)
        .filter((user) => user);
      setAvailableManagers(managersResult);
    } catch (err) {
      setAvailableManagersError(
        err instanceof Error ? err.message : "Không thể tải danh sách quản lý"
      );
    } finally {
      setAvailableManagersLoading(false);
    }
  };

  const handleRequestSuccess = () => {
    setShowRequestModal(false);
    // Optionally refresh data or show success message
  };

  const handleUpdateSuccess = () => {
    loadCoordinators(); // Refresh coordinators data
  };

  const handleFiltersChange = async (
    newFilters: Partial<VolunteerCoordinatorFilterDto>
  ) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    setFilters(updatedFilters);
    await loadCoordinators(updatedFilters);
  };

  const handlePageChange = async (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    await loadCoordinators(updatedFilters);
  };

  const handleResetFilters = async () => {
    const resetFilters = {
      page: 1,
      size: 10,
      sortBy: "CreatedAt",
      sortOrder: "desc",
    };
    setFilters(resetFilters);
    await loadCoordinators(resetFilters);
  };

  if (loading && !coordinators.length) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return (
      <ErrorDisplay
        variant="page"
        title="Không thể tải dữ liệu"
        error={error}
        onRetry={loadInitialData}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Quản lý Điều phối viên Tình nguyện
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Quản lý các điều phối viên tình nguyện của tổ chức bạn
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowRequestModal(true)}
            variant="outline"
            className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Gửi yêu cầu Coordinator
          </Button>
        </div>
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
          pagination={{
            currentPage: filters.page,
            totalPages: totalPages,
            pageSize: filters.size,
            totalItems: totalItems,
            onPageChange: handlePageChange,
          }}
        />
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <Users className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Chưa có điều phối viên nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bắt đầu bằng cách gửi yêu cầu điều phối viên từ quản trị viên.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setShowRequestModal(true)}
              variant="outline"
              className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi yêu cầu Coordinator
            </Button>
          </div>
        </div>
      )}

      {/* Coordinator Request Modal */}
      <CreateCoordinatorRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
};

export default VolunteerCoordinatorManagementPage;
