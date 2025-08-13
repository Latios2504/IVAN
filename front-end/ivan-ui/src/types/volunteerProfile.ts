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

// Management DTOs for authenticated endpoints
export interface VolunteerProfileViewModel {
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
  nationalId?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  studentId?: string;
  occupation?: string;
  workplace?: string;
  motivation?: string;
  experience?: string;
  skills?: string;
  availability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  volunteerHours?: number;
  rating?: number;
  ratingCount?: number;
  isVerified?: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  totalHoursVolunteered?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVolunteerProfileDto {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  studentId?: string;
  occupation?: string;
  workplace?: string;
  motivation?: string;
  experience?: string;
  skills?: string;
  availability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  avatar?: string;
}

export interface UpdateVolunteerProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  studentId?: string;
  occupation?: string;
  workplace?: string;
  motivation?: string;
  experience?: string;
  skills?: string;
  availability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  avatar?: string;
}
