// Partner Collaboration API Types - Matching backend PartnerCollaborationController

// View DTOs for displaying collaboration data
export interface CollaborationViewList {
  collaborationId: number;
  organizationId: number;
  organizationName: string;
  partnerId: number;
  partnerName: string;
  typeId: number;
  typeName: string;
  collaborationName: string;
  startDate: string; // DateOnly from backend
  endDate?: string; // DateOnly from backend
  status?: string;
  budget?: number;
  currency?: string;
  createdAt?: string; // DateTime from backend
  updatedAt?: string; // DateTime from backend
}

export interface CollaborationDetailDto {
  collaborationId: number;
  organizationId: number;
  organizationName: string;
  partnerId: number;
  partnerName: string;
  typeId: number;
  typeName: string;
  collaborationName: string;
  description?: string;
  objectives?: string;
  startDate: string; // DateOnly from backend
  endDate?: string; // DateOnly from backend
  status?: string;
  budget?: number;
  currency?: string;
  contractDocumentUrl?: string;
  createdAt?: string; // DateTime from backend
  updatedAt?: string; // DateTime from backend
}

// Create DTO for creating new collaborations
export interface PartnerCollaborationCreateDto {
  organizationId: number;
  partnerId: number;
  typeId: number;
  collaborationName: string;
  description?: string;
  objectives?: string;
  startDate: string; // DateOnly format: YYYY-MM-DD
  endDate?: string; // DateOnly format: YYYY-MM-DD
  status?: string;
  budget?: number;
  currency?: string;
  contractDocumentUrl?: string;
}

// Update DTO for updating existing collaborations
export interface PartnerCollaborationUpdateDto {
  collaborationName?: string;
  description?: string;
  objectives?: string;
  startDate?: string; // DateOnly format: YYYY-MM-DD
  endDate?: string; // DateOnly format: YYYY-MM-DD
  status?: string;
  budget?: number;
  currency?: string;
  contractDocumentUrl?: string;
}

// Lookup DTOs for dropdowns and selections
export interface CollaborationType {
  typeId: number;
  typeName: string;
  description?: string;
  isActive: boolean;
}

export interface Partner {
  partnerId: number;
  companyName: string;
  industryName?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  logoUrl?: string;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  totalCollaborations: number;
}

// Filter DTO for searching/filtering collaborations
export interface PartnerCollaborationFilterDto {
  organizationId?: number;
  partnerId?: number;
  typeId?: number;
  status?: string;
  startDateFrom?: string; // DateOnly format: YYYY-MM-DD
  startDateTo?: string; // DateOnly format: YYYY-MM-DD
  searchTerm?: string; // Search in collaboration name, description
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Constants for collaboration statuses
export const COLLABORATION_STATUSES = {
  NEGOTIATING: "Đang thương thảo",
  ACTIVE: "Đang hoạt động",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  PAUSED: "Tạm dừng",
} as const;

export type CollaborationStatus = typeof COLLABORATION_STATUSES[keyof typeof COLLABORATION_STATUSES];

// Constants for currencies
export const CURRENCIES = {
  VND: "VND",
  USD: "USD",
  EUR: "EUR",
} as const;

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];

// Default values for forms
export const DEFAULT_COLLABORATION_FILTER: PartnerCollaborationFilterDto = {
  page: 1,
  size: 10,
  sortBy: "createdAt",
  sortDirection: "desc",
};

export const DEFAULT_COLLABORATION_CREATE: Partial<PartnerCollaborationCreateDto> = {
  status: COLLABORATION_STATUSES.NEGOTIATING,
  currency: CURRENCIES.VND,
};