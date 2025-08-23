// Events API Types - Matching backend EventsController

export interface EventDto {
  eventId: number;
  organizationId: number;
  organizationName: string;
  eventName: string;
  categoryId: number;
  categoryName: string;
  statusId: number;
  statusName: string;
  shortDescription?: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location?: string;
  detailedAddress?: string;
  province?: string;
  district?: string;
  maxVolunteers?: number;
  minVolunteers: number;
  volunteersRegistered?: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured: boolean;
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilterDto {
  search?: string;
  organizationId?: number; // For organization filtering
  categoryIds?: number[];
  statusIds?: number[];
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  province?: string;
  district?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isActive?: boolean;
  minVolunteers?: number;
  maxVolunteers?: number;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

export interface CreateEventDto {
  organizationId: number; // Auto-set by backend
  eventName: string;
  categoryId: number;
  statusId: number;
  description?: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location?: string;
  detailedAddress?: string;
  province?: string;
  district?: string;
  maxVolunteers?: number;
  minVolunteers: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured: boolean;
  isUrgent: boolean;
}

export interface UpdateEventDto {
  eventName?: string;
  categoryId?: number;
  statusId?: number;
  description?: string;
  shortDescription?: string;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location?: string;
  detailedAddress?: string;
  province?: string;
  district?: string;
  maxVolunteers?: number;
  minVolunteers?: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
}

export interface EventCategoryDto {
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
}

export interface EventStatusDto {
  statusId: number;
  statusName: string;
  description?: string;
  isActive: boolean;
}

export interface CreateEventFromSupportRequestDto {
  supportRequestId: number;
  eventName: string;
  categoryId: number;
  statusId: number;
  shortDescription?: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location?: string;
  detailedAddress?: string;
  province?: string;
  district?: string;
  maxVolunteers?: number;
  minVolunteers: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured: boolean;
  isUrgent: boolean;
  linkToSupportRequest: boolean;
  notes?: string;
}

export interface UpdateEventStatusDto {
  status: string;
}
