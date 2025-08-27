// Volunteer Coordinator API Types

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
  salary?: number; // decimal in C# -> number in TS
  managerId?: number;
  isActive?: boolean;
  notes?: string;
  createdBy: number;
  requestedBy: number;
  createdAt?: string; // DateTime in C# -> string in TS
  updatedAt?: string; // DateTime in C# -> string in TS

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
  // User account information - Required fields
  email: string; // Required, EmailAddress validation
  
  // Personal information (UserProfile fields) - Required fields
  firstName: string; // Required, max 100 chars
  lastName: string; // Required, max 100 chars
  phoneNumber?: string; // Phone validation
  dateOfBirth?: string; // DateOnly in C# -> string in TS
  gender?: string; // Max 10 chars
  avatar?: string; // Max 500 chars
  address?: string; // Max 500 chars
  wardCommune?: string; // Max 100 chars
  district?: string; // Max 100 chars
  province?: string; // Max 100 chars
  postalCode?: string; // Max 20 chars
  emergencyContactName?: string; // Max 200 chars
  emergencyContactPhone?: string; // Phone validation
  
  // Employment information (VolunteerCoordinator fields)
  employeeId?: string; // Max 50 chars
  position?: string; // Max 100 chars
  department?: string; // Max 100 chars
  responsibilities?: string; // Max 1000 chars
  hireDate?: string; // DateOnly in C# -> string in TS
  salary?: number; // decimal in C# -> number in TS
  managerId?: number;
  notes?: string; // Max 1000 chars
}

export interface UpdateVolunteerCoordinatorDto {
  employeeId?: string; // Max 50 chars
  position?: string; // Max 100 chars
  department?: string; // Max 100 chars
  responsibilities?: string; // Max 1000 chars
  hireDate?: string; // DateOnly in C# -> string in TS
  endDate?: string; // DateOnly in C# -> string in TS
  salary?: number; // decimal in C# -> number in TS
  managerId?: number;
  isActive?: boolean;
  notes?: string; // Max 1000 chars
}

export interface VolunteerCoordinatorFilterDto {
  page: number;
  size: number;
  search?: string;
  organizationId?: number;
  department?: string; // Max 100 chars
  position?: string; // Max 100 chars
  isActive?: boolean;
  managerId?: number;
  hireDate?: string; // DateOnly in C# -> string in TS
  endDate?: string; // DateOnly in C# -> string in TS
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
  totalCoordinators: number;
  activeCoordinators: number;
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
