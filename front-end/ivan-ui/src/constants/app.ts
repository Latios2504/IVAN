// Application-wide constants
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

// Status constants
export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
  INACTIVE: "inactive",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Event categories (Vietnamese)
export const EVENT_CATEGORIES = {
  EDUCATION: "Giáo dục",
  HEALTHCARE: "Y tế",
  ENVIRONMENT: "Môi trường",
  COMMUNITY: "Cộng đồng",
  SOCIAL_WELFARE: "Phúc lợi xã hội",
  DISASTER_RELIEF: "Cứu trợ thiên tai",
  CULTURAL: "Văn hóa",
  SPORTS: "Thể thao",
} as const;

// Skill levels
export const SKILL_LEVELS = {
  BEGINNER: "Người mới bắt đầu",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
  EXPERT: "Chuyên gia",
} as const;
