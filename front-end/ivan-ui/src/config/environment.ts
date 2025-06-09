/**
 * Environment configuration
 * Centralizes all environment variables with type safety and defaults
 */

interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;

  // Application Configuration
  APP_NAME: string;
  APP_VERSION: string;

  // Development Configuration
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;

  // Feature Flags (you can expand this)
  ENABLE_LOGGING: boolean;
}

const config: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",

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

export default config;
