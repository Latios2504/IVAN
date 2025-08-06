import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  Registration,
  RegistrationFilters,
  RegistrationAnalytics,
  PagedResult,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  Event,
} from "../types/eventRegistration";
import { eventRegistrationService } from "../services/eventRegistrationService";

interface EventRegistrationState {
  // Data
  registrations: Registration[];
  currentRegistration: Registration | null;
  stats: RegistrationAnalytics | null;
  selectedEventId: number | null;

  // Pagination & Filtering
  filters: RegistrationFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // UI State
  loading: boolean;
  error: string | null;

  // Modal States
  modals: {
    detail: boolean;
    approve: boolean;
    reject: boolean;
    bulkActions: boolean;
  };

  // Selection
  selectedRegistrations: number[];
}

interface EventRegistrationContextType extends EventRegistrationState {
  // Registration Management
  loadRegistrations: (eventId: number) => Promise<void>;
  loadRegistrationById: (
    eventId: number,
    registrationId: number
  ) => Promise<void>;
  approveRegistration: (
    eventId: number,
    registrationId: number,
    request: ApproveRegistrationRequest
  ) => Promise<void>;
  rejectRegistration: (
    eventId: number,
    registrationId: number,
    request: RejectRegistrationRequest
  ) => Promise<void>;
  bulkApproveRegistrations: (
    eventId: number,
    registrationIds: number[],
    notes?: string
  ) => Promise<void>;
  bulkRejectRegistrations: (
    eventId: number,
    registrationIds: number[],
    reason: string
  ) => Promise<void>;

  // Stats & Analytics
  loadStats: (eventId: number) => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: Partial<RegistrationFilters>) => void;
  resetFilters: () => void;

  // Modal Management
  openRegistrationDetail: (registration: Registration) => void;
  openApprovalDialog: (registration: Registration) => void;
  openRejectionDialog: (registration: Registration) => void;
  openBulkActionsDialog: () => void;
  closeAllModals: () => void;

  // Selection Management
  toggleRegistrationSelection: (registrationId: number) => void;
  selectAllRegistrations: () => void;
  clearSelection: () => void;

  // Utility
  clearError: () => void;
  setSelectedEvent: (eventId: number | null) => void;
}

type EventRegistrationAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: { registrations: PagedResult<Registration> };
    }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_CURRENT_REGISTRATION"; payload: Registration | null }
  | { type: "SET_STATS"; payload: RegistrationAnalytics }
  | { type: "SET_FILTERS"; payload: Partial<RegistrationFilters> }
  | { type: "RESET_FILTERS" }
  | {
      type: "UPDATE_REGISTRATION";
      payload: { registrationId: number; updates: Partial<Registration> };
    }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_SELECTED_EVENT"; payload: number | null }
  | { type: "OPEN_MODAL"; payload: keyof EventRegistrationState["modals"] }
  | { type: "CLOSE_ALL_MODALS" }
  | { type: "TOGGLE_SELECTION"; payload: number }
  | { type: "SELECT_ALL" }
  | { type: "CLEAR_SELECTION" };

const defaultFilters: RegistrationFilters = {
  page: 1,
  size: 20,
  sortBy: "applicationDate",
  sortOrder: "desc",
};

const initialState: EventRegistrationState = {
  registrations: [],
  currentRegistration: null,
  stats: null,
  selectedEventId: null,
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 20,
  },
  loading: false,
  error: null,
  modals: {
    detail: false,
    approve: false,
    reject: false,
    bulkActions: false,
  },
  selectedRegistrations: [],
};

