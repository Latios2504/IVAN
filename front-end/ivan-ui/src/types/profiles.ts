// Unified Profile Types for IVAN System
// This file contains common profile interfaces used across all user roles

export interface BaseProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile extends BaseProfile {
  volunteerId: number;
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
  verifiedBy?: number;
  lastActiveDate?: string;
  totalHoursVolunteered: number;
  skills: VolunteerSkill[];
}

export interface VolunteerSkill {
  skillId: number;
  skillName: string;
  category?: string;
  proficiencyLevel: "Cơ bản" | "Khá" | "Tốt" | "Xuất sắc";
  yearsOfExperience: number;
  description?: string;
}

export interface OrganizationProfile extends BaseProfile {
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
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  rating: number;
  ratingCount: number;
  totalEvents: number;
  totalVolunteers: number;
}

export interface PartnerProfile extends BaseProfile {
  partnerId: number;
  companyName: string;
  industryId: number;
  industryName?: string;
  taxCode?: string;
  businessLicense?: string;
  website?: string;
  description?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  rating: number;
  ratingCount: number;
  totalCollaborations: number;
}

export interface CoordinatorProfile extends BaseProfile {
  coordinatorId: number;
  organizationId: number;
  organizationName?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string;
  endDate?: string;
  salary?: number;
  managerId?: number;
  managerName?: string;
  notes?: string;
  createdBy: number;
  requestedBy: number;
}

export interface AdminProfile extends BaseProfile {
  // Admin uses the base profile with additional admin-specific fields
  lastLoginAt?: string;
  totalActionsPerformed?: number;
  adminLevel?: string;
  permissions?: string[];
}

// Union type for all profile types
export type UserProfile =
  | VolunteerProfile
  | OrganizationProfile
  | PartnerProfile
  | CoordinatorProfile
  | AdminProfile;

// Profile update interfaces
export interface UpdateVolunteerProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  avatar?: string;
}

export interface UpdateOrganizationProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
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
}

export interface UpdatePartnerProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
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
}

export interface UpdateCoordinatorProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  avatar?: string;
}

export interface UpdateAdminProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  avatar?: string;
}

// Profile statistics interfaces
export interface ProfileStats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalPartners: number;
  totalCoordinators: number;
  totalAdmins: number;
  verifiedProfiles: number;
  profileCompletionRate: number;
}

// Profile completion interface
export interface ProfileCompletion {
  totalFields: number;
  completedFields: number;
  completionPercentage: number;
  missingFields: string[];
  suggestions: string[];
}
