import { apiClient } from "./apiClient";
import { ApiError } from "../utils/errorHandler";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from "../../types/auth";

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
  private get api() {
    return apiClient;
  }

  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string; expiresAt: string }> {
    try {
      const response = await this.api.post<LoginApiResponse>(
        "/authentication/login",
        credentials
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Login failed", 401);
      }

      const { token, expiresAt, user: apiUser } = response.data;

      // Store token in API client
      this.api.setToken(token);

      // Convert API user to frontend User type
      const user: User = this.mapApiUserToUser(apiUser);

      return { user, token, expiresAt };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Login failed", 500);
    }
  }
  async register(data: RegisterRequest): Promise<{ message: string }> {
    try {
      // Map frontend role to backend roleId
      const roleId = this.mapRoleToId(data.role);

      const registerPayload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.password, // Backend expects confirmPassword
        roleId: roleId,
      };

      const response = await this.api.post<SuccessResponse>(
        "/authentication/register",
        registerPayload
      );

      if (!response.success) {
        throw new ApiError(response.message || "Registration failed", 400);
      }

      return { message: response.data?.message || "Registration successful" };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Registration failed", 500);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await this.api.post<SuccessResponse>(
        "/authentication/forgot-password",
        { email }
      );

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to send reset email",
          400
        );
      }

      return { message: response.data?.message || "Reset email sent" };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Forgot password failed", 500);
    }
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await this.api.post<SuccessResponse>(
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
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Password reset failed", 500);
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await this.api.post<SuccessResponse>(
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
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Password change failed", 500);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<UserInfoApiResponse>(
        "/authentication/me"
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to get user info", 401);
      }

      return this.mapApiUserToUser(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get user info", 500);
    }
  }

  logout(): void {
    this.api.setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  }

  private mapRoleToId(role: string): number {
    const roleMap: Record<string, number> = {
      volunteer: 1,
      organization: 2,
      partner: 3,
      coordinator: 4,
      admin: 5,
    };
    return roleMap[role] || 1;
  }

  private mapIdToRole(roleId: number): UserRole {
    const idMap: Record<number, UserRole> = {
      1: "volunteer",
      2: "organization",
      3: "partner",
      4: "coordinator",
      5: "admin",
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