const eventRegistrationReducer = (
  state: EventRegistrationState,
  action: EventRegistrationAction
): EventRegistrationState => {
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
        registrations: action.payload.registrations.items,
        pagination: {
          currentPage: action.payload.registrations.page,
          totalPages: action.payload.registrations.totalPages,
          totalCount: action.payload.registrations.totalItems,
          pageSize: action.payload.registrations.size,
        },
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CURRENT_REGISTRATION":
      return {
        ...state,
        currentRegistration: action.payload,
      };

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
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

    case "UPDATE_REGISTRATION":
      return {
        ...state,
        registrations: state.registrations.map((registration) =>
          registration.registrationId === action.payload.registrationId
            ? { ...registration, ...action.payload.updates }
            : registration
        ),
        currentRegistration:
          state.currentRegistration?.registrationId ===
          action.payload.registrationId
            ? { ...state.currentRegistration, ...action.payload.updates }
            : state.currentRegistration,
      };

    case "SET_SELECTED_EVENT":
      return {
        ...state,
        selectedEventId: action.payload,
        registrations: [],
        selectedRegistrations: [],
        currentRegistration: null,
        stats: null,
      };

    case "OPEN_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true,
        },
      };

    case "CLOSE_ALL_MODALS":
      return {
        ...state,
        modals: {
          detail: false,
          approve: false,
          reject: false,
          bulkActions: false,
        },
      };

    case "TOGGLE_SELECTION":
      const isSelected = state.selectedRegistrations.includes(action.payload);
      return {
        ...state,
        selectedRegistrations: isSelected
          ? state.selectedRegistrations.filter((id) => id !== action.payload)
          : [...state.selectedRegistrations, action.payload],
      };

    case "SELECT_ALL":
      return {
        ...state,
        selectedRegistrations: state.registrations.map((r) => r.registrationId),
      };

    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedRegistrations: [],
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

const EventRegistrationContext = createContext<
  EventRegistrationContextType | undefined
>(undefined);

interface EventRegistrationProviderProps {
  children: ReactNode;
}

