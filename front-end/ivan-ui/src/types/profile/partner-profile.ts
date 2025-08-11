// Partner Profile Management Types for IVAN
// Re-exports from unified profiles.ts to maintain compatibility

import type {
  PartnerProfile,
  PartnerProfileExtended,
  UpdatePartnerProfileData,
} from "./profiles";

// Re-export main interfaces with alternate names for compatibility
export type PartnerProfileData = PartnerProfile;
export type PartnerProfileDataExtended = PartnerProfileExtended;
export type CreatePartnerProfileData = UpdatePartnerProfileData;

// Partner-specific filters and additional interfaces
export interface PartnerProfileFilters {
  industryId?: number;
  province?: string;
  isVerified?: boolean;
  isActive?: boolean;
  ratingFrom?: number;
  ratingTo?: number;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PartnerIndustry {
  industryId: number;
  industryName: string;
  description?: string;
  isActive: boolean;
}

export interface PartnerStats {
  totalPartners: number;
  verifiedPartners: number;
  activePartners: number;
  pendingVerification: number;
  totalCollaborations: number;
  averageRating: number;
  monthlyGrowth: number;
}

export interface PartnerVerificationData {
  partnerId: number;
  verificationStatus: "verified" | "pending" | "rejected" | "under_review";
  verifiedBy?: number;
  verifiedAt?: string;
  requiredDocuments: string[];
  submittedDocuments: PartnerDocument[];
  verificationNotes?: string;
}

export interface PartnerDocument {
  documentId: number;
  partnerId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface PartnerCollaborationHistory {
  collaborationId: number;
  organizationId: number;
  organizationName: string;
  collaborationName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: "planning" | "active" | "completed" | "cancelled";
  budget?: number;
  currency?: string;
}
