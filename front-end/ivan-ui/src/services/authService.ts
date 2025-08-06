import { apiClient } from "./apiClient";
import { ApiError } from "./errorHandler";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from "../types/auth";

// Backend API response types matching DTOs
interface LoginApiResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: number;
    email: string;
    roleName: string;
    roleId: number;
    isEmailVerified: boolean;
    lastLoginAt?: string;
  };
}

interface UserInfoApiResponse {
  userId: number;
  email: string;
  roleName: string;
  roleId: number;
  isEmailVerified: boolean;
  lastLoginAt?: string;
}

interface SuccessResponse {
  message: string;
}

class AuthService {
  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string; expiresAt: string }> {
    const response = await apiClient.post<LoginApiResponse>(
      "/authentication/login",
      credentials
    );

    if (!response.success || !response.data) {
      throw new ApiError(response.message || "Login failed", 401);
    }

    const { token, expiresAt, user: apiUser } = response.data;

    // Store token in API client
    apiClient.setToken(token);

    // Convert API user to frontend User type
    const user: User = this.mapApiUserToUser(apiUser);

    return { user, token, expiresAt };
  }
  async register(data: RegisterRequest): Promise<{ message: string }> {
    // Map frontend role to backend roleId
    const roleId = this.mapRoleToId(data.role);

    const registerPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.password, // Backend expects confirmPassword
      roleId: roleId,
    };

    const response = await apiClient.post<SuccessResponse>(
      "/authentication/register",
      registerPayload
    );

    if (!response.success) {
      throw new ApiError(response.message || "Registration failed", 400);
    }

    return { message: response.data?.message || "Registration successful" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/forgot-password",
      { email }
    );

    if (!response.success) {
      throw new ApiError(response.message || "Failed to send reset email", 400);
    }

    return { message: response.data?.message || "Reset email sent" };
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/reset-password",
      {
        email,
        resetCode,
        newPassword,
        confirmPassword: newPassword,
      }
    );

    if (!response.success) {
      throw new ApiError(response.message || "Password reset failed", 400);
    }

    return { message: response.data?.message || "Password reset successful" };
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/change-password",
      {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      }
    );

    if (!response.success) {
      throw new ApiError(response.message || "Password change failed", 400);
    }

    return {
      message: response.data?.message || "Password changed successfully",
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserInfoApiResponse>(
      "/authentication/me"
    );

    if (!response.success || !response.data) {
      throw new ApiError(response.message || "Failed to get user info", 401);
    }

    return this.mapApiUserToUser(response.data);
  }

  logout(): void {
    apiClient.setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  }

  setToken(token: string | null): void {
    apiClient.setToken(token);
  }
  private mapRoleToId(role: string): number {
    const roleMap: Record<string, number> = {
      admin: 1, // Admin
      organization: 2, // Tổ chức
      volunteer: 3, // Tình nguyện viên
      partner: 4, // Đối tác
      coordinator: 5, // Điều phối viên
    };
    return roleMap[role] || 3; // Default to volunteer
  }
  private mapIdToRole(roleId: number): UserRole {
    const idMap: Record<number, UserRole> = {
      1: "admin", // Admin
      2: "organization", // Tổ chức
      3: "volunteer", // Tình nguyện viên
      4: "partner", // Đối tác
      5: "coordinator", // Điều phối viên
    };
    return idMap[roleId] || "volunteer";
  }
  private mapApiUserToUser(apiUser: {
    userId: number;
    email: string;
    roleName: string;
    roleId: number;
    isEmailVerified: boolean;
    lastLoginAt?: string;
  }): User {
    return {
      id: apiUser.userId,
      email: apiUser.email,
      fullName: apiUser.email.split("@")[0], // Temporary until we have profile data
      role: this.mapIdToRole(apiUser.roleId),
      isActive: true,
      isEmailVerified: apiUser.isEmailVerified,
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: new Date().toISOString(),
      profile: undefined, // Will be loaded separately
    };
  }
}

export const authService = new AuthService();
