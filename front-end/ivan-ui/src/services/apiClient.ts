import type { ApiResponse } from "../types/common";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5283/api";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = this.getStoredToken();
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

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle arrays by adding multiple query parameters with the same key
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== undefined && item !== null) {
                url.searchParams.append(key, String(item));
              }
            });
          } else {
            // Handle empty strings - skip them to avoid sending empty parameters
            if (value !== "") {
              url.searchParams.append(key, String(value));
            }
          }
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    // Handle authentication errors by clearing token and redirecting
    if (response.status === 401) {
      this.setToken(null);
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (!response.ok) {
      // For HTTP errors, get the error response and throw with the message
      const errorData = isJson
        ? await response.json()
        : {
            success: false,
            message: response.statusText,
            data: null,
            errors: [],
          };

      // If backend returns ApiResponse format, throw with its message
      if (errorData.success !== undefined) {
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // For non-API errors, throw with HTTP status message
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {
        success: true,
        message: "Success",
        data: null,
        errors: [],
      } as ApiResponse<T>;
    }

    // All successful endpoints return ApiResponse<T> format
    const result = isJson
      ? await response.json()
      : {
          success: true,
          message: "Success",
          data: null,
          errors: [],
        };

    return result;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);

    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);

    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
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

    const response = await fetch(this.buildURL(endpoint), {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  // Helper function to handle .NET JSON serialization format
  extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
export default apiClient;
