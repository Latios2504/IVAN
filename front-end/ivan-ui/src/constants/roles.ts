import { UserRole } from "@/types/auth";

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const RolePermissions = {
  [UserRole.VOLUNTEER]: [
    "view_events",
    "register_events",
    "view_profile",
    "edit_profile",
    "view_certificates",
  ],
  [UserRole.ORGANIZATION]: [
    "create_events",
    "manage_events",
    "view_volunteers",
    "manage_volunteers",
    "issue_certificates",
    "view_reports",
    "manage_profile",
  ],
  [UserRole.PARTNER]: [
    "view_collaborations",
    "create_partnerships",
    "manage_donations",
    "view_reports",
    "manage_profile",
  ],
  [UserRole.COORDINATOR]: [
    "coordinate_events",
    "manage_multi_org",
    "assign_resources",
    "view_all_reports",
    "manage_tasks",
  ],
  [UserRole.ADMIN]: [
    "manage_users",
    "manage_organizations",
    "manage_partners",
    "manage_coordinators",
    "view_system_reports",
    "manage_system_settings",
    "moderate_content",
  ],
} as const;

export const RoleDisplayNames = {
  [UserRole.VOLUNTEER]: "Tình nguyện viên",
  [UserRole.ORGANIZATION]: "Tổ chức",
  [UserRole.PARTNER]: "Đối tác",
  [UserRole.COORDINATOR]: "Điều phối viên",
  [UserRole.ADMIN]: "Quản trị viên",
} as const;
