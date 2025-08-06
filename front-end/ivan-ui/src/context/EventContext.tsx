import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  EventDto,
  EventStatsDto,
  EventCategoryDto,
  EventStatusDto,
  EventFilterDto,
  PagedResultDto,
  CreateEventDto,
  UpdateEventDto,
} from "../types/event";
import { eventService } from "../services/eventService";
import { useAuth } from "./AuthContext";

interface EventState {
  // Data
  events: EventDto[];
  currentEvent: EventDto | null;
  stats: EventStatsDto | null;
  categories: EventCategoryDto[];
  statuses: EventStatusDto[];

  // Pagination & Filtering
  filters: EventFilterDto;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // UI State
  loading: boolean;
  error: string | null;
}

interface EventContextType extends EventState {
  // Event CRUD
  loadEvents: () => Promise<void>;
  loadEventById: (eventId: number) => Promise<void>;
  createEvent: (eventData: CreateEventDto) => Promise<number>;
  updateEvent: (eventId: number, eventData: UpdateEventDto) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;

  // Stats & Analytics
  loadStats: () => Promise<void>;

  // Lookup Data
  loadCategories: () => Promise<void>;
  loadStatuses: () => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: Partial<EventFilterDto>) => void;
  resetFilters: () => void;

  // Utility
  clearError: () => void;
  setCurrentEvent: (event: EventDto | null) => void;
}

type EventAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { events: PagedResultDto<EventDto> } }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_CURRENT_EVENT"; payload: EventDto | null }
  | { type: "SET_STATS"; payload: EventStatsDto }
  | { type: "SET_CATEGORIES"; payload: EventCategoryDto[] }
  | { type: "SET_STATUSES"; payload: EventStatusDto[] }
  | { type: "SET_FILTERS"; payload: Partial<EventFilterDto> }
  | { type: "RESET_FILTERS" }
  | { type: "ADD_EVENT"; payload: EventDto }
  | {
      type: "UPDATE_EVENT";
      payload: { eventId: number; updates: Partial<EventDto> };
    }
  | { type: "REMOVE_EVENT"; payload: number }
  | { type: "CLEAR_ERROR" };

const defaultFilters: EventFilterDto = {
  page: 1,
  size: 20,
  sortBy: "createdAt",
  sortDirection: "desc",
};

const initialState: EventState = {
  events: [],
  currentEvent: null,
  stats: null,
  categories: [],
  statuses: [],
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 20,
  },
  loading: false,
  error: null,
};

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        events: action.payload.events.items,
        pagination: {
          currentPage: action.payload.events.pageNumber,
          totalPages: Math.ceil(
            action.payload.events.totalCount / action.payload.events.pageSize
          ),
          totalCount: action.payload.events.totalCount,
          pageSize: action.payload.events.pageSize,
        },
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CURRENT_EVENT":
      return {
        ...state,
        currentEvent: action.payload,
      };

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };

    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };

    case "SET_STATUSES":
      return {
        ...state,
        statuses: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          pageSize: 20,
        },
      };

    case "ADD_EVENT":
      return {
        ...state,
        events: [action.payload, ...state.events],
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1,
        },
      };

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.eventId === action.payload.eventId
            ? { ...event, ...action.payload.updates }
            : event
        ),
        currentEvent:
          state.currentEvent?.eventId === action.payload.eventId
            ? { ...state.currentEvent, ...action.payload.updates }
            : state.currentEvent,
      };

    case "REMOVE_EVENT":
      return {
        ...state,
        events: state.events.filter(
          (event) => event.eventId !== action.payload
        ),
        currentEvent:
          state.currentEvent?.eventId === action.payload
            ? null
            : state.currentEvent,
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1),
        },
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Event CRUD Operations
  const loadEvents = async () => {
    // Only load events if user is authenticated and has organization role
    if (!isAuthenticated || user?.role !== "organization") {
      return;
    }

    try {
      dispatch({ type: "LOAD_START" });
      const events = await eventService.getOrganizationEvents(state.filters);
      dispatch({ type: "LOAD_SUCCESS", payload: { events } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load events";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  const loadEventById = async (eventId: number) => {
    try {
      dispatch({ type: "LOAD_START" });
      const event = await eventService.getOrganizationEvent(eventId);
      dispatch({ type: "SET_CURRENT_EVENT", payload: event });
      dispatch({ type: "LOAD_FAILURE", payload: "" }); // Clear loading
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load event";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  const createEvent = async (eventData: CreateEventDto): Promise<number> => {
    try {
      const eventId = await eventService.createEvent(eventData);
      // Reload events to get the new event
      await loadEvents();
      return eventId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create event";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const updateEvent = async (
    eventId: number,
    eventData: UpdateEventDto
  ): Promise<void> => {
    try {
      await eventService.updateEvent(eventId, eventData);
      dispatch({
        type: "UPDATE_EVENT",
        payload: { eventId, updates: eventData },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update event";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const deleteEvent = async (eventId: number): Promise<void> => {
    try {
      await eventService.deleteEvent(eventId);
      dispatch({ type: "REMOVE_EVENT", payload: eventId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete event";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Stats & Analytics
  const loadStats = async () => {
    // Only load stats if user is authenticated and has organization role
    if (!isAuthenticated || user?.role !== "organization") {
      return;
    }

    try {
      const stats = await eventService.getOrganizationStats();
      dispatch({ type: "SET_STATS", payload: stats });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load stats";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  // Lookup Data
  const loadCategories = async () => {
    try {
      const categories = await eventService.getEventCategories();
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadStatuses = async () => {
    try {
      const statuses = await eventService.getEventStatuses();
      dispatch({ type: "SET_STATUSES", payload: statuses });
    } catch (error) {
      console.error("Failed to load statuses:", error);
    }
  };

  // Filters & Pagination
  const setFilters = (filters: Partial<EventFilterDto>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  // Utility
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setCurrentEvent = (event: EventDto | null) => {
    dispatch({ type: "SET_CURRENT_EVENT", payload: event });
  };

  // Auto-load events when filters change and user is authenticated with Organization role
  useEffect(() => {
    if (isAuthenticated && user?.role === "organization") {
      loadEvents();
    }
  }, [
    isAuthenticated,
    user?.role,
    state.filters.page,
    state.filters.size,
    state.filters.sortBy,
    state.filters.sortDirection,
  ]);

  const contextValue: EventContextType = {
    ...state,
    loadEvents,
    loadEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    loadStats,
    loadCategories,
    loadStatuses,
    setFilters,
    resetFilters,
    clearError,
    setCurrentEvent,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

// Helper selectors (similar to your roleUtils pattern)
export const eventSelectors = {
  hasEvents: (events: EventDto[]) => events.length > 0,
  isFirstPage: (pagination: EventState["pagination"]) =>
    pagination.currentPage === 1,
  isLastPage: (pagination: EventState["pagination"]) =>
    pagination.currentPage >= pagination.totalPages,
  hasNextPage: (pagination: EventState["pagination"]) =>
    pagination.currentPage < pagination.totalPages,
  hasPrevPage: (pagination: EventState["pagination"]) =>
    pagination.currentPage > 1,

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
