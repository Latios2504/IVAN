import { eventRegistrationService } from "@/services/eventRegistrationService";
import { useData } from "@/hooks/useData";
import { useState, useCallback } from "react";
import type {
  Registration,
  RegistrationFilters,
  RegistrationAnalytics,
  PagedResult,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  Event,
} from "@/types/eventRegistration";

/**
 * Service adapter for Event Registrations to work with useData hook
 */
export const eventRegistrationDataService = {
  /**
   * Get all registrations for an event with pagination - adapted for useData
   */
  getAll: async (
    eventId: number,
    filters?: RegistrationFilters
  ): Promise<Registration[]> => {
    const defaultFilters: RegistrationFilters = {
      page: 1,
      size: 20,
      sortBy: "applicationDate",
      sortOrder: "desc",
      ...filters,
    };

    const result = await eventRegistrationService.getRegistrations(
      eventId,
      defaultFilters
    );
    return result.items;
  },

  /**
   * Get paginated registrations - for complex pagination scenarios
   */
  getAllPaginated: async (
    eventId: number,
    filters?: RegistrationFilters
  ): Promise<PagedResult<Registration>> => {
    const defaultFilters: RegistrationFilters = {
      page: 1,
      size: 20,
      sortBy: "applicationDate",
      sortOrder: "desc",
      ...filters,
    };

    return await eventRegistrationService.getRegistrations(
      eventId,
      defaultFilters
    );
  },

  /**
   * Get single registration by ID - adapted for useData
   */
  getById: async (
    eventId: number,
    registrationId: string | number
  ): Promise<Registration> => {
    const numericId =
      typeof registrationId === "string"
        ? parseInt(registrationId, 10)
        : registrationId;
    return await eventRegistrationService.getRegistration(eventId, numericId);
  },

  /**
   * Event registrations are typically not created through this interface
   */
  create: async (): Promise<Registration> => {
    throw new Error(
      "Event registrations are created by volunteers, not administrators"
    );
  },

  /**
   * Update registration (approve/reject) - adapted for useData
   */
  update: async (
    eventId: number,
    registrationId: number,
    updates: any
  ): Promise<Registration> => {
    // This is a simplified update - in reality we'd need specific approve/reject methods
    if (updates.action === "approve") {
      await eventRegistrationService.approveRegistration(
        eventId,
        registrationId,
        {
          notes: updates.notes || "",
        }
      );
    } else if (updates.action === "reject") {
      await eventRegistrationService.rejectRegistration(
        eventId,
        registrationId,
        {
          reason: updates.reason || "Not specified",
        }
      );
    }

    // Return updated registration
    return await eventRegistrationService.getRegistration(
      eventId,
      registrationId
    );
  },

  /**
   * Event registrations are typically not deleted, but we can provide this for completeness
   */
  delete: async (): Promise<void> => {
    throw new Error("Event registrations cannot be deleted");
  },
};

/**
 * Enhanced service for registration-specific operations
 */
export const eventRegistrationOperations = {
  /**
   * Approve a registration
   */
  approveRegistration: async (
    eventId: number,
    registrationId: number,
    request: ApproveRegistrationRequest
  ): Promise<Registration> => {
    return await eventRegistrationService.approveRegistration(
      eventId,
      registrationId,
      request
    );
  },

  /**
   * Reject a registration
   */
  rejectRegistration: async (
    eventId: number,
    registrationId: number,
    request: RejectRegistrationRequest
  ): Promise<Registration> => {
    return await eventRegistrationService.rejectRegistration(
      eventId,
      registrationId,
      request
    );
  },

  /**
   * Bulk approve registrations
   */
  bulkApproveRegistrations: async (
    eventId: number,
    registrationIds: number[],
    notes?: string
  ): Promise<Registration[]> => {
    return await eventRegistrationService.bulkApproveRegistrations(
      eventId,
      registrationIds,
      notes
    );
  },

  /**
   * Bulk reject registrations
   */
  bulkRejectRegistrations: async (
    eventId: number,
    registrationIds: number[],
    reason: string
  ): Promise<Registration[]> => {
    return await eventRegistrationService.bulkRejectRegistrations(
      eventId,
      registrationIds,
      reason
    );
  },

  /**
   * Get registration analytics/stats
   */
  getRegistrationStats: async (
    eventId: number
  ): Promise<RegistrationAnalytics> => {
    return await eventRegistrationService.getRegistrationAnalytics(eventId);
  },
};

