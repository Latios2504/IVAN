/**
 * API Response interceptor for centralized error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Centralized error handler for API responses
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return new ApiError(
      "Network error. Please check your internet connection.",
      0,
      "NETWORK_ERROR"
    );
  }

  // Handle other errors
  const errorObj = error as {
    message?: string;
    status?: number;
    code?: string;
  };
  const message = errorObj?.message || "An unexpected error occurred";
  const status = errorObj?.status || 500;
  const code = errorObj?.code || "UNKNOWN_ERROR";

  return new ApiError(message, status, code, error);
};
