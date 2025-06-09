// Base profile types matching backend DTOs
export interface UserProfile {
  profileId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  location?: Location;
  isProfileComplete: boolean;
}

export interface Location {
  addressLine1?: string;
  ward?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface VolunteerProfile extends UserProfile {
  // Volunteer-specific fields matching backend
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  // Availability
  availabilityNotes?: string;
  preferredVolunteerTypes?: string;

  // Experience and ranking
  totalVolunteerHours: number;
  volunteerRank: string;
  joinedDate: string;
  lastActiveDate?: string;

  // Preferences
  willingToTravel: boolean;
  hasTransportation: boolean;
  preferredWorkingHours?: string;
  languagesSpoken?: string;

  // Skills (from separate table)
  skills: string[];
}

export interface OrganizationProfile extends UserProfile {
  // Organization-specific fields matching backend
  organizationName: string;
  organizationType: string;
  organizationDescription?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;

  // Focus areas (from separate table)
  focusAreas: string[];

  // Verification
  isVerified: boolean;
  verificationDocuments: string[];
  verifiedAt?: string;

  // Settings
  isPublic: boolean;
  allowDirectContact: boolean;
  autoApproveVolunteers: boolean;
}

export interface CoordinatorProfile extends UserProfile {
  // Coordinator belongs to ONE organization only
  organizationId: number;

  // Coordinator-specific fields
  responsibilities: string[];
  departments: string[];
  managedEvents: number[]; // Event IDs they coordinate

  // Authorization level within organization
  canCreateEvents: boolean;
  canManageVolunteers: boolean;
  canViewReports: boolean;
  canManagePartners: boolean;
}

export interface PartnerProfile extends UserProfile {
  // Partner-specific fields matching backend
  companyName: string;
  industry: string;
  companyDescription?: string;
  website?: string;
  partnerType: string;

  // Partnership details
  partnershipInterests: string[];
  expectedPartnership?: string;
  donationHistory: string[];

  // Contact information
  contactPersonName?: string;
  contactPersonTitle?: string;

  // Verification
  isVerified: boolean;
  verificationDocuments: string[];
  verifiedAt?: string;
}
