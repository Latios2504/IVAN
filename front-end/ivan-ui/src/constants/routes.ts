// Application routes configuration
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PASSWORD_RESET: "/password-reset",

  // Public browsing
  VOLUNTEERS: "/volunteers",
  ORGANIZATIONS: "/organizations",
  EVENTS: "/events",
  PARTNERS: "/partners",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // Volunteer routes
  VOLUNTEER: {
    DASHBOARD: "/dashboard/volunteer",
    SCHEDULE: "/schedule",
    CERTIFICATES: "/certificates",
    APPLICATIONS: "/applications",
  },

  // Organization routes
  ORGANIZATION: {
    DASHBOARD: "/dashboard/organization",
    MANAGEMENT: "/organization/management",
    EVENTS: "/organization/events",
    VOLUNTEERS: "/organization/volunteers",
    VOLUNTEER_COORDINATORS: "/organization/volunteer-coordinators",
    EVENT_REGISTRATIONS: "/organization/event-registrations",
    CERTIFICATES: "/organization/certificates",
    REPORTS: "/organization/reports",
    RESOURCES: "/organization/resources",
    ANALYTICS: "/organization/analytics",
    NOTIFICATIONS: "/organization/notifications",
  },

  // Partner routes
  PARTNER: {
    DASHBOARD: "/dashboard/partner",
    COLLABORATIONS: "/partner/collaborations",
    DONATIONS: "/partner/donations",
    REPORTS: "/partner/reports",
  },

  // Coordinator routes
  COORDINATOR: {
    DASHBOARD: "/dashboard/coordinator",
    TASKS: "/coordinator/tasks",
    MULTI_ORG: "/coordinator/organizations",
    EVENTS: "/coordinator/events",
    RESOURCES: "/coordinator/resources",
    SCHEDULE: "/coordinator/schedule",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/dashboard/admin",
    USERS: "/admin/users",
    ORGANIZATIONS: "/admin/organizations",
    PARTNERS: "/admin/partners",
    COORDINATORS: "/admin/coordinators",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    MODERATION: "/admin/moderation",
  },

  // Feature routes
  REPORTS: "/reports",
  NOTIFICATIONS: "/notifications",
  SUPPORT: "/support",
  FEEDBACK: "/feedback",
} as const;

// Route groups for easier management
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.PASSWORD_RESET,
  ROUTES.VOLUNTEERS,
  ROUTES.ORGANIZATIONS,
  ROUTES.EVENTS,
  ROUTES.PARTNERS,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ...Object.values(ROUTES.VOLUNTEER),
  ...Object.values(ROUTES.ORGANIZATION),
  ...Object.values(ROUTES.PARTNER),
  ...Object.values(ROUTES.COORDINATOR),
  ...Object.values(ROUTES.ADMIN),
] as const;