/**
 * Hook for Event Registrations data management using useData
 * This replaces the complex EventRegistrationContext
 *
 * Usage:
 * const registrations = useEventRegistrationData(eventId);
 *
 * useEffect(() => {
 *   registrations.loadAll();
 * }, [eventId]);
 */
export function useEventRegistrationData(eventId?: number) {
  const baseHook = useData<Registration, never, any>(
    eventId
      ? {
          getAll: (filters?: RegistrationFilters) =>
            eventRegistrationDataService.getAll(eventId, filters),
          getById: (registrationId: string | number) =>
            eventRegistrationDataService.getById(eventId, registrationId),
          create: eventRegistrationDataService.create,
          update: (registrationId: string | number, updates: any) => {
            const numericId =
              typeof registrationId === "string"
                ? parseInt(registrationId, 10)
                : registrationId;
            return eventRegistrationDataService.update(
              eventId,
              numericId,
              updates
            );
          },
          delete: eventRegistrationDataService.delete,
        }
      : {
          getAll: async () => [],
          getById: async () => ({} as Registration),
          create: eventRegistrationDataService.create,
          update: async () => ({} as Registration),
          delete: eventRegistrationDataService.delete,
        }
  );

  return baseHook;
}

/**
 * Hook for Event Registrations Pagination
 */
export function useEventRegistrationsPagination(eventId?: number) {
  const { loadAll, ...rest } = useData<PagedResult<Registration>, never, never>(
    eventId
      ? {
          getAll: async (
            filters?: RegistrationFilters
          ): Promise<PagedResult<Registration>[]> => {
            const result = await eventRegistrationDataService.getAllPaginated(
              eventId,
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
    loadWithFilters: (filters?: RegistrationFilters) => {
      if (!eventId) return Promise.resolve();

      const serviceWithFilters = {
        getAll: async (): Promise<PagedResult<Registration>[]> => {
          const result = await eventRegistrationDataService.getAllPaginated(
            eventId,
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
 * Hook for Registration Operations (approve, reject, bulk operations)
 * This handles the complex business logic operations
 */
export function useRegistrationOperations(eventId?: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveRegistration = useCallback(
    async (registrationId: number, request: ApproveRegistrationRequest) => {
      if (!eventId) return;

      setLoading(true);
      setError(null);
      try {
        await eventRegistrationOperations.approveRegistration(
          eventId,
          registrationId,
          request
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to approve registration"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const rejectRegistration = useCallback(
    async (registrationId: number, request: RejectRegistrationRequest) => {
      if (!eventId) return;

      setLoading(true);
      setError(null);
      try {
        await eventRegistrationOperations.rejectRegistration(
          eventId,
          registrationId,
          request
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to reject registration"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const bulkApproveRegistrations = useCallback(
    async (registrationIds: number[], notes?: string) => {
      if (!eventId) return;

      setLoading(true);
      setError(null);
      try {
        await eventRegistrationOperations.bulkApproveRegistrations(
          eventId,
          registrationIds,
          notes
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to bulk approve registrations"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const bulkRejectRegistrations = useCallback(
    async (registrationIds: number[], reason: string) => {
      if (!eventId) return;

      setLoading(true);
      setError(null);
      try {
        await eventRegistrationOperations.bulkRejectRegistrations(
          eventId,
          registrationIds,
          reason
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to bulk reject registrations"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    approveRegistration,
    rejectRegistration,
    bulkApproveRegistrations,
    bulkRejectRegistrations,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook for Registration Analytics/Stats
 */
export function useRegistrationStats(eventId?: number) {
  const [stats, setStats] = useState<RegistrationAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const analytics = await eventRegistrationOperations.getRegistrationStats(
        eventId
      );
      setStats(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return {
    stats,
    loading,
    error,
    loadStats,
  };
}

/**
 * Combined hook that provides all registration functionality
 * This is the main hook that should replace EventRegistrationContext usage
 */
export function useEventRegistrations(eventId?: number) {
  const registrationData = useEventRegistrationData(eventId);
  const paginationData = useEventRegistrationsPagination(eventId);
  const operations = useRegistrationOperations(eventId);
  const stats = useRegistrationStats(eventId);

  return {
    // Data management
    ...registrationData,

    // Pagination
    pagination: paginationData,

    // Operations
    operations,

    // Stats
    stats,
  };
}
