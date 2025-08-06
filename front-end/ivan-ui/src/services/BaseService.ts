import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common";

/**
 * Base service class that provides standardized API client access
 * All service classes should extend this to ensure consistent API usage
 */
export abstract class BaseService {
  protected get api() {
    return apiClient;
  }

  /**
   * Helper method for making GET requests with consistent error handling
   */
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const response = await this.api.get<T>(endpoint, params);
    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to GET ${endpoint}`);
    }
    return response.data;
  }

  /**
   * Helper method for making POST requests with consistent error handling
   */
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to POST to ${endpoint}`);
    }
    return response.data;
  }

  /**
   * Helper method for making PUT requests with consistent error handling
   */
  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to PUT to ${endpoint}`);
    }
    return response.data;
  }

  /**
   * Helper method for making PATCH requests with consistent error handling
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(endpoint, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to PATCH ${endpoint}`);
    }
    return response.data;
  }

  /**
   * Helper method for making DELETE requests with consistent error handling
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    if (!response.success) {
      throw new Error(response.message || `Failed to DELETE ${endpoint}`);
    }
    return response.data as T;
  }

  /**
   * Helper method for error logging with consistent format
   */
  protected logError(operation: string, error: unknown): void {
    console.error(`[${this.constructor.name}] ${operation} error:`, error);
  }
}
