// User Management DTOs and Types
// Moved from userManagementService.ts for better organization

export interface UserAccountListDto {
  userId: number;
  email: string;
  fullName?: string; // Can be null from API
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  province?: string;
  age?: number;
  statusDisplay: string;
  verificationDisplay: string;
}

export interface UserAccountDetailDto {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  roleDescription?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profileId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  fullAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  age?: number;
  statusDisplay: string;
  verificationDisplay: string;
  statistics: UserStatisticsDto;
  // Role-specific profile data
  volunteerProfile?: VolunteerProfileData;
  organizationProfile?: OrganizationProfileData;
  partnerProfile?: PartnerProfileData;
  coordinatorProfile?: CoordinatorProfileData;
}

export interface VolunteerProfileData {
  volunteerId: number;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  volunteerHours: number;
  rating?: number;
  ratingCount: number;
  isVerified: boolean;
  verifiedAt?: string;
  totalHoursVolunteered: number;
  skills?: string;
  lastActiveDate?: string;
}

export interface OrganizationProfileData {
  organizationId: number;
  organizationName: string;
  shortName?: string;
  typeId: number;
  typeName?: string;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  description?: string;
  mission?: string;
  vision?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  employeeCount?: number;
  totalDonated?: number;
  isVerified: boolean;
  verifiedAt?: string;
  averageRating?: number;
  totalRatings: number;
  totalEventsCreated: number;
  activeEventsCount: number;
  totalVolunteersReached: number;
}

export interface PartnerProfileData {
  partnerId: number;
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  servicesOffered?: string;
  collaborationType?: string;
  totalDonated?: number;
  totalCollaborations: number;
  isVerified: boolean;
  verifiedAt?: string;
  averageRating?: number;
  totalRatings: number;
}

export interface CoordinatorProfileData {
  coordinatorId: number;
  specialization?: string;
  experience?: string;
  managementLevel?: string;
  assignedDate?: string;
  isActive: boolean;
  eventsCoordinated: number;
  totalVolunteersManaged: number;
  averageEventRating?: number;
  totalEventRatings: number;
}

export interface UserStatisticsDto {
  totalLogins: number;
  lastLoginDays: number;
  accountAgeInDays: number;
  isNewUser: boolean;
  activityScore: number;
}

export interface UserAccountFilterDto {
  email?: string;
  fullName?: string;
  roleName?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  province?: string;
  minAge?: number;
  maxAge?: number;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  sortBy?: "email" | "fullName" | "createdAt" | "lastLoginAt";
  sortDirection?: "ASC" | "DESC";
  page?: number;
  size?: number;
}

export interface UserAccountUpdateDto {
  userId: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  // Profile updates can be added here
}

export interface PagedResultDto<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CoordinatorCreationRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  specialization?: string;
  managementLevel?: string;
  organizationId?: number; // If creating for specific organization
}
