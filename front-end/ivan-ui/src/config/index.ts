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

  // Certificate Management
  CERTIFICATES: {
    BASE: "/certificate",
    LIST: "/certificate",
    BY_ID: (id: number) => `/certificate/get/${id}`,
    BY_ORGANIZATION: (orgId: number) => `/certificate/by-organization/${orgId}`,
    CREATE: "/certificate/add",
    UPDATE: (id: number) => `/certificate/update/${id}`,
    DELETE: (id: number) => `/certificate/delete/${id}`,
    DOWNLOAD: (id: number) => `/certificate/download/${id}`,
    APPROVE: (id: number) => `/certificate/approve/${id}`,
    REJECT: (id: number) => `/certificate/reject/${id}`,
    BULK_APPROVE: "/certificate/bulk-approve",
    BULK_REVOKE: "/certificate/bulk-revoke",
    FILTER: "/certificate/filter",
  },

  // Certificate Templates
  CERTIFICATE_TEMPLATES: {
    BASE: "/certificatetemplate",
    LIST: "/certificatetemplate",
    BY_ID: (id: number) => `/certificatetemplate/get/${id}`,
    CREATE: "/certificatetemplate/add",
    UPDATE: (id: number) => `/certificatetemplate/update/${id}`,
    DELETE: (id: number) => `/certificatetemplate/delete/${id}`,
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

// API configuration object for easy access
export const api = {
  certificate: {
    list: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.LIST}`,
    getById: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.BY_ID(id)}`,
    getByOrganization: (orgId: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.BY_ORGANIZATION(
        orgId
      )}`,
    create: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.CREATE}`,
    update: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.UPDATE(id)}`,
    delete: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.DELETE(id)}`,
    download: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id)}`,
    approve: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.APPROVE(id)}`,
    reject: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.REJECT(id)}`,
    bulkApprove: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.BULK_APPROVE}`,
    bulkRevoke: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.BULK_REVOKE}`,
    filter: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.FILTER}`,
  },
  certificateTemplate: {
    list: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_TEMPLATES.LIST}`,
    getById: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_TEMPLATES.BY_ID(
        id
      )}`,
    create: `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_TEMPLATES.CREATE}`,
    update: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_TEMPLATES.UPDATE(
        id
      )}`,
    delete: (id: number) =>
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_TEMPLATES.DELETE(
        id
      )}`,
    preview: (id: number) =>
      `${environment.API_BASE_URL}/certificatetemplate/preview/${id}`,
    getByOrganization: (orgId: number) =>
      `${environment.API_BASE_URL}/certificatetemplate/by-organization/${orgId}`,
    toggleActive: (id: number) =>
      `${environment.API_BASE_URL}/certificatetemplate/toggle-active/${id}`,
  },
};

// Export environment as default for backward compatibility
export default environment;

// Export individual configurations
export { environment };
