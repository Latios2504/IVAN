import { apiClient } from "./apiClient";
import { ApiError } from "../utils/errorHandler";
import type { ApiResponse } from "../../types/common";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  ToggleInstructionStatusDTO,
} from "../../types/ai";

/**
 * Service for managing AI Custom Instructions
 * Updated to work with the new AiCustomInstructionController backend endpoints
 */
class AIInstructionsService {
  /**
   * Helper function to handle Entity Framework's $values format
   */
  private normalizeArrayResponse<T>(data: any): T[] {
    if (!data) {
      return [];
    }

    // Handle Entity Framework's $values format
    if (
      typeof data === "object" &&
      data.$values &&
      Array.isArray(data.$values)
    ) {
      return data.$values as T[];
    }

    // Return as-is if already an array
    if (Array.isArray(data)) {
      return data as T[];
    }

    // If not an array, return empty array
    console.warn("API returned non-array data:", data);
    return [];
  }

  // Updated to use new AiCustomInstructionController endpoints
  private readonly baseEndpoint = "/AiCustomInstruction";

  private get api() {
    return apiClient;
  }

  /**
   * Create a new AI instruction
   */
  async createInstruction(
    data: AiCustomInstructionCreateDTO
  ): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.post<AiCustomInstructionDTO>(
        this.baseEndpoint,
        data
      );

      if (!response.success || !response.data) {
        throw new ApiError(
          response.message || "Failed to create AI instruction",
          400
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to create AI instruction", 500);
    }
  }

  /**
   * Update an existing AI instruction (Admin can update any instruction)
   * Updated to use new AiController endpoint
   */
  async updateInstruction(
    instructionId: number,
    data: AiCustomInstructionUpdateDTO
  ): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.put<AiCustomInstructionDTO>(
        `${this.baseEndpoint}/${instructionId}`,
        data
      );

      if (!response.success || !response.data) {
        throw new ApiError(
          response.message || "Failed to update AI instruction",
          400
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to update AI instruction", 500);
    }
  }

  /**
   * Delete an AI instruction as admin (force new method to bypass cache)
   * Updated to use new AiCustomInstructionController endpoint
   */
  async adminDeleteInstruction(instructionId: number): Promise<void> {
    try {
      const deleteUrl = `${this.baseEndpoint}/${instructionId}`;
      console.log("🔄 Admin deleting instruction with URL:", deleteUrl);
      const response = await this.api.delete<boolean>(deleteUrl);

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to delete AI instruction",
          400
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to delete AI instruction", 500);
    }
  }

  /**
   * Toggle instruction active status
   */
  async toggleInstructionStatus(
    instructionId: number,
    isActive: boolean
  ): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.patch<AiCustomInstructionDTO>(
        `${this.baseEndpoint}/${instructionId}/status`,
        { isActive }
      );

      if (!response.success || !response.data) {
        throw new ApiError(
          response.message || "Failed to update instruction status",
          400
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to update instruction status", 500);
    }
  }

  /**
   * Get AI instructions for current user only
   */
  async getUserInstructions(): Promise<AiCustomInstructionDTO[]> {
    try {
      const response = await this.api.get<AiCustomInstructionDTO[]>(
        this.baseEndpoint
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch user AI instructions", 400);
      }

      return this.normalizeArrayResponse<AiCustomInstructionDTO>(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch user AI instructions", 500);
    }
  }

  /**
   * Get instructions based on user role
   * Updated to use new AiCustomInstructionController endpoint
   */
  async getInstructions(isAdmin: boolean): Promise<AiCustomInstructionDTO[]> {
    try {
      // The new AiCustomInstructionController handles role-based filtering automatically
      const response = await this.api.get<AiCustomInstructionDTO[]>(
        this.baseEndpoint
      );

      if (!response.success) {
        throw new ApiError("Failed to fetch AI instructions", 400);
      }

      // Use helper to normalize the response
      const instructionsData =
        this.normalizeArrayResponse<AiCustomInstructionDTO>(response.data);

      console.log(
        `✅ AI Instructions loaded:`,
        instructionsData.length,
        "items"
      );
      return instructionsData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Failed to fetch AI instructions:", error);
      throw new ApiError("Failed to fetch AI instructions", 500);
    }
  }

  /**
   * Validate instruction data before creation/update
   */
  validateInstruction(data: AiCustomInstructionCreateDTO): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!data.instructionName?.trim()) {
      errors.push("Tên hướng dẫn là bắt buộc");
    }

    if (!data.systemPrompt?.trim()) {
      errors.push("System prompt là bắt buộc");
    }

    // Length validation
    if (data.instructionName && data.instructionName.length > 200) {
      errors.push("Tên hướng dẫn không được vượt quá 200 ký tự");
    }

    // No character limits for systemPrompt and behaviorInstructions

    // Warning validation
    if (data.systemPrompt && data.systemPrompt.length < 50) {
      warnings.push("System prompt khá ngắn, hãy xem xét mở rộng thêm");
    }

    if (!data.behaviorInstructions?.trim()) {
      warnings.push("Nên thêm hướng dẫn hành vi để AI hoạt động tốt hơn");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get current AI configuration
   * Uses AiController for general AI configuration
   */
  async getGeminiConfig(): Promise<object> {
    try {
      const response = await this.api.get<object>("/Ai/configuration");

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch AI configuration", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch AI configuration", 500);
    }
  }

  /**
   * Get available AI models
   * Uses AiController for general AI models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>("/Ai/models");

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch available models", 400);
      }

      // Normalize the response data to handle $values format
      return this.normalizeArrayResponse<string>(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch available Gemini models", 500);
    }
  }
}

// Export singleton instance
export const aiInstructionsService = new AIInstructionsService();
export { AIInstructionsService };
