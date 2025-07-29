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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicVolunteer {
  volunteerId: number;
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  volunteerHours: number;
  rating: number;
  ratingCount: number;
  isVerified: boolean;
  verifiedAt?: string;
  lastActiveDate?: string;
  totalHoursVolunteered: number;
  skills?: string;
  skillsList?: PublicVolunteerSkill[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicVolunteerSkill {
  skillId: number;
  skillName: string;
  category?: string;
  proficiencyLevel: string;
  yearsOfExperience: number;
  description?: string;
}

// Card component interfaces (for UI mapping)
export interface OrganizationCardData {
  id: number;
  name: string;
  description: string;
  type: string;
  location: string;
  website?: string;
  avatar?: string;
  logoUrl?: string;
  isVerified: boolean;
  rating?: number;
  ratingCount?: number;
  totalEvents?: number;
  totalVolunteers?: number;
  focusAreas?: string[];
}

export interface EventCardData {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxVolunteers?: number;
  currentVolunteers: number;
  organizationName: string;
  imageUrl?: string;
  status: string;
  category: string;
  volunteersRegistered?: number;
}

export interface PartnerCardData {
  id: number;
  name: string;
  description: string;
  industry: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  totalCollaborations: number;
  isVerified?: boolean;
}

export interface VolunteerCardData {
  id: number;
  name: string;
  fullName: string;
  description: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  location: string;
  avatar?: string;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  totalHoursVolunteered: number;
  skills: string[];
  availability?: string;
  lastActiveDate?: string;
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

export interface PublicVolunteerFilters {
  search?: string;
  skillId?: number;
  university?: string;
  province?: string;
  isVerified?: boolean;
  page?: number;
  size?: number;
}

// Response interfaces
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
}
