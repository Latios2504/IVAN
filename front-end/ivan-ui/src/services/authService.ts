import { apiClient } from "./apiClient";
import type {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  ResetPasswordData,
} from "../types/auth";

interface LoginApiResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: number;
    firstName?: string;
    lastName?: string;
    email: string;
    roleId: number;
    isActive: boolean;
    emailVerified: boolean;
  };
}

interface SuccessResponse {
  message: string;
}

interface PasswordResetRequest {
  email: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserInfoResponse {
  userId: number;
  email: string;
  roleName: string;
  roleId: number;
  isEmailVerified: boolean;
  lastLoginAt?: string;
}

class AuthService {
  /**
   * Login user with email and password
   * Simplified with consistent error handling via ApiClient
   */
  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string; expiresAt: string }> {
    const response = await apiClient.post<LoginApiResponse>(
      "/authentication/login",
      credentials
    );

    const { token, expiresAt, user: apiUser } = response.data;

    // Store token in API client
    apiClient.setToken(token);

    // Convert API user to frontend User type
    const user: User = this.mapApiUserToUser(apiUser);

    return { user, token, expiresAt };
  }

  /**
   * Register new user
   * Simplified with consistent error handling via ApiClient
   */
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

    return response.data;
  }

  /**
   * Request password reset email
   * Simplified with consistent error handling via ApiClient
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/forgot-password",
      { email }
    );
    return response.data;
  }

  /**
   * Reset password with token
   * Simplified with consistent error handling via ApiClient
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/reset-password",
      {
        email: data.email,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
    );
    return response.data;
  }

  /**
   * Change password for authenticated user
   * Simplified with consistent error handling via ApiClient
   */
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<SuccessResponse>(
      "/authentication/change-password",
      data
    );
    return response.data;
  }

  /**
   * Get current user info
   * Simplified with consistent error handling via ApiClient
   */
  async getUserInfo(): Promise<User> {
    const response = await apiClient.get<UserInfoResponse>(
      "/authentication/me"
    );
    return this.mapUserInfoToUser(response.data);
  }

  /**
   * Get current user (alias for getUserInfo for compatibility)
   */
  async getCurrentUser(): Promise<User> {
    return this.getUserInfo();
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    apiClient.setToken(token);
  }

  /**
   * Logout user
   */
  logout(): void {
    apiClient.setToken(null);
  }

  /**
   * Map API user response to frontend User type
   */
  private mapApiUserToUser(apiUser: LoginApiResponse["user"]): User {
    return {
      id: apiUser.userId,
      email: apiUser.email,
      fullName: `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim(),
      role: this.mapIdToRole(apiUser.roleId),
      isActive: apiUser.isActive,
      isEmailVerified: apiUser.emailVerified,
      createdAt: new Date().toISOString(), // Default value since not provided
    };
  }

  /**
   * Map UserInfo response to frontend User type
   */
  private mapUserInfoToUser(userInfo: UserInfoResponse): User {
    return {
      id: userInfo.userId,
      email: userInfo.email,
      fullName: "", // UserInfo doesn't include firstName/lastName, so we'll leave it empty
      role: this.mapIdToRole(userInfo.roleId),
      isActive: true, // UserInfo doesn't include isActive, default to true
      isEmailVerified: userInfo.isEmailVerified,
      createdAt: new Date().toISOString(), // Default value since not provided
    };
  }

  /**
   * Map frontend role to backend roleId
   */
  private mapRoleToId(role: UserRole): number {
    const roleMap: Record<UserRole, number> = {
      volunteer: 1,
      organization: 2,
      partner: 3,
      coordinator: 4,
      admin: 5,
    };
    return roleMap[role];
  }

  /**
   * Map backend roleId to frontend role
   */
  private mapIdToRole(roleId: number): UserRole {
    const roleMap: Record<number, UserRole> = {
      1: "volunteer",
      2: "organization",
      3: "partner",
      4: "coordinator",
      5: "admin",
    };
    return roleMap[roleId] || "volunteer";
  }
}

export const authService = new AuthService();
export default authService;
