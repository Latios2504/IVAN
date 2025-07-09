// Public content interfaces matching backend DTOs

export interface PublicOrganization {
  organizationId: number;
  organizationName: string;
  shortName?: string;
  typeName: string;
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
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  totalEvents: number;
  totalVolunteers: number;
}

export interface PublicEvent {
  eventId: number;
  organizationId: number;
  organizationName: string;
  eventName: string;
  categoryName: string;
  statusName: string;
  description?: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location?: string;
  detailedAddress?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  maxVolunteers?: number;
  minVolunteers: number;
  currentVolunteers: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number;
  registrationCount: number;
  rating: number;
  ratingCount: number;
  eventType?: string;
}

export interface PublicPartner {
  partnerId: number;
  companyName: string;
  industryName: string;
  website?: string;
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

// Filter interfaces
export interface PublicOrganizationFilters {
  search?: string;
  typeId?: number;
  province?: string;
  isVerified?: boolean;
  page?: number;
  size?: number;
}

export interface PublicEventFilters {
  search?: string;
  categoryId?: number;
  organizationId?: number;
  province?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface PublicPartnerFilters {
  search?: string;
  industryId?: number;
  province?: string;
  isVerified?: boolean;
  page?: number;
  size?: number;
}

// Response interfaces
export interface PagedResult<T> {
  items: {
    $values: T[];
  };
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
}
