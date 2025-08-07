import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  ToggleInstructionStatusDTO,
} from "../types/ai";

/**
 * Service for managing AI Custom Instructions
 * Simplified with consistent error handling via ApiClient
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

  private readonly baseEndpoint = "/AiCustomInstruction";

  /**
   * Create a new AI instruction
   */
  async createInstruction(
    data: AiCustomInstructionCreateDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.post<AiCustomInstructionDTO>(
      this.baseEndpoint,
      data
    );
    return response.data;
  }

  /**
   * Update an existing AI instruction
   */
  async updateInstruction(
    instructionId: number,
    data: AiCustomInstructionUpdateDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.put<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete an AI instruction
   */
  async deleteInstruction(instructionId: number): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/${instructionId}`);
  }

  /**
   * Toggle instruction status (activate/deactivate)
   */
  async toggleInstructionStatus(
    instructionId: number,
    data: ToggleInstructionStatusDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.patch<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}/toggle-status`,
      data
    );
    return response.data;
  }

  /**
   * Get user's AI instructions
   */
  async getUserInstructions(): Promise<AiCustomInstructionDTO[]> {
    const response = await apiClient.get<AiCustomInstructionDTO[]>(
      `${this.baseEndpoint}/user`
    );
    return this.normalizeArrayResponse(response.data);
  }

  /**
   * Get all AI instructions (Admin only)
   */
  async getAllInstructions(): Promise<AiCustomInstructionDTO[]> {
    const response = await apiClient.get<AiCustomInstructionDTO[]>(
      this.baseEndpoint
    );
    return this.normalizeArrayResponse(response.data);
  }

  /**
   * Get a specific instruction by ID
   */
  async getInstructionById(
    instructionId: number
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.get<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}`
    );
    return response.data;
  }

  /**
   * Search instructions by content (Client-side filtering)
   */
  async searchInstructions(query: string): Promise<AiCustomInstructionDTO[]> {
    const instructions = await this.getUserInstructions();

    if (!query.trim()) {
      return instructions;
    }

    const searchTerm = query.toLowerCase().trim();
    return instructions.filter(
      (instruction) =>
        instruction.instructionName.toLowerCase().includes(searchTerm) ||
        instruction.systemPrompt.toLowerCase().includes(searchTerm) ||
        instruction.behaviorInstructions?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get AI configuration
   */
  async getAiConfiguration(): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>(
      `/Ai/configuration`
    );
    return response.data;
  }

  /**
   * Get available AI models
   */
  async getAvailableModels(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/Ai/models`);
    return this.normalizeArrayResponse(response.data);
  }

  /**
   * Get user's most recently used instructions for quick access
   */
  async getRecentInstructions(
    limit: number = 5
  ): Promise<AiCustomInstructionDTO[]> {
    const instructions = await this.getUserInstructions();

    // Sort by last modified date and take the most recent ones
    return instructions
      .filter((instruction) => instruction.isActive)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, limit);
  }
}

export const aiInstructionsService = new AIInstructionsService();
export default aiInstructionsService;
