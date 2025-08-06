import { eventService } from "@/services/eventService";
import { useData } from "@/hooks/useData";
import type {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventFilterDto,
  EventStatsDto,
  EventCategoryDto,
  EventStatusDto,
  PagedResultDto,
} from "@/types/event";

/**
 * Service adapter for Events to work with useData hook
 * Adapts the existing eventService to the useData service interface
 */
export const eventDataService = {
  /**
   * Get all events with pagination - adapted for useData
   */
  getAll: async (filters?: EventFilterDto): Promise<EventDto[]> => {
    const defaultFilters: EventFilterDto = {
      page: 1,
      size: 20,
      sortBy: "createdAt",
      sortDirection: "desc",
      ...filters,
    };

    const result = await eventService.getOrganizationEvents(defaultFilters);
    return result.items;
  },

  /**
   * Get paginated events - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: EventFilterDto
  ): Promise<PagedResultDto<EventDto>> => {
    const defaultFilters: EventFilterDto = {
      page: 1,
      size: 20,
      sortBy: "createdAt",
      sortDirection: "desc",
      ...filters,
    };

    return await eventService.getOrganizationEvents(defaultFilters);
  },

  /**
   * Get single event by ID - adapted for useData
   */
  getById: async (eventId: number | string): Promise<EventDto> => {
    const numericId =
      typeof eventId === "string" ? parseInt(eventId, 10) : eventId;
    return await eventService.getOrganizationEvent(numericId);
  },

  /**
   * Create new event - adapted for useData
   */
  create: async (data: CreateEventDto): Promise<EventDto> => {
    const eventId = await eventService.createEvent(data);
    // Return the created event by fetching it
    return await eventService.getOrganizationEvent(eventId);
  },

  /**
   * Update event - adapted for useData
   */
  update: async (
    id: number | string,
    data: UpdateEventDto
  ): Promise<EventDto> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    await eventService.updateEvent(numericId, data);
    // Return the updated event by fetching it
    return await eventService.getOrganizationEvent(numericId);
  },

  /**
   * Delete event - adapted for useData
   */
  delete: async (id: number | string): Promise<void> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return await eventService.deleteEvent(numericId);
  },
};

/**
 * Service for Event Stats - separate from CRUD operations
 */
export const eventStatsService = {
  getStats: async (): Promise<EventStatsDto> => {
    return await eventService.getOrganizationStats();
  },
};

/**
 * Service for Event Lookup Data - categories, statuses
 */
export const eventLookupService = {
  getCategories: async (): Promise<EventCategoryDto[]> => {
    return await eventService.getEventCategories();
  },

  getStatuses: async (): Promise<EventStatusDto[]> => {
    return await eventService.getEventStatuses();
  },
};

/**
 * Hook for Event data management using useData
 * This replaces the complex EventContext with a simple hook
 *
 * Usage:
 * const events = useEventData();
 *
 * useEffect(() => {
 *   events.loadAll();
 * }, []);
 *
 * return (
 *   <div>
 *     {events.loading && <Spinner />}
 *     {events.data.map(event => ...)}
 *     <button onClick={() => events.create(newEventData)}>Create Event</button>
 *   </div>
 * );
 */
export function useEventData() {
  return useData<EventDto, CreateEventDto, UpdateEventDto>(eventDataService, {
    successMessages: {
      create: "Tạo sự kiện thành công",
      update: "Cập nhật sự kiện thành công",
      delete: "Xóa sự kiện thành công",
    },
  });
}

/**
 * Hook for Event Pagination (for complex pagination scenarios)
 *
 * Usage:
 * const { data: events, loadAll, loading } = useEventPagination();
 *
 * const handleLoadPage = (page: number) => {
 *   loadAll({ page, size: 20 });
 * };
 */
export function useEventPagination() {
  const { loadAll, ...rest } = useData<PagedResultDto<EventDto>, never, never>({
    getAll: async (
      filters?: EventFilterDto
    ): Promise<PagedResultDto<EventDto>[]> => {
      const result = await eventDataService.getAllPaginated(filters);
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
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: EventFilterDto) => {
      // Custom function for loading with filters
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResultDto<EventDto>[]> => {
          const result = await eventDataService.getAllPaginated(filters);
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
      // This is a bit hacky, but works for the pagination use case
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for Event Stats
 */
export function useEventStats() {
  return useData<EventStatsDto, never, never>({
    getAll: async (): Promise<EventStatsDto[]> => {
      const stats = await eventStatsService.getStats();
      return [stats]; // Wrap in array since useData expects arrays
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
  });
}

/**
 * Hook for Event Categories
 */
export function useEventCategories() {
  return useData<EventCategoryDto, never, never>({
    getAll: eventLookupService.getCategories,
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });
}

/**
 * Hook for Event Statuses
 */
export function useEventStatuses() {
  return useData<EventStatusDto, never, never>({
    getAll: eventLookupService.getStatuses,
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });
}

/**
 * Helper selectors (similar to the original eventSelectors pattern)
 */
export const eventSelectors = {
  hasEvents: (events: EventDto[]) => events.length > 0,

  isFirstPage: (currentPage: number) => currentPage === 1,

  isLastPage: (currentPage: number, totalPages: number) =>
    currentPage >= totalPages,

  hasNextPage: (currentPage: number, totalPages: number) =>
    currentPage < totalPages,

  hasPrevPage: (currentPage: number) => currentPage > 1,

  getCategoryName: (categories: EventCategoryDto[], categoryId: number) =>
    categories.find((c) => c.categoryId === categoryId)?.categoryName ||
    "Unknown",

  getStatusName: (statuses: EventStatusDto[], statusId: number) =>
    statuses.find((s) => s.statusId === statusId)?.statusName || "Unknown",

  getEventById: (events: EventDto[], eventId: number) =>
    events.find((e) => e.eventId === eventId),

  hasActiveFilters: (filters: EventFilterDto) =>
    Object.keys(filters).some((key) => {
      if (["page", "size", "sortBy", "sortDirection"].includes(key))
        return false;
      const value = filters[key as keyof EventFilterDto];
      return value !== undefined && value !== null && value !== "";
    }),
};
