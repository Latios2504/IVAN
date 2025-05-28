export interface VolunteerProfile {
  id: string;
  userId: string;
  bio?: string;
  skills: string[];
  experience?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationProfile {
  id: string;
  userId: string;
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
