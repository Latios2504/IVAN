import type { ApiResponse } from "../types/common";
import config from "../config/environment";
import { ApiError } from "./errorHandler";

const API_BASE_URL = config.API_BASE_URL;

/**
 * Enhanced API Client with improved error handling and logging
 */
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = this.getStoredToken();

    if (config.ENABLE_LOGGING) {
      console.log(`🔗 API Client initialized with base URL: ${this.baseURL}`);
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("authToken");
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const errorData = isJson
        ? await response.json()
        : { message: response.statusText };

      // Handle authentication errors
      if (response.status === 401) {
        // 401 Unauthorized - token is invalid/expired, logout user
        if (config.ENABLE_LOGGING) {
          console.warn(
            `🔐 Authentication error (401): Token invalid/expired, clearing token and redirecting to login`
          );
        }

        // Clear the token
        this.setToken(null);

        // Redirect to login page if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      } else if (response.status === 403) {
        // 403 Forbidden - user is authenticated but lacks permission
        // Only logout if it's explicitly a token-related error
        const errorMessage = errorData.message || "";
        const isTokenError =
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("invalid token");

        if (isTokenError) {
          if (config.ENABLE_LOGGING) {
            console.warn(
              `🔐 Authentication error (403): Token-related error, clearing token and redirecting to login`
            );
          }

          // Clear the token
          this.setToken(null);

          // Redirect to login page if not already there
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        } else {
          if (config.ENABLE_LOGGING) {
            console.warn(
              `🚫 Access denied (403): User lacks permission for this resource`
            );
          }
          // Don't logout - just let the error propagate
        }
      }

      const apiError = new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code || `HTTP_${response.status}`,
        errorData
      );

      if (config.ENABLE_LOGGING) {
        console.error(`❌ API Error:`, apiError);
      }

      throw apiError;
    }

    if (response.status === 204) {
      return { success: true } as ApiResponse<T>;
    }

    const result = isJson
      ? await response.json()
      : ({ success: true, data: response } as ApiResponse<T>);

    // Handle direct DTO responses (when backend returns DTO directly instead of wrapped ApiResponse)
    if (
      result &&
      typeof result === "object" &&
      !result.hasOwnProperty("success") &&
      !result.hasOwnProperty("data")
    ) {
      // This is a direct DTO response, wrap it in ApiResponse format
      const wrappedResult = {
        success: true,
        data: result as T,
        message: "Success",
      } as ApiResponse<T>;

      if (config.ENABLE_LOGGING) {
        console.log(`✅ API Success (wrapped DTO):`, wrappedResult);
      }

      return wrappedResult;
    }

    if (config.ENABLE_LOGGING && result.data) {
      console.log(`✅ API Success:`, result);
    }

    return result;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: {
      params?: Record<string, string | number | boolean | undefined | null>;
    }
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log("🔄 API DELETE request to:", fullUrl);
    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
export default apiClient;
