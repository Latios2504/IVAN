// Volunteer Profile API Types - Matching backend VolunteerProfileController

// Public DTOs for public endpoints
export interface PublicVolunteerDto {
  volunteerId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender?: string;
  avatar?: string;
  province?: string;
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
  totalHoursVolunteered: number;
  skills?: string;
  skillsList: PublicVolunteerSkillDto[];
}

export interface PublicVolunteerSkillDto {
  skillId: number;
  skillName: string;
  category?: string;
  proficiencyLevel: string;
  yearsOfExperience: number;
  description?: string;
}

export interface PublicVolunteerFiltersDto {
  search?: string;
  skillId?: number;
  university?: string;
  province?: string;
  isVerified?: boolean;
  page: number;
  size: number;
}

export interface SkillDto {
  skillId: number;
  skillName: string;
  category?: string;
  description?: string;
  isActive: boolean;
}

export interface VolunteerSkillDto {
  skillId: number;
  skillName: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  description?: string;
}

// Management DTOs for authenticated endpoints
export interface VolunteerProfileViewModel {
  volunteerId: number;
  userId: number;
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
  skills?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Navigation properties (from User)
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  address?: string;
  // Verification info
  verifiedByName?: string;
  // Related entities
  volunteerSkills?: VolunteerSkillDto[];
}

export interface CreateVolunteerProfileDto {
  userId: number;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  skills: VolunteerSkillDto[];
}

export interface UpdateVolunteerProfileDto {
  // UserProfile fields (Personal Information)
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
  emergencyContactRelation?: string;
  avatar?: string;
  // VolunteerProfile fields (Volunteer-specific Information)
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  Skills: VolunteerSkillDto[]; // Changed from 'skills' to 'Skills' to match backend
}
