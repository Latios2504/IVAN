// Backend-aligned Volunteer Coordinator DTOs for Organization Management

export interface VolunteerCoordinatorDto {
  coordinatorId: number;
  organizationId: number;
  organizationName: string;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  managementLevel: string;
  maxVolunteersManaged?: number;
  isActive: boolean;
  dateJoined?: string;
  lastActiveDate?: string;
  totalEventsManaged?: number;
  totalVolunteersManaged?: number;
  averageRating?: number;
  status: string;
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  workSchedule?: string;
  managerCoordinatorId?: number;
  managerCoordinatorName?: string;
  dateOfBirth?: string;
  address?: string;
  skills?: string;
  certifications?: string;
  languagesSpoken?: string;
  availabilityHours?: string;
  preferredEventTypes?: string;
  experience?: string;
  education?: string;
  profileImageUrl?: string;
  socialMediaLinks?: string;
  personalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateVolunteerCoordinatorDto {
  userId: number;
  specialization?: string;
  managementLevel: string;
  maxVolunteersManaged?: number;
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  workSchedule?: string;
  managerCoordinatorId?: number;
  skills?: string;
  certifications?: string;
  languagesSpoken?: string;
  availabilityHours?: string;
  preferredEventTypes?: string;
  experience?: string;
  education?: string;
  profileImageUrl?: string;
  socialMediaLinks?: string;
  personalNotes?: string;
}

export interface UpdateVolunteerCoordinatorDto {
  specialization?: string;
  managementLevel?: string;
  maxVolunteersManaged?: number;
  isActive?: boolean;
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  workSchedule?: string;
  managerCoordinatorId?: number;
  skills?: string;
  certifications?: string;
  languagesSpoken?: string;
  availabilityHours?: string;
  preferredEventTypes?: string;
  experience?: string;
  education?: string;
  profileImageUrl?: string;
  socialMediaLinks?: string;
  personalNotes?: string;
}

export interface VolunteerCoordinatorFilterDto {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  managementLevels?: string[];
  isActive?: boolean;
  specializations?: string[];
  minVolunteersManaged?: number;
  maxVolunteersManaged?: number;
  dateJoinedFrom?: string;
  dateJoinedTo?: string;
  managerCoordinatorId?: number;
  hasManagerOnly?: boolean;
}

export interface VolunteerCoordinatorStatsDto {
  totalCoordinators: number;
  activeCoordinators: number;
  inactiveCoordinators: number;
  seniorCoordinators: number;
  juniorCoordinators: number;
  coordinatorsWithManagers: number;
  totalEventsManaged: number;
  totalVolunteersManaged: number;
  averageVolunteersPerCoordinator: number;
  averageRating: number;
  coordinatorsJoinedThisMonth: number;
  mostActiveCoordinator?: string;
  topSpecializations: Array<{
    specialization: string;
    count: number;
  }>;
  managementLevelDistribution: Array<{
    level: string;
    count: number;
  }>;
}

export interface VolunteerCoordinatorHierarchyDto {
  coordinatorId: number;
  fullName: string;
  email: string;
  managementLevel: string;
  subordinates: VolunteerCoordinatorHierarchyDto[];
}

// Lookup DTOs
export interface ManagementLevelDto {
  levelId: number;
  levelName: string;
  description?: string;
}

export interface SpecializationDto {
  specializationId: number;
  specializationName: string;
  description?: string;
}

export interface CoordinatorCreationRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  specialization?: string;
  managementLevel?: string;
  organizationId?: number;
}
