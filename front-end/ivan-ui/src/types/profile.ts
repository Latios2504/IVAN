export interface VolunteerProfile {
  id: number; // Match database INT
  userId: number; // Match database INT

  // Vietnamese-specific fields (align with database)
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;

  bio?: string;
  skills: string[];
  experience?: string;
  motivation?: string; // Added from database
  availability: string[];

  location: {
    city: string;
    state: string;
    country: string;
  };

  phoneNumber?: string;
  dateOfBirth?: string;

  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };

  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };

  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    volunteerTypes: string[];
  };

  // Performance tracking (align with database)
  volunteerHours: number;
  rating: number;
  ratingCount: number;
  isVerified: boolean;
  verifiedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface OrganizationProfile {
  id: number; // Match database INT
  userId: number; // Match database INT
  organizationName: string;
  description: string;
  website?: string;
  industry: string;
  foundedYear?: number;
  size: "small" | "medium" | "large" | "enterprise";
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  contactInfo: {
    phoneNumber?: string;
    email?: string;
  };
  verification: {
    isVerified: boolean;
    documents: string[];
    verificationDate?: string;
  };
  settings: {
    isPublic: boolean;
    allowDirectContact: boolean;
    autoApproveVolunteers: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CoordinatorProfile {
  id: number; // Match database INT
  userId: number; // Match database INT
  organizationId: number; // IMPORTANT: Coordinator belongs to ONE organization only

  bio?: string;
  skills: string[];
  experience?: string;
  responsibilities: string[]; // Vai trò và trách nhiệm

  location: {
    city: string;
    state: string;
    country: string;
  };

  phoneNumber?: string;

  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };

  // Performance tracking
  rating: number;
  ratingCount: number;

  // Organization relationship
  assignedBy: number; // Admin user ID who created this coordinator
  assignedAt: string;

  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfile {
  id: number; // Match database INT
  userId: number; // Match database INT
  organizationName: string;
  partnerType: "corporate" | "government" | "ngo" | "educational" | "other";
  description: string;
  website?: string;
  industry: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  contactInfo: {
    phoneNumber?: string;
    email?: string;
    contactPersonName?: string;
    contactPersonTitle?: string;
  };
  collaborationAreas: string[]; // Lĩnh vực hợp tác
  settings: {
    isPublic: boolean;
    allowDirectContact: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
