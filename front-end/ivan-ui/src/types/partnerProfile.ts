// Partner Profile API Types - Matching backend PartnerProfileController

// Public DTOs for public endpoints
export interface PublicPartnerDto {
  partnerId: number;
  companyName: string;
  industryName: string;
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

export interface PublicPartnerFiltersDto {
  search?: string;
  industryId?: number;
  province?: string;
  isVerified?: boolean;
  page: number;
  size: number;
}

export interface PartnerIndustryDto {
  industryId: number;
  industryName: string;
  description?: string;
  isActive: boolean;
}

// Management DTOs for authenticated endpoints
export interface PartnerProfileViewModel {
  partnerId: number;
  userId: number;
  companyName: string;
  industryId: number;
  industryName: string;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  linkedInPage?: string;
  facebookPage?: string;
  description?: string;
  services?: string;
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
  totalCollaborations?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePartnerProfileDto {
  userId: number;
  companyName: string;
  industryId: number;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  linkedInPage?: string;
  facebookPage?: string;
  description?: string;
  services?: string;
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

export interface UpdatePartnerProfileDto {
  companyName?: string;
  industryId?: number;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  linkedInPage?: string;
  facebookPage?: string;
  description?: string;
  services?: string;
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
