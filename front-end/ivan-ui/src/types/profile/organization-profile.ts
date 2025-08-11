// Organization Profile Management Types for IVAN
// Re-exports from unified profiles.ts to maintain compatibility

import type {
  OrganizationProfile,
  OrganizationProfileExtended,
  UpdateOrganizationProfileData,
} from "./profiles";

// Re-export main interfaces with alternate names for compatibility
export type OrganizationProfileData = OrganizationProfile;
export type OrganizationProfileDataExtended = OrganizationProfileExtended;
export type CreateOrganizationProfileData = UpdateOrganizationProfileData;

// Organization-specific filters and additional interfaces
export interface OrganizationProfileFilters {
  typeId?: number;
  province?: string;
  isVerified?: boolean;
  isActive?: boolean;
  establishedYearFrom?: number;
  establishedYearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  searchTerm?: string;
}

export interface OrganizationType {
  typeId: number;
  typeName: string;
  description?: string;
  isActive: boolean;
}

export interface OrganizationStats {
  totalOrganizations: number;
  verifiedOrganizations: number;
  activeOrganizations: number;
  pendingVerification: number;
  totalEvents: number;
  totalVolunteers: number;
  averageRating: number;
  monthlyGrowth: number;
}

export interface VerificationDocument {
  documentId: number;
  organizationId: number;
  documentType:
    | "business_license"
    | "tax_certificate"
    | "registration_certificate"
    | "other";
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface OrganizationVerificationData {
  organizationId: number;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy?: number;
  verifiedAt?: string;
  rejectionReason?: string;
  requiredDocuments: string[];
  submittedDocuments: VerificationDocument[];
}
