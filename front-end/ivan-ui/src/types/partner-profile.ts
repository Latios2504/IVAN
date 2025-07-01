// Partner Profile Management Types for IVAN

export interface PartnerProfileData {
  partnerId: number;
  userId: number;
  companyName: string;
  industryId: number;
  taxCode?: string;
  businessLicense?: string;
  website?: string;
  description?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  rating?: number;
  ratingCount?: number;
  totalCollaborations?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields from Industry table
  industryName?: string;
}

export interface CreatePartnerProfileData {
  userId: number;
  companyName: string;
  industryId: number;
  taxCode?: string;
  businessLicense?: string;
  website?: string;
  description?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

export interface UpdatePartnerProfileData {
  partnerId: number;
  companyName?: string;
  industryId?: number;
  taxCode?: string;
  businessLicense?: string;
  website?: string;
  description?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  isVerified?: boolean;
  verifiedBy?: number;
  isActive?: boolean;
}

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