export const EventRegistrationProvider: React.FC<
  EventRegistrationProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(eventRegistrationReducer, initialState);

  // Registration Management Operations
  const loadRegistrations = async (eventId: number) => {
    try {
      dispatch({ type: "LOAD_START" });
      const registrations = await eventRegistrationService.getRegistrations(
        eventId,
        state.filters
      );
      dispatch({ type: "LOAD_SUCCESS", payload: { registrations } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load registrations";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  const loadRegistrationById = async (
    eventId: number,
    registrationId: number
  ) => {
    try {
      const registration = await eventRegistrationService.getRegistration(
        eventId,
        registrationId
      );
      dispatch({ type: "SET_CURRENT_REGISTRATION", payload: registration });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load registration";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  const approveRegistration = async (
    eventId: number,
    registrationId: number,
    request: ApproveRegistrationRequest
  ): Promise<void> => {
    try {
      const updatedRegistration =
        await eventRegistrationService.approveRegistration(
          eventId,
          registrationId,
          request
        );
      dispatch({
        type: "UPDATE_REGISTRATION",
        payload: { registrationId, updates: updatedRegistration },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve registration";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const rejectRegistration = async (
    eventId: number,
    registrationId: number,
    request: RejectRegistrationRequest
  ): Promise<void> => {
    try {
      const updatedRegistration =
        await eventRegistrationService.rejectRegistration(
          eventId,
          registrationId,
          request
        );
      dispatch({
        type: "UPDATE_REGISTRATION",
        payload: { registrationId, updates: updatedRegistration },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reject registration";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const bulkApproveRegistrations = async (
    eventId: number,
    registrationIds: number[],
    notes?: string
  ): Promise<void> => {
    try {
      await eventRegistrationService.bulkApproveRegistrations(
        eventId,
        registrationIds,
        notes
      );
      // Reload registrations to get updated data
      await loadRegistrations(eventId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve registrations";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const bulkRejectRegistrations = async (
    eventId: number,
    registrationIds: number[],
    reason: string
  ): Promise<void> => {
    try {
      await eventRegistrationService.bulkRejectRegistrations(
        eventId,
        registrationIds,
        reason
      );
      // Reload registrations to get updated data
      await loadRegistrations(eventId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reject registrations";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Stats & Analytics
  const loadStats = async (eventId: number) => {
    try {
      const stats = await eventRegistrationService.getRegistrationAnalytics(
        eventId
      );
      dispatch({ type: "SET_STATS", payload: stats });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load stats";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
    }
  };

  // Filters & Pagination
  const setFilters = (filters: Partial<RegistrationFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  // Modal Management
  const openRegistrationDetail = (registration: Registration) => {
    dispatch({ type: "SET_CURRENT_REGISTRATION", payload: registration });
    dispatch({ type: "OPEN_MODAL", payload: "detail" });
  };

  const openApprovalDialog = (registration: Registration) => {
    dispatch({ type: "SET_CURRENT_REGISTRATION", payload: registration });
    dispatch({ type: "OPEN_MODAL", payload: "approve" });
  };

  const openRejectionDialog = (registration: Registration) => {
    dispatch({ type: "SET_CURRENT_REGISTRATION", payload: registration });
    dispatch({ type: "OPEN_MODAL", payload: "reject" });
  };

  const openBulkActionsDialog = () => {
    dispatch({ type: "OPEN_MODAL", payload: "bulkActions" });
  };

  const closeAllModals = () => {
    dispatch({ type: "CLOSE_ALL_MODALS" });
  };

  // Selection Management
  const toggleRegistrationSelection = (registrationId: number) => {
    dispatch({ type: "TOGGLE_SELECTION", payload: registrationId });
  };

  const selectAllRegistrations = () => {
    dispatch({ type: "SELECT_ALL" });
  };

  const clearSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  // Utility
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setSelectedEvent = (eventId: number | null) => {
    dispatch({ type: "SET_SELECTED_EVENT", payload: eventId });
  };

  // Auto-load registrations when filters change (only if event is selected)
  useEffect(() => {
    if (state.selectedEventId) {
      loadRegistrations(state.selectedEventId);
    }
  }, [
    state.selectedEventId,
    state.filters.page,
    state.filters.size,
    state.filters.sortBy,
    state.filters.sortOrder,
    state.filters.status,
    state.filters.search,
  ]);

  const contextValue: EventRegistrationContextType = {
    ...state,
    loadRegistrations,
    loadRegistrationById,
    approveRegistration,
    rejectRegistration,
    bulkApproveRegistrations,
    bulkRejectRegistrations,
    loadStats,
    setFilters,
    resetFilters,
    openRegistrationDetail,
    openApprovalDialog,
    openRejectionDialog,
    openBulkActionsDialog,
    closeAllModals,
    toggleRegistrationSelection,
    selectAllRegistrations,
    clearSelection,
    clearError,
    setSelectedEvent,
  };

  return (
    <EventRegistrationContext.Provider value={contextValue}>
      {children}
    </EventRegistrationContext.Provider>
  );
};

export const useEventRegistration = (): EventRegistrationContextType => {
  const context = useContext(EventRegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useEventRegistration must be used within an EventRegistrationProvider"
    );
  }
  return context;
};

// Helper selectors (following your pattern)
export const eventRegistrationSelectors = {
  hasRegistrations: (registrations: Registration[]) => registrations.length > 0,
  isFirstPage: (pagination: EventRegistrationState["pagination"]) =>
    pagination.currentPage === 1,
  isLastPage: (pagination: EventRegistrationState["pagination"]) =>
    pagination.currentPage >= pagination.totalPages,
  hasNextPage: (pagination: EventRegistrationState["pagination"]) =>
    pagination.currentPage < pagination.totalPages,
  hasPrevPage: (pagination: EventRegistrationState["pagination"]) =>
    pagination.currentPage > 1,

  getRegistrationById: (
    registrations: Registration[],
    registrationId: number
  ) => registrations.find((r) => r.registrationId === registrationId),

  hasActiveFilters: (filters: RegistrationFilters) =>
    Object.keys(filters).some((key) => {
      if (["page", "size", "sortBy", "sortOrder"].includes(key)) return false;
      const value = filters[key as keyof RegistrationFilters];
      return value !== undefined && value !== null && value !== "";
    }),

  getPendingRegistrations: (registrations: Registration[]) =>
    registrations.filter((r) => r.statusName === "Pending"),

  getApprovedRegistrations: (registrations: Registration[]) =>
    registrations.filter((r) => r.statusName === "Approved"),

  getRejectedRegistrations: (registrations: Registration[]) =>
    registrations.filter((r) => r.statusName === "Rejected"),

  hasSelectedRegistrations: (selectedRegistrations: number[]) =>
    selectedRegistrations.length > 0,

  isAllSelected: (
    registrations: Registration[],
    selectedRegistrations: number[]
  ) =>
    registrations.length > 0 &&
    registrations.length === selectedRegistrations.length,
};
