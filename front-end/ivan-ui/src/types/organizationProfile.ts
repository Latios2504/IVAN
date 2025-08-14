// Organization Profile API Types - Matching backend OrganizationProfileController

// Public DTOs for public endpoints
export interface PublicOrganizationDto {
  organizationId: number;
  organizationName: string;
  shortName?: string;
  typeName: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
  mission?: string;
  vision?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  totalEvents: number;
  totalVolunteers: number;
}

export interface PublicOrganizationFiltersDto {
  search?: string;
  typeId?: number;
  province?: string;
  isVerified?: boolean;
  page: number;
  size: number;
}

export interface OrganizationTypeDto {
  typeId: number;
  typeName: string;
  description?: string;
  isActive: boolean;
}

// Management DTOs for authenticated endpoints
export interface OrganizationProfileViewModel {
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

export interface CreateOrganizationProfileDto {
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

export interface UpdateOrganizationProfileDto {
  userId: number;
  organizationName: string;
  shortName?: string;
  typeId: number;
  businessLicense?: string;
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
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  logoUrl?: string;
  bannerUrl?: string;
  establishedYear?: number;
  taxCode?: string;
}

export interface ProfileCompletionDto {
  completionPercentage: number;
  missingFields: string[];
}
