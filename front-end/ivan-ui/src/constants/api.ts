// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  // Users
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    UPLOAD_AVATAR: "/users/avatar",
  },

  // Events
  EVENTS: {
    LIST: "/events",
    CREATE: "/events",
    DETAIL: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    REGISTER: (id: string) => `/events/${id}/register`,
    UNREGISTER: (id: string) => `/events/${id}/unregister`,
    PARTICIPANTS: (id: string) => `/events/${id}/participants`,
  },

  // Organizations
  ORGANIZATIONS: {
    LIST: "/organizations",
    CREATE: "/organizations",
    DETAIL: (id: string) => `/organizations/${id}`,
    UPDATE: (id: string) => `/organizations/${id}`,
    DELETE: (id: string) => `/organizations/${id}`,
    EVENTS: (id: string) => `/organizations/${id}/events`,
    VOLUNTEERS: (id: string) => `/organizations/${id}/volunteers`,
  },

  // Volunteers
  VOLUNTEERS: {
    LIST: "/volunteers",
    DETAIL: (id: string) => `/volunteers/${id}`,
    APPLICATIONS: "/volunteers/applications",
    CERTIFICATES: "/volunteers/certificates",
    SCHEDULE: "/volunteers/schedule",
  },

  // Partners
  PARTNERS: {
    LIST: "/partners",
    CREATE: "/partners",
    DETAIL: (id: string) => `/partners/${id}`,
    UPDATE: (id: string) => `/partners/${id}`,
    COLLABORATIONS: "/partners/collaborations",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
    PREFERENCES: "/notifications/preferences",
  },

  // File uploads
  UPLOADS: {
    IMAGE: "/uploads/image",
    DOCUMENT: "/uploads/document",
    AVATAR: "/uploads/avatar",
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Request headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  ACCEPT_LANGUAGE: "Accept-Language",
} as const;
