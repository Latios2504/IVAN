// Coordinator Request Types - Matching backend CoordinatorRequestsController
import type { PagedResultDto } from "./common";

// Core DTOs - Matching backend exactly
export interface CoordinatorRequestListItemDto {
  requestId: string;
  organizationId: number;
  candidateEmail: string;
  status: string;
  submittedAt: string; // ISO date string
}

// Request DTOs (for create/update operations) - Matching backend exactly
export interface CreateCoordinatorRequestDto {
  candidateEmail: string;
  fullName: string;
  position: string;
  department: string;
  responsibilities: string;
  hireDate: string; // ISO date string (DateOnly from backend)
  managerUserId?: number | null;
}

export interface UpdateCoordinatorRequestDto {
  action: string; // "APPROVE" | "REJECT"
  note?: string | null;
}

// Filter DTO for searching/filtering requests
export interface CoordinatorRequestFilterDto {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  status?: string | null; // Filter by status
  organizationId?: number | null;
  candidateEmail?: string | null;
  search?: string | null;
}

// Response DTOs
export interface CoordinatorRequestListResponseDto {
  requests: CoordinatorRequestListItemDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// Stats DTO for dashboard/analytics
export interface CoordinatorRequestStatsDto {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  thisMonthRequests: number;
  lastMonthRequests: number;
}

// Constants for request status
export const COORDINATOR_REQUEST_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type CoordinatorRequestStatus = typeof COORDINATOR_REQUEST_STATUS[keyof typeof COORDINATOR_REQUEST_STATUS];

// Constants for request actions
export const COORDINATOR_REQUEST_ACTION = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;

export type CoordinatorRequestAction = typeof COORDINATOR_REQUEST_ACTION[keyof typeof COORDINATOR_REQUEST_ACTION];

// Default filter values
export const DEFAULT_COORDINATOR_REQUEST_FILTER: CoordinatorRequestFilterDto = {
  pageNumber: 1,
  pageSize: 20,
  sortBy: "SubmittedAt",
  sortDirection: "desc",
};

// Validation helpers
export interface CoordinatorRequestValidationResult {
  isValid: boolean;
  errors: string[];
}

// Form state interfaces for UI
export interface CreateCoordinatorRequestFormData extends CreateCoordinatorRequestDto {
  // Additional UI-specific fields if needed
}

export interface UpdateCoordinatorRequestFormData extends UpdateCoordinatorRequestDto {
  // Additional UI-specific fields if needed
}

// API response wrapper types
export interface CoordinatorRequestApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Utility types for better type safety
export type CoordinatorRequestCreatePayload = Omit<CreateCoordinatorRequestDto, 'hireDate'> & {
  hireDate: Date | string;
};

export type CoordinatorRequestUpdatePayload = UpdateCoordinatorRequestDto;

// Export all types for easy importing
export type {
  CoordinatorRequestListItemDto as CoordinatorRequestItem,
  CreateCoordinatorRequestDto as CreateCoordinatorRequest,
  UpdateCoordinatorRequestDto as UpdateCoordinatorRequest,
  CoordinatorRequestFilterDto as CoordinatorRequestFilter,
};