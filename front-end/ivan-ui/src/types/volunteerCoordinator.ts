// Volunteer Coordinator API Types - Matching backend VolunteerCoordinatorController

// Core DTOs
export interface VolunteerCoordinatorDto {
  coordinatorId: number;
  userId: number;
  organizationId: number;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string; // DateOnly in C# -> string in TS
  endDate?: string;
  salary?: number;
  managerId?: number;
  isActive?: boolean;
  notes?: string;
  createdBy: number;
  requestedBy: number;
  createdAt?: string;
  updatedAt?: string;

  // Navigation properties
  user?: UserInformationDto;
  organizationName?: string;
  manager?: UserInformationDto;
  createdByUser?: UserInformationDto;
}

export interface UserInformationDto {
  userId: number;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface CreateVolunteerCoordinatorDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string; // DateOnly in C# -> string in TS
  salary?: number;
  managerId?: number;
  notes?: string;
}

export interface UpdateVolunteerCoordinatorDto {
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string;
  endDate?: string;
  salary?: number;
  managerId?: number;
  isActive?: boolean;
  notes?: string;
}

export interface VolunteerCoordinatorFilterDto {
  page: number;
  size: number;
  search?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
  managerId?: number;
  sortBy: string;
  sortOrder: string;
}

export interface VolunteerCoordinatorStatsDto {
  totalCoordinators: number;
  activeCoordinators: number;
  inactiveCoordinators: number;
  departmentStats: DepartmentStatsDto[];
  availablePositions: string[];
  availableDepartments: string[];
}

export interface DepartmentStatsDto {
  department: string;
  count: number;
}

export interface VolunteerCoordinatorListResponseDto {
  coordinators: VolunteerCoordinatorDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// Additional types for management levels and specializations
export interface ManagementLevelDto {
  id: number;
  name: string;
  description?: string;
}

export interface SpecializationDto {
  id: number;
  name: string;
  description?: string;
}

// Default filter values
export const DEFAULT_COORDINATOR_FILTER: VolunteerCoordinatorFilterDto = {
  page: 1,
  size: 20,
  sortBy: "CreatedAt",
  sortOrder: "desc",
};
