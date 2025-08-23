import { apiClient } from "./apiClient";

// Types for chatbot configuration
export interface ChatbotConfiguration {
  enableCustomInstructions: boolean;
  defaultCustomInstructionId: number | null;
  defaultCustomInstruction: {
    instructionId: number;
    instructionName: string;
    systemPrompt: string;
    behaviorInstructions: string;
    isActive: boolean;
  } | null;
  cacheDurationMinutes: number;
  fallbackBehavior: string;
}

export interface SetDefaultInstructionRequest {
  instructionId: number | null;
}

class ChatbotConfigurationService {
  private cachedConfig: ChatbotConfiguration | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get current chatbot configuration with caching
   */
  async getConfiguration(): Promise<ChatbotConfiguration> {
    const now = Date.now();
    
    // Return cached config if still valid
    if (this.cachedConfig && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedConfig;
    }

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ChatbotConfiguration;
        message: string;
      }>("/ChatbotConfiguration/configuration");

      if (response.data?.success) {
        this.cachedConfig = response.data.data;
        this.cacheTimestamp = now;
        return this.cachedConfig;
      } else {
        throw new Error(response.data?.message || "Failed to get chatbot configuration");
      }
    } catch (error) {
      console.error("Error getting chatbot configuration:", error);
      
      // Return fallback configuration if API fails
      const fallbackConfig: ChatbotConfiguration = {
        enableCustomInstructions: false,
        defaultCustomInstructionId: null,
        defaultCustomInstruction: null,
        cacheDurationMinutes: 30,
        fallbackBehavior: "UseWithoutInstructions"
      };
      
      return fallbackConfig;
    }
  }

  /**
   * Get the default custom instruction ID for chatbot
   */
  async getDefaultCustomInstructionId(): Promise<number | null> {
    try {
      const config = await this.getConfiguration();
      
      if (!config.enableCustomInstructions) {
        return null;
      }
      
      return config.defaultCustomInstructionId;
    } catch (error) {
      console.error("Error getting default custom instruction ID:", error);
      return null;
    }
  }

  /**
   * Set default custom instruction (Admin only)
   */
  async setDefaultInstruction(instructionId: number | null): Promise<boolean> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/ChatbotConfiguration/default-instruction", {
        instructionId
      });

      if (response.data?.success) {
        // Clear cache to force refresh on next request
        this.clearCache();
        return true;
      } else {
        console.error("Failed to set default instruction:", response.data?.message);
        return false;
      }
    } catch (error) {
      console.error("Error setting default instruction:", error);
      return false;
    }
  }

  /**
   * Get available custom instructions for admin selection
   */
  async getAvailableInstructions(): Promise<Array<{
    instructionId: number;
    instructionName: string;
    systemPrompt: string;
    behaviorInstructions: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Array<{
          instructionId: number;
          instructionName: string;
          systemPrompt: string;
          behaviorInstructions: string;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        }>;
        message: string;
      }>("/ChatbotConfiguration/available-instructions");

      if (response.data?.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || "Failed to get available instructions");
      }
    } catch (error) {
      console.error("Error getting available instructions:", error);
      return [];
    }
  }

  /**
   * Clear server-side cache
   */
  async clearServerCache(): Promise<boolean> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/ChatbotConfiguration/clear-cache");

      if (response.data?.success) {
        this.clearCache(); // Also clear client cache
        return true;
      } else {
        console.error("Failed to clear server cache:", response.data?.message);
        return false;
      }
    } catch (error) {
      console.error("Error clearing server cache:", error);
      return false;
    }
  }

  /**
   * Clear client-side cache
   */
  clearCache(): void {
    this.cachedConfig = null;
    this.cacheTimestamp = 0;
  }
}

export const chatbotConfigurationService = new ChatbotConfigurationService();