// Organization Profile Management Types for IVAN

export interface OrganizationProfileData {
  organizationId: number;
  userId: number;
  organizationName: string;
  shortName?: string;
  typeId: number;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  description?: string;
  mission?: string;
  vision?: string;
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
  bannerUrl?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  rating?: number;
  ratingCount?: number;
  totalEvents?: number;
  totalVolunteers?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrganizationProfileData {
  userId: number;
  organizationName: string;
  shortName?: string;
  typeId: number;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  description?: string;
  mission?: string;
  vision?: string;
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
  bannerUrl?: string;
}

export interface UpdateOrganizationProfileData {
  organizationId: number;
  organizationName?: string;
  shortName?: string;
  typeId?: number;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  description?: string;
  mission?: string;
  vision?: string;
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
  bannerUrl?: string;
  isVerified?: boolean;
  verifiedBy?: number;
  isActive?: boolean;
}

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
  documentType: 'business_license' | 'tax_certificate' | 'registration_certificate' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface OrganizationVerificationData {
  organizationId: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: number;
  verifiedAt?: string;
  rejectionReason?: string;
  requiredDocuments: string[];
  submittedDocuments: VerificationDocument[];
}
