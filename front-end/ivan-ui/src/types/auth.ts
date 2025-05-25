export enum UserRole {
  VOLUNTEER = "volunteer",
  ORGANIZATION = "organization",
  ADMIN = "admin",
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  profile?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}
