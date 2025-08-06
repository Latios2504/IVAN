/**
 * Consolidated Configuration
 * Centralizes all configuration including environment, API endpoints, and constants
 */

// Environment configuration
interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;

  // Application Configuration
  APP_NAME: string;
  APP_VERSION: string;

  // Development Configuration
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;

  // Feature Flags
  ENABLE_LOGGING: boolean;
}

const environment: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5283/api",

  // Application Configuration
  APP_NAME:
    import.meta.env.VITE_APP_NAME || "IVAN - Volunteer Management System",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Development Configuration
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // Feature Flags
  ENABLE_LOGGING:
    import.meta.env.VITE_ENABLE_LOGGING === "true" || import.meta.env.DEV,
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/authentication/login",
    REGISTER: "/authentication/register",
    LOGOUT: "/authentication/logout",
    REFRESH: "/authentication/refresh",
    FORGOT_PASSWORD: "/authentication/forgot-password",
    RESET_PASSWORD: "/authentication/reset-password",
    CHANGE_PASSWORD: "/authentication/change-password",
    GET_CURRENT_USER: "/authentication/current-user",
  },

  // AI
  AI: {
    QUERY: "/ai/query",
    CUSTOM_INSTRUCTIONS: "/aicustominstruction",
  },

  // Public content
  PUBLIC: {
    ORGANIZATIONS: "/public/organizations",
    EVENTS: "/public/events",
    PARTNERS: "/public/partners",
    VOLUNTEERS: "/public/volunteers",
  },

  // User management
  USER_MANAGEMENT: {
    LIST: "/useraccount/getListUser",
    DETAIL: "/useraccount/getUserInforDetail",
    UPDATE: "/useraccount/updateUserAccount",
    CREATE_COORDINATOR: "/useraccount/createCoordinator",
    STATISTICS: "/useraccount/statistics",
  },

  // Export
  EXPORT: {
    ANALYTICS: "/export/analytics",
    USERS: "/export/users",
    EVENTS: "/export/events",
    EVENT_REGISTRATIONS: "/export/event-registrations",
    ORGANIZATIONS: "/export/organizations",
    FORMATS: "/export/formats",
    STATISTICS: "/export/statistics",
  },

  // Volunteer Coordinator
  VOLUNTEER_COORDINATOR: {
    BASE: "/volunteercoordinator",
    BY_ORGANIZATION: (orgId: number) =>
      `/volunteercoordinator/getCoordinatorsByOrganization/${orgId}`,
    MANAGEMENT_LEVELS: "/volunteercoordinator/management-levels",
    SPECIALIZATIONS: "/volunteercoordinator/specializations",
    MANAGERS: (orgId: number) => `/volunteercoordinator/managers/${orgId}`,
    TOGGLE_STATUS: (id: number) => `/volunteercoordinator/${id}/toggle-status`,
    ASSIGN_MANAGER: (id: number) =>
      `/volunteercoordinator/${id}/assign-manager`,
    REMOVE_MANAGER: (id: number) =>
      `/volunteercoordinator/${id}/remove-manager`,
  },
} as const;

// Application constants
export const APP_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // File uploads
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  // API
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,

  // UI
  TOAST_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // milliseconds

  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_INPUT_LENGTH: 255,

  // Date formats
  DATE_FORMAT: "DD/MM/YYYY",
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm",
  TIME_FORMAT: "HH:mm",
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

// Export environment as default for backward compatibility
export default environment;

// Export individual configurations
export { environment };
