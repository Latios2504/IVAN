import { useState, useCallback } from "react";
import { useData } from "./useData";
import type {
  VolunteerCoordinatorDto,
  VolunteerCoordinatorStatsDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorHierarchyDto,
  ManagementLevelDto,
  SpecializationDto,
  PagedResultDto,
  CreateVolunteerCoordinatorDto,
  UpdateVolunteerCoordinatorDto,
} from "../types/volunteer-coordinator";
import { volunteerCoordinatorService } from "../services/volunteerCoordinatorService";

/**
 * Service adapter for Volunteer Coordinator data
 * This bridges the existing volunteerCoordinatorService with useData hook expectations
 */
const volunteerCoordinatorDataService = {
  /**
   * Get all coordinators with filtering and pagination
   */
  getAll: async (
    organizationId: number,
    filters?: VolunteerCoordinatorFilterDto
  ): Promise<VolunteerCoordinatorDto[]> => {
    const defaultFilters: VolunteerCoordinatorFilterDto = {
      page: 1,
      size: 20,
      sortBy: "fullName",
      sortDirection: "asc",
      ...filters,
    };

    const result =
      await volunteerCoordinatorService.getOrganizationCoordinators(
        defaultFilters,
        organizationId
      );

    return result.items;
  },

  /**
   * Get paginated coordinators
   */
  getAllPaginated: async (
    organizationId: number,
    filters?: VolunteerCoordinatorFilterDto
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> => {
    const defaultFilters: VolunteerCoordinatorFilterDto = {
      page: 1,
      size: 20,
      sortBy: "fullName",
      sortDirection: "asc",
      ...filters,
    };

    return await volunteerCoordinatorService.getOrganizationCoordinators(
      defaultFilters,
      organizationId
    );
  },

  /**
   * Get single coordinator by ID
   */
  getById: async (
    organizationId: number,
    coordinatorId: string | number
  ): Promise<VolunteerCoordinatorDto> => {
    const numericId =
      typeof coordinatorId === "string"
        ? parseInt(coordinatorId, 10)
        : coordinatorId;
    return await volunteerCoordinatorService.getCoordinatorById(numericId);
  },

  /**
   * Create new coordinator
   */
  create: async (
    organizationId: number,
    coordinatorData: CreateVolunteerCoordinatorDto
  ): Promise<VolunteerCoordinatorDto> => {
    const coordinatorId = await volunteerCoordinatorService.createCoordinator(
      coordinatorData,
      organizationId
    );

    // Return the created coordinator
    return await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
  },

  /**
   * Update coordinator
   */
  update: async (
    organizationId: number,
    coordinatorId: number,
    updates: UpdateVolunteerCoordinatorDto
  ): Promise<VolunteerCoordinatorDto> => {
    await volunteerCoordinatorService.updateCoordinator(coordinatorId, updates);

    // Return the updated coordinator
    return await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
  },

  /**
   * Delete coordinator
   */
  delete: async (
    organizationId: number,
    coordinatorId: number
  ): Promise<void> => {
    await volunteerCoordinatorService.deleteCoordinator(coordinatorId);
  },

  /**
   * Toggle coordinator status
   */
  toggleStatus: async (
    organizationId: number,
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> => {
    await volunteerCoordinatorService.toggleCoordinatorStatus(coordinatorId);

    // Return the updated coordinator
    return await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
  },

  /**
   * Assign manager to coordinator
   */
  assignManager: async (
    organizationId: number,
    coordinatorId: number,
    managerId: number
  ): Promise<VolunteerCoordinatorDto> => {
    await volunteerCoordinatorService.assignManager(coordinatorId, managerId);

    // Return the updated coordinator
    return await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
  },

  /**
   * Remove manager from coordinator
   */
  removeManager: async (
    organizationId: number,
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> => {
    await volunteerCoordinatorService.removeManager(coordinatorId);

    // Return the updated coordinator
    return await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
  },
};

/**
 * Hook for Volunteer Coordinators data management using useData
 * This replaces the complex VolunteerCoordinatorContext
 *
 * Usage:
 * const coordinators = useVolunteerCoordinatorData(organizationId);
 *
 * useEffect(() => {
 *   coordinators.loadAll();
 * }, [organizationId]);
 */
export function useVolunteerCoordinatorData(organizationId?: number) {
  const baseHook = useData<VolunteerCoordinatorDto, never, any>(
    organizationId
      ? {
          getAll: (filters?: VolunteerCoordinatorFilterDto) =>
            volunteerCoordinatorDataService.getAll(organizationId, filters),
          getById: (coordinatorId: string | number) =>
            volunteerCoordinatorDataService.getById(
              organizationId,
              coordinatorId
            ),
          create: (coordinatorData: CreateVolunteerCoordinatorDto) =>
            volunteerCoordinatorDataService.create(
              organizationId,
              coordinatorData
            ),
          update: (coordinatorId: string | number, updates: any) => {
            const numericId =
              typeof coordinatorId === "string"
                ? parseInt(coordinatorId, 10)
                : coordinatorId;
            return volunteerCoordinatorDataService.update(
              organizationId,
              numericId,
              updates
            );
          },
          delete: (coordinatorId: string | number) => {
            const numericId =
              typeof coordinatorId === "string"
                ? parseInt(coordinatorId, 10)
                : coordinatorId;
            return volunteerCoordinatorDataService.delete(
              organizationId,
              numericId
            );
          },
        }
      : {
          getAll: async () => [],
          getById: async () => ({} as VolunteerCoordinatorDto),
          create: async () => ({} as VolunteerCoordinatorDto),
          update: async () => ({} as VolunteerCoordinatorDto),
          delete: async () => {},
        }
  );

  return baseHook;
}

/**
 * Hook for Volunteer Coordinators Pagination
 */
export function useVolunteerCoordinatorsPagination(organizationId?: number) {
  const { loadAll, ...rest } = useData<
    PagedResultDto<VolunteerCoordinatorDto>,
    never,
    never
  >(
    organizationId
      ? {
          getAll: async (
            filters?: VolunteerCoordinatorFilterDto
          ): Promise<PagedResultDto<VolunteerCoordinatorDto>[]> => {
            const result =
              await volunteerCoordinatorDataService.getAllPaginated(
                organizationId,
                filters
              );
            return [result]; // Wrap in array since useData expects arrays
          },
          create: async () => {
            throw new Error("Not supported");
          },
          update: async () => {
            throw new Error("Not supported");
          },
          delete: async () => {
            throw new Error("Not supported");
          },
        }
      : {
          getAll: async () => [],
          create: async () => {
            throw new Error("Not supported");
          },
          update: async () => {
            throw new Error("Not supported");
          },
          delete: async () => {
            throw new Error("Not supported");
          },
        }
  );

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: VolunteerCoordinatorFilterDto) => {
      if (!organizationId) return Promise.resolve();

      const serviceWithFilters = {
        getAll: async (): Promise<
          PagedResultDto<VolunteerCoordinatorDto>[]
        > => {
          const result = await volunteerCoordinatorDataService.getAllPaginated(
            organizationId,
            filters
          );
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for Coordinator Operations (status, manager assignment, etc.)
 */
export function useCoordinatorOperations(organizationId?: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = useCallback(
    async (coordinatorId: number) => {
      if (!organizationId) return;

      setLoading(true);
      setError(null);
      try {
        await volunteerCoordinatorDataService.toggleStatus(
          organizationId,
          coordinatorId
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to toggle coordinator status"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [organizationId]
  );

  const assignManager = useCallback(
    async (coordinatorId: number, managerId: number) => {
      if (!organizationId) return;

      setLoading(true);
      setError(null);
      try {
        await volunteerCoordinatorDataService.assignManager(
          organizationId,
          coordinatorId,
          managerId
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to assign manager"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [organizationId]
  );

  const removeManager = useCallback(
    async (coordinatorId: number) => {
      if (!organizationId) return;

      setLoading(true);
      setError(null);
      try {
        await volunteerCoordinatorDataService.removeManager(
          organizationId,
          coordinatorId
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove manager"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [organizationId]
  );

  const createCoordinator = useCallback(
    async (coordinatorData: CreateVolunteerCoordinatorDto) => {
      if (!organizationId) return;

      setLoading(true);
      setError(null);
      try {
        return await volunteerCoordinatorDataService.create(
          organizationId,
          coordinatorData
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create coordinator"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [organizationId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    toggleStatus,
    assignManager,
    removeManager,
    createCoordinator,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook for Coordinator Stats
 */
export function useCoordinatorStats(organizationId?: number) {
  const [stats, setStats] = useState<VolunteerCoordinatorStatsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const statsData = await volunteerCoordinatorService.getCoordinatorStats();
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load coordinator stats"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  return {
    stats,
    loading,
    error,
    loadStats,
  };
}

/**
 * Hook for Coordinator Hierarchy
 */
export function useCoordinatorHierarchy(organizationId?: number) {
  const [hierarchy, setHierarchy] = useState<
    VolunteerCoordinatorHierarchyDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHierarchy = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const hierarchyData =
        await volunteerCoordinatorService.getCoordinatorHierarchy();
      setHierarchy(hierarchyData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load coordinator hierarchy"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  return {
    hierarchy,
    loading,
    error,
    loadHierarchy,
  };
}

/**
 * Hook for Lookup Data (Management Levels, Specializations, Available Managers)
 */
export function useCoordinatorLookups(organizationId?: number) {
  const [managementLevels, setManagementLevels] = useState<
    ManagementLevelDto[]
  >([]);
  const [specializations, setSpecializations] = useState<SpecializationDto[]>(
    []
  );
  const [availableManagers, setAvailableManagers] = useState<
    VolunteerCoordinatorDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadManagementLevels = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const levelsData =
        await volunteerCoordinatorService.getManagementLevels();
      setManagementLevels(levelsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load management levels"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const loadSpecializations = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const specializationsData =
        await volunteerCoordinatorService.getSpecializations();
      setSpecializations(specializationsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load specializations"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const loadAvailableManagers = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const managersData =
        await volunteerCoordinatorService.getAvailableManagers();
      setAvailableManagers(managersData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load available managers"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const loadAll = useCallback(async () => {
    await Promise.all([
      loadManagementLevels(),
      loadSpecializations(),
      loadAvailableManagers(),
    ]);
  }, [loadManagementLevels, loadSpecializations, loadAvailableManagers]);

  return {
    managementLevels,
    specializations,
    availableManagers,
    loading,
    error,
    loadManagementLevels,
    loadSpecializations,
    loadAvailableManagers,
    loadAll,
  };
}

/**
 * Combined hook that provides all coordinator functionality
 * This is the main hook to use for coordinator management
 */
export function useVolunteerCoordinators(organizationId?: number) {
  const coordinatorData = useVolunteerCoordinatorData(organizationId);
  const pagination = useVolunteerCoordinatorsPagination(organizationId);
  const operations = useCoordinatorOperations(organizationId);
  const stats = useCoordinatorStats(organizationId);
  const hierarchy = useCoordinatorHierarchy(organizationId);
  const lookups = useCoordinatorLookups(organizationId);

  return {
    // Data management
    data: coordinatorData.data,
    loading: coordinatorData.loading,
    error: coordinatorData.error,
    loadAll: coordinatorData.loadAll,
    loadById: coordinatorData.loadById,
    create: coordinatorData.create,
    update: coordinatorData.update,
    remove: coordinatorData.remove,

    // Pagination
    pagination,

    // Operations
    operations,

    // Stats
    stats,

    // Hierarchy
    hierarchy,

    // Lookups
    lookups,
  };
}
