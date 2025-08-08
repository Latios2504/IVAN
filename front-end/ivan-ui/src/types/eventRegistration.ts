import type { DateRange } from "./common";

// Simple registration type that matches backend RegistrationDTO
export interface SimpleRegistration {
  registrationId: number;
  eventId: number;
  volunteerId: number;
  statusName: string;
  applicationDate: string;
  fullName: string | null;
  additionalInfo?: string;
  motivationLetter?: string;
}

// Extended registration type for detailed views (when we have more data)
export interface Registration {
  registrationId: number;
  eventId: number;
  volunteerId: number;
  statusName: string;
  statusColor?: string;
  applicationDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  motivationLetter?: string;
  additionalInfo?: string;
  fullName?: string;

  // Optional extended volunteer information (for detailed views)
  volunteer?: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    skills: string[];
    experience: string;
    rating?: number;
    totalEventsJoined: number;
    totalHoursVolunteered: number;
  };

  // Performance Tracking
  performance?: {
    checkInTime?: string;
    checkOutTime?: string;
    actualHours?: number;
    performanceRating?: string;
    performanceNotes?: string;
    certificateIssued: boolean;
    rating?: number;
    review?: string;
  };
}

export interface RegistrationFilters {
  status?: string;
  search?: string;
  dateRange?: DateRange;
  sortBy: "applicationDate" | "volunteerName" | "status";
  sortOrder: "asc" | "desc";
  page: number;
  size: number;
}

export interface RegistrationAnalytics {
  totalRegistrations: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  registrationTrends: Array<{
    date: string;
    count: number;
  }>;
  topVolunteers: Array<{
    volunteerId: number;
    volunteerName: string;
    registrationCount: number;
    averageRating: number;
  }>;
}

export interface RegistrationLoadingState {
  registrations: boolean;
  analytics: boolean;
  approving: boolean;
  rejecting: boolean;
  bulkActions: boolean;
}

export interface EventRegistrationState {
  registrations: Registration[];
  selectedEvent: EventSummary | null;
  filters: RegistrationFilters;
  selectedRegistration: Registration | null;
  selectedRegistrations: number[];
  modals: {
    detail: boolean;
    approve: boolean;
    reject: boolean;
    bulkActions: boolean;
  };
  loading: RegistrationLoadingState;
  analytics: RegistrationAnalytics | null;
  totalRegistrations: number;
}

export type EventRegistrationAction =
  | {
      type: "SET_REGISTRATIONS";
      payload: { registrations: Registration[]; total: number };
    }
  | { type: "SET_SELECTED_EVENT"; payload: EventSummary | null }
  | { type: "SET_FILTERS"; payload: Partial<RegistrationFilters> }
  | { type: "SET_SELECTED_REGISTRATION"; payload: Registration | null }
  | { type: "SET_SELECTED_REGISTRATIONS"; payload: number[] }
  | {
      type: "SET_MODAL";
      payload: { modal: keyof EventRegistrationState["modals"]; open: boolean };
    }
  | {
      type: "SET_LOADING";
      payload: { key: keyof RegistrationLoadingState; loading: boolean };
    }
  | { type: "SET_ANALYTICS"; payload: RegistrationAnalytics | null }
  | { type: "UPDATE_REGISTRATION"; payload: Registration }
  | { type: "RESET_FILTERS" }
  | { type: "CLOSE_ALL_MODALS" };

export interface EventRegistrationContextType {
  state: EventRegistrationState;
  dispatch: React.Dispatch<EventRegistrationAction>;
  actions: {
    // Registration Management
    loadRegistrations: (
      eventId: number,
      filters?: RegistrationFilters
    ) => Promise<void>;
    approveRegistration: (
      registrationId: number,
      notes?: string
    ) => Promise<void>;
    rejectRegistration: (
      registrationId: number,
      reason: string
    ) => Promise<void>;
    bulkApprove: (registrationIds: number[], notes?: string) => Promise<void>;
    bulkReject: (registrationIds: number[], reason: string) => Promise<void>;

    // Modal Management
    openRegistrationDetail: (registration: Registration) => void;
    openApprovalDialog: (registration: Registration) => void;
    openRejectionDialog: (registration: Registration) => void;
    openBulkActionsDialog: (registrationIds: number[]) => void;
    closeAllModals: () => void;

    // Filter and Search
    updateFilters: (filters: Partial<RegistrationFilters>) => void;
    resetFilters: () => void;

    // Analytics
    loadRegistrationAnalytics: (eventId: number) => Promise<void>;

    // Selection
    setSelectedRegistrations: (registrationIds: number[]) => void;
  };
}

// Request/Response DTOs
export interface ApproveRegistrationRequest {
  notes?: string;
}

export interface RejectRegistrationRequest {
  reason: string;
}

// Event interface (assuming from existing types)
export interface EventSummary {
  eventId: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  statusName: string;
}
