/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

import React from "react";

export interface AppError {
  message: string;
  code?: string;
  context?: string;
  originalError?: unknown;
}

/**
 * Structured logger for better debugging
 */
export const logger = {
  debug: (message: string, data?: any, context?: string) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      console.log(
        `[DEBUG] ${timestamp} ${context ? `[${context}] ` : ""}${message}`,
        data
      );
    }
  },

  info: (message: string, data?: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.info(
      `[INFO] ${timestamp} ${context ? `[${context}] ` : ""}${message}`,
      data
    );
  },

  warn: (message: string, data?: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.warn(
      `[WARN] ${timestamp} ${context ? `[${context}] ` : ""}${message}`,
      data
    );
  },

  error: (message: string, error?: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.error(
      `[ERROR] ${timestamp} ${context ? `[${context}] ` : ""}${message}`,
      error
    );

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
    }
  },
};

/**
 * Error handling service
 */
export class ErrorHandlingService {
  /**
   * Handle API errors with context
   */
  static handleApiError(
    error: unknown,
    context: string,
    showToUser = true
  ): AppError {
    const appError: AppError = {
      message: "An unexpected error occurred",
      context,
      originalError: error,
    };

    if (error instanceof Error) {
      appError.message = error.message;
    } else if (typeof error === "string") {
      appError.message = error;
    } else if (error && typeof error === "object" && "message" in error) {
      appError.message = String(error.message);
    }

    logger.error(`API Error in ${context}`, error, context);

    return appError;
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(
    field: string,
    value: any,
    rule: string
  ): AppError {
    const message = `Validation failed for ${field}: ${rule}`;
    logger.warn(message, { field, value, rule }, "VALIDATION");

    return {
      message,
      code: "VALIDATION_ERROR",
      context: "VALIDATION",
    };
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: unknown): AppError {
    logger.error("Network error occurred", error, "NETWORK");

    return {
      message: "Network error. Please check your connection and try again.",
      code: "NETWORK_ERROR",
      context: "NETWORK",
      originalError: error,
    };
  }

  /**
   * Create user-friendly error messages
   */
  static getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      VALIDATION_ERROR: "Please check your input and try again.",
      NETWORK_ERROR: "Connection problem. Please try again.",
      PERMISSION_ERROR: "You don't have permission to perform this action.",
      NOT_FOUND: "The requested resource was not found.",
      SERVER_ERROR: "Server error. Please try again later.",
    };

    return (
      errorMessages[error.code || ""] ||
      error.message ||
      "An unexpected error occurred."
    );
  }
}

/**
 * Async error wrapper for better error handling
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    const appError = ErrorHandlingService.handleApiError(error, context);

    if (fallbackValue !== undefined) {
      return fallbackValue;
    }

    throw appError;
  }
};

/**
 * React error boundary helper
 */
export const createErrorBoundary = (
  fallbackComponent: React.ComponentType<{ error: Error }>
) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logger.error(
        "React Error Boundary caught an error",
        { error, errorInfo },
        "REACT"
      );
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement(fallbackComponent, {
          error: this.state.error,
        });
      }

      return this.props.children;
    }
  };
};
