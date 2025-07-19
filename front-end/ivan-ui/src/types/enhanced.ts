/**
 * Enhanced TypeScript type definitions for better type safety
 */

import { USER_ROLES } from './roleUtils';

// Strict type definitions
export type StrictUserRole = typeof USER_ROLES[keyof typeof USER_ROLES]['name'];
export type StrictUserRoleId = typeof USER_ROLES[keyof typeof USER_ROLES]['id'];

// Component prop types with strict validation
export interface UserManagementPageProps {
  initialFilters?: UserFilters;
  onUserSelect?: (user: UserListItem) => void;
}

export interface UserFilters {
  role: StrictUserRole | 'all';
  status: 'all' | 'active' | 'inactive' | 'unverified';
  searchTerm: string;
  dateRange?: string;
}

export interface UserListItem {
  id: number;
  email: string;
  fullName: string;
  role: StrictUserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  lastActivity: string;
  phone?: string;
  province?: string;
  age?: number;
  eventsParticipated?: number;
  eventsCreated?: number;
  totalCollaborations?: number;
  profile?: any;
}

// Utility function type definitions
export interface RoleUtilsInterface {
  mapRoleToId: (role: string) => number;
  mapIdToRole: (id: number) => string;
  getRoleDisplayName: (role: string) => string;
  getRoleDisplayNameById: (id: number) => string;
  isValidRoleId: (id: number) => boolean;
  isValidRoleName: (name: string) => boolean;
  getAllRoles: () => Array<{ id: number; name: string; displayName: string }>;
  getRolesForFilter: () => Array<{ value: string; label: string }>;
  mapApiRoleToFrontendRole: (roleName: string) => string;
}

export interface UserStatusUtilsInterface {
  getStatusOptions: () => Array<{ value: string; label: string }>;
  getStatusBadgeVariant: (isActive: boolean, isEmailVerified: boolean) => string;
  getStatusText: (isActive: boolean, isEmailVerified: boolean) => string;
}

// API response types
export interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserAccountListDto {
  userId: number;
  email: string;
  fullName: string;
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  province?: string;
  age?: number;
}

export interface UserAccountFilterDto {
  roleId?: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  context?: string;
  originalError?: Error;
}

// Component state types
export interface UserManagementState {
  users: UserListItem[];
  selectedUser: UserListItem | null;
  selectedUserId: number | null;
  isUserDetailsOpen: boolean;
  isCreateCoordinatorOpen: boolean;
  isLoading: boolean;
  filters: UserFilters;
}

// Table configuration types
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: (item: T) => boolean;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FormField {
  name: string;
  value: any;
  required?: boolean;
  validator?: (value: any) => ValidationResult;
}

// Performance monitoring types
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  lastRenderAt: Date;
  averageRenderTime: number;
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}