import { apiClient } from "./apiClient";
import type {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  ResetPasswordData,
  ChangePasswordRequest,
  ApiUser,
  LoginResponseDTO,
} from "../types/auth";

class AuthService {
  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string; expiresAt: string }> {
    const response = await apiClient.post<LoginResponseDTO>(
      "/Authentication/login",
      credentials
    );

    // ApiClient throws Error for failures, so we only get here on success
    const { token, expiresAt, user: apiUser } = response.data!;

    apiClient.setToken(token);
    const user: User = this.mapApiUserToUser(apiUser);

    return { user, token, expiresAt };
  }

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const roleId = this.mapRoleToId(data.role);
    const registerPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
      roleId: roleId,
    };

    const response = await apiClient.post<object>(
      "/Authentication/register",
      registerPayload
    );

    return { message: response.message };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<object>(
      "/Authentication/forgot-password",
      { email }
    );

    return { message: response.message };
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<object>(
      "/Authentication/reset-password",
      {
        email: data.email,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
    );

    return { message: response.message };
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<object>(
      "/Authentication/change-password",
      data
    );

    return { message: response.message };
  }

  async getUserInfo(): Promise<User> {
    const response = await apiClient.get<ApiUser>("/Authentication/me");

    return this.mapApiUserToUser(response.data!);
  }

  async getCurrentUser(): Promise<User> {
    return this.getUserInfo();
  }

  setToken(token: string | null): void {
    apiClient.setToken(token);
  }

  logout(): void {
    apiClient.setToken(null);
  }

  // Check if user has the required role
  hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  // Check if user is an organization with profile
  isOrganizationWithProfile(user: User | null): boolean {
    return user?.role === "organization" && !!user?.organizationId;
  }

  // Check if user is a volunteer with profile
  isVolunteerWithProfile(user: User | null): boolean {
    return user?.role === "volunteer" && !!user?.volunteerId;
  }

  // Check if user is a partner with profile
  isPartnerWithProfile(user: User | null): boolean {
    return user?.role === "partner" && !!user?.partnerId;
  }

  // Check if user is a coordinator with profile
  isCoordinatorWithProfile(user: User | null): boolean {
    return user?.role === "coordinator" && !!user?.coordinatorId;
  }

  // Get the appropriate profile ID for the user
  getUserProfileId(user: User | null): number | null {
    if (!user) return null;

    switch (user.role) {
      case "organization":
        return user.organizationId || null;
      case "partner":
        return user.partnerId || null;
      case "volunteer":
        return user.volunteerId || null;
      case "coordinator":
        return user.coordinatorId || null;
      default:
        return null;
    }
  }

  private mapApiUserToUser(apiUser: ApiUser): User {
    return {
      id: apiUser.userId,
      email: apiUser.email,
      fullName: "",
      role: this.mapRoleNameToEnum(apiUser.roleName || ""),
      roleId: apiUser.roleId,
      isEmailVerified: apiUser.isEmailVerified,
      lastLoginAt: apiUser.lastLoginAt,
      // Map profile-specific IDs from enhanced backend
      organizationId: apiUser.organizationId,
      partnerId: apiUser.partnerId,
      volunteerId: apiUser.volunteerId,
      coordinatorId: apiUser.coordinatorId,
    };
  }

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

  private mapRoleNameToEnum(roleName: string): UserRole {
    if (!roleName) return "volunteer"; // Default to volunteer if roleName is undefined

    const roleMap: Record<string, UserRole> = {
      volunteer: "volunteer",
      organization: "organization",
      partner: "partner",
      coordinator: "coordinator",
      admin: "admin",
    };
    const mappedRole = roleMap[roleName.toLowerCase()] || "volunteer";
    return mappedRole;
  }
}

export const authService = new AuthService();
export default authService;
