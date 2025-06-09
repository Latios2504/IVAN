/**
 * Type definitions for API operations
 */

// Generic types for API operations
export type RequestParams = Record<
  string,
  string | number | boolean | undefined | null
>;
export type RequestData =
  | Record<string, unknown>
  | FormData
  | string
  | null
  | undefined;
export type AdditionalData = Record<string, string | number | boolean>;

// HTTP method types
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// API Error types
export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  timestamp?: string;
}
