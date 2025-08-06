import React, { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { publicContentService } from "../services/publicContentService";
import type {
  PublicEvent,
  PublicOrganization,
  PublicVolunteer,
  PublicPartner,
  PublicOrganizationFilters,
  PublicEventFilters,
  PublicPartnerFilters,
  PublicVolunteerFilters,
  PagedResult,
} from "../types/publicContent";

// State interface
interface PublicContentState {
  // Events
  events: PublicEvent[];
  eventDetail: PublicEvent | null;
  eventsLoading: boolean;
  eventDetailLoading: boolean;
  eventsError: string | null;

  // Organizations
  organizations: PublicOrganization[];
  organizationDetail: PublicOrganization | null;
  organizationsLoading: boolean;
  organizationDetailLoading: boolean;
  organizationsError: string | null;

  // Volunteers
  volunteers: PublicVolunteer[];
  volunteerDetail: PublicVolunteer | null;
  volunteersLoading: boolean;
  volunteerDetailLoading: boolean;
  volunteersError: string | null;

  // Partners
  partners: PublicPartner[];
  partnerDetail: PublicPartner | null;
  partnersLoading: boolean;
  partnerDetailLoading: boolean;
  partnersError: string | null;

  // Pagination & Filters
  pagination: {
    events: { page: number; totalPages: number; totalItems: number };
    organizations: { page: number; totalPages: number; totalItems: number };
    volunteers: { page: number; totalPages: number; totalItems: number };
    partners: { page: number; totalPages: number; totalItems: number };
  };
  filters: {
    events: PublicEventFilters;
    organizations: PublicOrganizationFilters;
    volunteers: PublicVolunteerFilters;
    partners: PublicPartnerFilters;
  };
}

// Action types
type PublicContentAction =
  // Events
  | { type: "SET_EVENTS_LOADING"; payload: boolean }
  | {
      type: "SET_EVENTS";
      payload: {
        data: PagedResult<PublicEvent>;
        filters: PublicOrganizationFilters;
      };
    }
  | { type: "SET_EVENTS_ERROR"; payload: string }
  | { type: "SET_EVENT_DETAIL_LOADING"; payload: boolean }
  | { type: "SET_EVENT_DETAIL"; payload: PublicEvent | null }
  // Organizations
  | { type: "SET_ORGANIZATIONS_LOADING"; payload: boolean }
  | {
      type: "SET_ORGANIZATIONS";
      payload: {
        data: PagedResult<PublicOrganization>;
        filters: PublicOrganizationFilters;
      };
    }
  | { type: "SET_ORGANIZATIONS_ERROR"; payload: string }
  | { type: "SET_ORGANIZATION_DETAIL_LOADING"; payload: boolean }
  | { type: "SET_ORGANIZATION_DETAIL"; payload: PublicOrganization | null }
  // Volunteers
  | { type: "SET_VOLUNTEERS_LOADING"; payload: boolean }
  | {
      type: "SET_VOLUNTEERS";
      payload: {
        data: PagedResult<PublicVolunteer>;
        filters: PublicOrganizationFilters;
      };
    }
  | { type: "SET_VOLUNTEERS_ERROR"; payload: string }
  | { type: "SET_VOLUNTEER_DETAIL_LOADING"; payload: boolean }
  | { type: "SET_VOLUNTEER_DETAIL"; payload: PublicVolunteer | null }
  // Partners
  | { type: "SET_PARTNERS_LOADING"; payload: boolean }
  | {
      type: "SET_PARTNERS";
      payload: {
        data: PagedResult<PublicPartner>;
        filters: PublicOrganizationFilters;
      };
    }
  | { type: "SET_PARTNERS_ERROR"; payload: string }
  | { type: "SET_PARTNER_DETAIL_LOADING"; payload: boolean }
  | { type: "SET_PARTNER_DETAIL"; payload: PublicPartner | null }
  // Common
  | { type: "CLEAR_ERRORS" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: PublicContentState = {
  // Events
  events: [],
  eventDetail: null,
  eventsLoading: false,
  eventDetailLoading: false,
  eventsError: null,

  // Organizations
  organizations: [],
  organizationDetail: null,
  organizationsLoading: false,
  organizationDetailLoading: false,
  organizationsError: null,

  // Volunteers
  volunteers: [],
  volunteerDetail: null,
  volunteersLoading: false,
  volunteerDetailLoading: false,
  volunteersError: null,

  // Partners
  partners: [],
  partnerDetail: null,
  partnersLoading: false,
  partnerDetailLoading: false,
  partnersError: null,

  // Pagination & Filters
  pagination: {
    events: { page: 1, totalPages: 0, totalItems: 0 },
    organizations: { page: 1, totalPages: 0, totalItems: 0 },
    volunteers: { page: 1, totalPages: 0, totalItems: 0 },
    partners: { page: 1, totalPages: 0, totalItems: 0 },
  },
  filters: {
    events: { page: 1, size: 12 },
    organizations: { page: 1, size: 12 },
    volunteers: { page: 1, size: 12 },
    partners: { page: 1, size: 12 },
  },
};

// Reducer
function publicContentReducer(
  state: PublicContentState,
  action: PublicContentAction
): PublicContentState {
  switch (action.type) {
    // Events
    case "SET_EVENTS_LOADING":
      return {
        ...state,
        eventsLoading: action.payload,
        eventsError: action.payload ? null : state.eventsError,
      };
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload.data.items,
        eventsLoading: false,
        eventsError: null,
        pagination: {
          ...state.pagination,
          events: {
            page: action.payload.data.pageNumber,
            totalPages: action.payload.data.totalPages,
            totalItems: action.payload.data.totalCount,
          },
        },
        filters: { ...state.filters, events: action.payload.filters },
      };
    case "SET_EVENTS_ERROR":
      return { ...state, eventsLoading: false, eventsError: action.payload };
    case "SET_EVENT_DETAIL_LOADING":
      return { ...state, eventDetailLoading: action.payload };
    case "SET_EVENT_DETAIL":
      return {
        ...state,
        eventDetail: action.payload,
        eventDetailLoading: false,
      };

    // Organizations
    case "SET_ORGANIZATIONS_LOADING":
      return {
        ...state,
        organizationsLoading: action.payload,
        organizationsError: action.payload ? null : state.organizationsError,
      };
    case "SET_ORGANIZATIONS":
      return {
        ...state,
        organizations: action.payload.data.items,
        organizationsLoading: false,
        organizationsError: null,
        pagination: {
          ...state.pagination,
          organizations: {
            page: action.payload.data.pageNumber,
            totalPages: action.payload.data.totalPages,
            totalItems: action.payload.data.totalCount,
          },
        },
        filters: { ...state.filters, organizations: action.payload.filters },
      };
    case "SET_ORGANIZATIONS_ERROR":
      return {
        ...state,
        organizationsLoading: false,
        organizationsError: action.payload,
      };
    case "SET_ORGANIZATION_DETAIL_LOADING":
      return { ...state, organizationDetailLoading: action.payload };
    case "SET_ORGANIZATION_DETAIL":
      return {
        ...state,
        organizationDetail: action.payload,
        organizationDetailLoading: false,
      };

    // Volunteers
    case "SET_VOLUNTEERS_LOADING":
      return {
        ...state,
        volunteersLoading: action.payload,
        volunteersError: action.payload ? null : state.volunteersError,
      };
    case "SET_VOLUNTEERS":
      return {
        ...state,
        volunteers: action.payload.data.items,
        volunteersLoading: false,
        volunteersError: null,
        pagination: {
          ...state.pagination,
          volunteers: {
            page: action.payload.data.pageNumber,
            totalPages: action.payload.data.totalPages,
            totalItems: action.payload.data.totalCount,
          },
        },
        filters: { ...state.filters, volunteers: action.payload.filters },
      };
    case "SET_VOLUNTEERS_ERROR":
      return {
        ...state,
        volunteersLoading: false,
        volunteersError: action.payload,
      };
    case "SET_VOLUNTEER_DETAIL_LOADING":
      return { ...state, volunteerDetailLoading: action.payload };
    case "SET_VOLUNTEER_DETAIL":
      return {
        ...state,
        volunteerDetail: action.payload,
        volunteerDetailLoading: false,
      };

    // Partners
    case "SET_PARTNERS_LOADING":
      return {
        ...state,
        partnersLoading: action.payload,
        partnersError: action.payload ? null : state.partnersError,
      };
    case "SET_PARTNERS":
      return {
        ...state,
        partners: action.payload.data.items,
        partnersLoading: false,
        partnersError: null,
        pagination: {
          ...state.pagination,
          partners: {
            page: action.payload.data.pageNumber,
            totalPages: action.payload.data.totalPages,
            totalItems: action.payload.data.totalCount,
          },
        },
        filters: { ...state.filters, partners: action.payload.filters },
      };
    case "SET_PARTNERS_ERROR":
      return {
        ...state,
        partnersLoading: false,
        partnersError: action.payload,
      };
    case "SET_PARTNER_DETAIL_LOADING":
      return { ...state, partnerDetailLoading: action.payload };
    case "SET_PARTNER_DETAIL":
      return {
        ...state,
        partnerDetail: action.payload,
        partnerDetailLoading: false,
      };

    // Common
    case "CLEAR_ERRORS":
      return {
        ...state,
        eventsError: null,
        organizationsError: null,
        volunteersError: null,
        partnersError: null,
      };
    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

// Context interface
interface PublicContentContextType extends PublicContentState {
  // Events
  loadEvents: (filters?: Partial<PublicEventFilters>) => Promise<void>;
  loadEventDetail: (id: number) => Promise<void>;
  clearEventDetail: () => void;

  // Organizations
  loadOrganizations: (filters?: Partial<PublicEventFilters>) => Promise<void>;
  loadOrganizationDetail: (id: number) => Promise<void>;
  clearOrganizationDetail: () => void;

  // Volunteers
  loadVolunteers: (filters?: Partial<PublicEventFilters>) => Promise<void>;
  loadVolunteerDetail: (id: number) => Promise<void>;
  clearVolunteerDetail: () => void;

  // Partners
  loadPartners: (filters?: Partial<PublicEventFilters>) => Promise<void>;
  loadPartnerDetail: (id: number) => Promise<void>;
  clearPartnerDetail: () => void;

  // Common
  clearErrors: () => void;
  resetState: () => void;
}

// Create context
const PublicContentContext = createContext<PublicContentContextType | null>(
  null
);

// Provider component
interface PublicContentProviderProps {
  children: ReactNode;
}

export function PublicContentProvider({
  children,
}: PublicContentProviderProps) {
  const [state, dispatch] = useReducer(publicContentReducer, initialState);

  // Events
  const loadEvents = async (filters: Partial<PublicEventFilters> = {}) => {
    const mergedFilters = { ...state.filters.events, ...filters };
    dispatch({ type: "SET_EVENTS_LOADING", payload: true });

    try {
      const data = await publicContentService.getPublicEvents(mergedFilters);
      dispatch({
        type: "SET_EVENTS",
        payload: { data, filters: mergedFilters },
      });
    } catch (error) {
      dispatch({
        type: "SET_EVENTS_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load events",
      });
    }
  };

  const loadEventDetail = async (id: number) => {
    dispatch({ type: "SET_EVENT_DETAIL_LOADING", payload: true });

    try {
      const event = await publicContentService.getPublicEvent(id);
      dispatch({ type: "SET_EVENT_DETAIL", payload: event });
    } catch (error) {
      dispatch({ type: "SET_EVENT_DETAIL", payload: null });
    }
  };

  const clearEventDetail = () => {
    dispatch({ type: "SET_EVENT_DETAIL", payload: null });
  };

  // Organizations
  const loadOrganizations = async (
    filters: Partial<PublicEventFilters> = {}
  ) => {
    const mergedFilters = { ...state.filters.organizations, ...filters };
    dispatch({ type: "SET_ORGANIZATIONS_LOADING", payload: true });

    try {
      const data = await publicContentService.getPublicOrganizations(
        mergedFilters
      );
      dispatch({
        type: "SET_ORGANIZATIONS",
        payload: { data, filters: mergedFilters },
      });
    } catch (error) {
      dispatch({
        type: "SET_ORGANIZATIONS_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load organizations",
      });
    }
  };

  const loadOrganizationDetail = async (id: number) => {
    dispatch({ type: "SET_ORGANIZATION_DETAIL_LOADING", payload: true });

    try {
      const organization = await publicContentService.getPublicOrganization(id);
      dispatch({ type: "SET_ORGANIZATION_DETAIL", payload: organization });
    } catch (error) {
      dispatch({ type: "SET_ORGANIZATION_DETAIL", payload: null });
    }
  };

  const clearOrganizationDetail = () => {
    dispatch({ type: "SET_ORGANIZATION_DETAIL", payload: null });
  };

  // Volunteers
  const loadVolunteers = async (filters: Partial<PublicEventFilters> = {}) => {
    const mergedFilters = { ...state.filters.volunteers, ...filters };
    dispatch({ type: "SET_VOLUNTEERS_LOADING", payload: true });

    try {
      const data = await publicContentService.getPublicVolunteers(
        mergedFilters
      );
      dispatch({
        type: "SET_VOLUNTEERS",
        payload: { data, filters: mergedFilters },
      });
    } catch (error) {
      dispatch({
        type: "SET_VOLUNTEERS_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load volunteers",
      });
    }
  };

  const loadVolunteerDetail = async (id: number) => {
    dispatch({ type: "SET_VOLUNTEER_DETAIL_LOADING", payload: true });

    try {
      const volunteer = await publicContentService.getPublicVolunteer(id);
      dispatch({ type: "SET_VOLUNTEER_DETAIL", payload: volunteer });
    } catch (error) {
      dispatch({ type: "SET_VOLUNTEER_DETAIL", payload: null });
    }
  };

  const clearVolunteerDetail = () => {
    dispatch({ type: "SET_VOLUNTEER_DETAIL", payload: null });
  };

  // Partners
  const loadPartners = async (filters: Partial<PublicEventFilters> = {}) => {
    const mergedFilters = { ...state.filters.partners, ...filters };
    dispatch({ type: "SET_PARTNERS_LOADING", payload: true });

    try {
      const data = await publicContentService.getPublicPartners(mergedFilters);
      dispatch({
        type: "SET_PARTNERS",
        payload: { data, filters: mergedFilters },
      });
    } catch (error) {
      dispatch({
        type: "SET_PARTNERS_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load partners",
      });
    }
  };

  const loadPartnerDetail = async (id: number) => {
    dispatch({ type: "SET_PARTNER_DETAIL_LOADING", payload: true });

    try {
      const partner = await publicContentService.getPublicPartner(id);
      dispatch({ type: "SET_PARTNER_DETAIL", payload: partner });
    } catch (error) {
      dispatch({ type: "SET_PARTNER_DETAIL", payload: null });
    }
  };

  const clearPartnerDetail = () => {
    dispatch({ type: "SET_PARTNER_DETAIL", payload: null });
  };

  // Common
  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  const contextValue: PublicContentContextType = {
    ...state,

    // Events
    loadEvents,
    loadEventDetail,
    clearEventDetail,

    // Organizations
    loadOrganizations,
    loadOrganizationDetail,
    clearOrganizationDetail,

    // Volunteers
    loadVolunteers,
    loadVolunteerDetail,
    clearVolunteerDetail,

    // Partners
    loadPartners,
    loadPartnerDetail,
    clearPartnerDetail,

    // Common
    clearErrors,
    resetState,
  };

  return (
    <PublicContentContext.Provider value={contextValue}>
      {children}
    </PublicContentContext.Provider>
  );
}

// Hook to use context
export function usePublicContent() {
  const context = useContext(PublicContentContext);
  if (!context) {
    throw new Error(
      "usePublicContent must be used within a PublicContentProvider"
    );
  }
  return context;
}

// Specific hooks for individual content types (for backward compatibility)
export function usePublicEvents() {
  const {
    events,
    eventsLoading,
    eventsError,
    loadEvents,
    pagination,
    filters,
  } = usePublicContent();
  return {
    events,
    loading: eventsLoading,
    error: eventsError,
    loadEvents,
    pagination: pagination.events,
    filters: filters.events,
  };
}

export function usePublicEventDetail() {
  const { eventDetail, eventDetailLoading, loadEventDetail, clearEventDetail } =
    usePublicContent();
  return {
    event: eventDetail,
    loading: eventDetailLoading,
    loadEvent: loadEventDetail,
    clearEvent: clearEventDetail,
  };
}

export function usePublicOrganizations() {
  const {
    organizations,
    organizationsLoading,
    organizationsError,
    loadOrganizations,
    pagination,
    filters,
  } = usePublicContent();
  return {
    organizations,
    loading: organizationsLoading,
    error: organizationsError,
    loadOrganizations,
    pagination: pagination.organizations,
    filters: filters.organizations,
  };
}

export function usePublicOrganizationDetail() {
  const {
    organizationDetail,
    organizationDetailLoading,
    loadOrganizationDetail,
    clearOrganizationDetail,
  } = usePublicContent();
  return {
    organization: organizationDetail,
    loading: organizationDetailLoading,
    loadOrganization: loadOrganizationDetail,
    clearOrganization: clearOrganizationDetail,
  };
}

export function usePublicVolunteers() {
  const {
    volunteers,
    volunteersLoading,
    volunteersError,
    loadVolunteers,
    pagination,
    filters,
  } = usePublicContent();
  return {
    volunteers,
    loading: volunteersLoading,
    error: volunteersError,
    loadVolunteers,
    pagination: pagination.volunteers,
    filters: filters.volunteers,
  };
}

export function usePublicVolunteerDetail() {
  const {
    volunteerDetail,
    volunteerDetailLoading,
    loadVolunteerDetail,
    clearVolunteerDetail,
  } = usePublicContent();
  return {
    volunteer: volunteerDetail,
    loading: volunteerDetailLoading,
    loadVolunteer: loadVolunteerDetail,
    clearVolunteer: clearVolunteerDetail,
  };
}

export function usePublicPartners() {
  const {
    partners,
    partnersLoading,
    partnersError,
    loadPartners,
    pagination,
    filters,
  } = usePublicContent();
  return {
    partners,
    loading: partnersLoading,
    error: partnersError,
    loadPartners,
    pagination: pagination.partners,
    filters: filters.partners,
  };
}

export function usePublicPartnerDetail() {
  const {
    partnerDetail,
    partnerDetailLoading,
    loadPartnerDetail,
    clearPartnerDetail,
  } = usePublicContent();
  return {
    partner: partnerDetail,
    loading: partnerDetailLoading,
    loadPartner: loadPartnerDetail,
    clearPartner: clearPartnerDetail,
  };
}

/**
 * Unified PublicContentContext replaces all individual public hooks:
 * - usePublicEvents, usePublicEventDetail
 * - usePublicOrganizations, usePublicOrganizationDetail
 * - usePublicVolunteers, usePublicVolunteerDetail
 * - usePublicPartners, usePublicPartnerDetail
 *
 * Provides centralized state management for all public content
 * with consistent loading states, error handling, and pagination.
 */
