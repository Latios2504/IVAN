/**
 * User Role Utilities
 * Centralized role mapping and validation functions
 */

export const USER_ROLES = {
  ADMIN: { id: 1, name: 'admin', displayName: 'Quản trị viên' },
  ORGANIZATION: { id: 2, name: 'organization', displayName: 'Tổ chức' },
  VOLUNTEER: { id: 3, name: 'volunteer', displayName: 'Tình nguyện viên' },
  PARTNER: { id: 4, name: 'partner', displayName: 'Đối tác' },
  COORDINATOR: { id: 5, name: 'coordinator', displayName: 'Điều phối viên' },
} as const;

export type UserRoleName = typeof USER_ROLES[keyof typeof USER_ROLES]['name'];
export type UserRoleId = typeof USER_ROLES[keyof typeof USER_ROLES]['id'];

/**
 * Role utility functions
 */
export const roleUtils = {
  /**
   * Convert role name to role ID
   */
  mapRoleToId: (role: string): number => {
    const roleEntry = Object.values(USER_ROLES).find(r => r.name === role);
    return roleEntry?.id ?? USER_ROLES.VOLUNTEER.id;
  },

  /**
   * Convert role ID to role name
   */
  mapIdToRole: (id: number): string => {
    const roleEntry = Object.values(USER_ROLES).find(r => r.id === id);
    return roleEntry?.name ?? USER_ROLES.VOLUNTEER.name;
  },

  /**
   * Get display name for role
   */
  getRoleDisplayName: (role: string): string => {
    const roleEntry = Object.values(USER_ROLES).find(r => r.name === role);
    return roleEntry?.displayName ?? role;
  },

  /**
   * Get display name by role ID
   */
  getRoleDisplayNameById: (id: number): string => {
    const roleEntry = Object.values(USER_ROLES).find(r => r.id === id);
    return roleEntry?.displayName ?? 'Unknown';
  },

  /**
   * Validate if role ID is valid
   */
  isValidRoleId: (id: number): boolean => {
    return Object.values(USER_ROLES).some(r => r.id === id);
  },

  /**
   * Validate if role name is valid
   */
  isValidRoleName: (name: string): boolean => {
    return Object.values(USER_ROLES).some(r => r.name === name);
  },

  /**
   * Get all roles as array for dropdowns
   */
  getAllRoles: () => {
    return Object.values(USER_ROLES);
  },

  /**
   * Get roles for filter dropdown (includes "all" option)
   */
  getRolesForFilter: () => {
    return [
      { value: "all", label: "Tất cả vai trò" },
      ...Object.values(USER_ROLES).map(role => ({
        value: role.name,
        label: role.displayName
      }))
    ];
  },

  /**
   * Map API role name to frontend role (handles Vietnamese names)
   */
  mapApiRoleToFrontendRole: (roleName: string): string => {
    const roleMap: Record<string, string> = {
      "Admin": USER_ROLES.ADMIN.name,
      "Organization": USER_ROLES.ORGANIZATION.name,
      "Volunteer": USER_ROLES.VOLUNTEER.name,
      "Partner": USER_ROLES.PARTNER.name,
      "Coordinator": USER_ROLES.COORDINATOR.name,
      "Quản trị viên": USER_ROLES.ADMIN.name,
      "Tổ chức": USER_ROLES.ORGANIZATION.name,
      "Tổ chức từ thiện": USER_ROLES.ORGANIZATION.name,
      "Tình nguyện viên": USER_ROLES.VOLUNTEER.name,
      "Đối tác": USER_ROLES.PARTNER.name,
      "Điều phối viên": USER_ROLES.COORDINATOR.name,
      "Điều phối viên tình nguyện": USER_ROLES.COORDINATOR.name
    };
    return roleMap[roleName] || USER_ROLES.VOLUNTEER.name;
  }
};

/**
 * User status utilities
 */
export const userStatusUtils = {
  getStatusOptions: () => [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Bị vô hiệu hóa" },
    { value: "unverified", label: "Chưa xác thực email" },
  ],

  getStatusBadgeVariant: (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "destructive";
    if (!isEmailVerified) return "secondary";
    return "default";
  },

  getStatusText: (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "Bị vô hiệu hóa";
    if (!isEmailVerified) return "Chưa xác thực";
    return "Hoạt động";
  }
};

/**
 * Validation schemas (if using Zod)
 */
export const validationSchemas = {
  roleId: (id: number) => roleUtils.isValidRoleId(id),
  roleName: (name: string) => roleUtils.isValidRoleName(name),
};