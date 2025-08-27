// Support Request Types - Based on backend DTOs
export interface SupportRequestCreateDto {
  categoryId: number;
  subject: string;
  description: string;
  priority?: string; // Default: "Medium"
  attachmentUrls?: string[];
}

export interface SupportRequestResponseDto {
  requestId: number;
  userId: number;
  userName: string;
  userEmail: string;
  categoryId: number;
  categoryName: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: number;
  assignedToName?: string;
  assignedDate?: string;
  resolution?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  resolvedDate?: string;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  attachmentUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  comments?: SupportRequestCommentDto[];
}

export interface SupportRequestUpdateDto {
  status?: string;
  assignedTo?: number;
  resolution?: string;
  priority?: string;
}

export interface SupportRequestCommentDto {
  commentId: number;
  userId: number;
  userName: string;
  comment: string;
  isInternal: boolean;
  attachmentUrls?: string[];
  createdAt?: string;
}

export interface SupportCategoryDto {
  categoryId: number;
  categoryName: string;
  description?: string;
  priority: string;
  expectedResponseTime: number;
  isActive: boolean;
}

export interface AddCommentRequest {
  comment: string;
  isInternal?: boolean;
  attachmentUrls?: string[];
}

// Support Request List Response
export interface SupportRequestListResponseDto {
  requests: SupportRequestResponseDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// Support Request Filter/Query Parameters
export interface SupportRequestFilterDto {
  status?: string;
  categoryId?: number;
  priority?: string;
  assignedTo?: number;
  userId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Support Request Statistics
export interface SupportRequestStatsDto {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  closedRequests: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionRating: number;
  requestsByCategory: CategoryStatsDto[];
  requestsByPriority: PriorityStatsDto[];
}

export interface CategoryStatsDto {
  categoryId: number;
  categoryName: string;
  count: number;
  percentage: number;
}

export interface PriorityStatsDto {
  priority: string;
  count: number;
  percentage: number;
}

// Constants
export const SUPPORT_REQUEST_STATUS = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const SUPPORT_REQUEST_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

export type SupportRequestStatus =
  (typeof SUPPORT_REQUEST_STATUS)[keyof typeof SUPPORT_REQUEST_STATUS];
export type SupportRequestPriority =
  (typeof SUPPORT_REQUEST_PRIORITY)[keyof typeof SUPPORT_REQUEST_PRIORITY];

// Default filter values
export const DEFAULT_SUPPORT_REQUEST_FILTER: SupportRequestFilterDto = {
  page: 1,
  size: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
};

// Form validation helpers
export interface SupportRequestFormErrors {
  categoryId?: string;
  subject?: string;
  description?: string;
  priority?: string;
  comment?: string;
}

// UI Display helpers
export interface SupportRequestDisplayDto extends SupportRequestResponseDto {
  statusColor: string;
  priorityColor: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  canEdit: boolean;
  canComment: boolean;
  canResolve: boolean;
}
