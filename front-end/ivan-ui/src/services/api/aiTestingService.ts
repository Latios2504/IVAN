import { apiClient } from "./apiClient";
import type { ApiResponse } from "../../types/common";
import type {
  AiTestResult,
  MultiModelTestRequest,
  MultiModelTestResponse,
  DatabaseIntegratedTestRequest,
  AiProviderStatus
} from "../../types/ai";

/**
 * Service for AI Testing Playground functionality
 */
class AiTestingService {
  private readonly baseEndpoint = "/AiTesting";

  private get api() {
    return apiClient;
  }

  /**
   * Test multiple AI providers with the same prompt
   */
  async testMultipleProviders(request: MultiModelTestRequest): Promise<MultiModelTestResponse> {
    try {
      const response = await this.api.post<MultiModelTestResponse>(
        `${this.baseEndpoint}/test`,
        request
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to test multiple providers");
      }

      return response.data!;
    } catch (error) {
      console.error("Failed to test multiple providers:", error);
      throw error;
    }
  }

  /**
   * Test with database context integration
   */
  async testWithDatabase(request: DatabaseIntegratedTestRequest): Promise<MultiModelTestResponse> {
    try {
      const response = await this.api.post<MultiModelTestResponse>(
        `${this.baseEndpoint}/test-with-database`,
        request
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to test with database");
      }

      return response.data!;
    } catch (error) {
      console.error("Failed to test with database:", error);
      throw error;
    }
  }

  /**
   * Get status and health of all AI providers
   */
  async getProviderStatus(): Promise<AiProviderStatus[]> {
    try {
      const response = await this.api.get<AiProviderStatus[]>(
        `${this.baseEndpoint}/providers/status`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to get provider status");
      }

      return response.data || [];
    } catch (error) {
      console.error("Failed to get provider status:", error);
      throw error;
    }
  }

  /**
   * Get available models from all providers
   */
  async getAvailableModels(): Promise<Record<string, string[]>> {
    try {
      const response = await this.api.get<Record<string, string[]>>(
        `${this.baseEndpoint}/providers/models`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to get available models");
      }

      return response.data || {};
    } catch (error) {
      console.error("Failed to get available models:", error);
      throw error;
    }
  }

  /**
   * Get system health check
   */
  async getHealthCheck(): Promise<{
    status: string;
    healthyProviders: number;
    totalProviders: number;
    timestamp: string;
    providers: Array<{
      providerName: string;
      isHealthy: boolean;
      isEnabled: boolean;
      lastError?: string;
    }>;
  }> {
    try {
      const response = await this.api.get<any>(
        `${this.baseEndpoint}/health`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to get health check");
      }

      return response.data!;
    } catch (error) {
      console.error("Failed to get health check:", error);
      throw error;
    }
  }

  /**
   * Get sample prompts for testing
   */
  async getSamplePrompts(): Promise<Array<{
    category: string;
    prompt: string;
    description: string;
  }>> {
    try {
      const response = await this.api.get<any[]>(
        `${this.baseEndpoint}/sample-prompts`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to get sample prompts");
      }

      return response.data || [];
    } catch (error) {
      console.error("Failed to get sample prompts:", error);
      throw error;
    }
  }

  /**
   * Test a specific provider
   */
  async testSpecificProvider(providerName: string, prompt: string): Promise<AiTestResult> {
    try {
      const response = await this.api.post<AiTestResult>(
        `${this.baseEndpoint}/test-provider/${providerName}`,
        { prompt }
      );

      if (!response.success) {
        throw new Error(response.message || `Failed to test ${providerName}`);
      }

      return response.data!;
    } catch (error) {
      console.error(`Failed to test ${providerName}:`, error);
      throw error;
    }
  }
}

export const aiTestingService = new AiTestingService();
