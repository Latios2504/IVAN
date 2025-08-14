import { apiClient } from "./apiClient";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  ToggleInstructionStatusDTO,
} from "../types/ai";

class AIInstructionsService {
  private normalizeArrayResponse<T>(data: any): T[] {
    if (data?.$values && Array.isArray(data.$values)) {
      return data.$values as T[];
    }
    return Array.isArray(data) ? data : [];
  }

  private readonly baseEndpoint = "/AiCustomInstruction";

  async createInstruction(
    data: AiCustomInstructionCreateDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.post<AiCustomInstructionDTO>(
      this.baseEndpoint,
      data
    );
    return response.data!;
  }

  async updateInstruction(
    instructionId: number,
    data: AiCustomInstructionUpdateDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.put<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}`,
      data
    );
    return response.data!;
  }

  async deleteInstruction(instructionId: number): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/${instructionId}`);
  }

  async toggleInstructionStatus(
    instructionId: number,
    data: ToggleInstructionStatusDTO
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.patch<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}/status`,
      data
    );
    return response.data!;
  }

  async getUserInstructions(): Promise<AiCustomInstructionDTO[]> {
    const response = await apiClient.get<AiCustomInstructionDTO[]>(
      this.baseEndpoint
    );
    return this.normalizeArrayResponse(response.data);
  }

  async getAllInstructions(): Promise<AiCustomInstructionDTO[]> {
    const response = await apiClient.get<AiCustomInstructionDTO[]>(
      this.baseEndpoint
    );
    return this.normalizeArrayResponse(response.data);
  }

  async getInstructionById(
    instructionId: number
  ): Promise<AiCustomInstructionDTO> {
    const response = await apiClient.get<AiCustomInstructionDTO>(
      `${this.baseEndpoint}/${instructionId}`
    );
    return response.data!;
  }

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

  async getAiConfiguration(): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>(
      `/Ai/configuration`
    );
    return response.data!;
  }

  async getAvailableModels(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/Ai/models`);
    return this.normalizeArrayResponse(response.data);
  }

  async getRecentInstructions(
    limit: number = 5
  ): Promise<AiCustomInstructionDTO[]> {
    const instructions = await this.getUserInstructions();

    return instructions
      .filter((instruction) => instruction.isActive)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, limit);
  }

  validateInstruction(
    data: AiCustomInstructionCreateDTO | AiCustomInstructionUpdateDTO
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.instructionName?.trim()) {
      errors.push("Tên instruction không được để trống");
    }

    if (!data.systemPrompt?.trim()) {
      errors.push("System prompt không được để trống");
    }

    if (data.instructionName && data.instructionName.length > 100) {
      errors.push("Tên instruction không được vượt quá 100 ký tự");
    }

    if (data.systemPrompt && data.systemPrompt.length > 5000) {
      errors.push("System prompt không được vượt quá 5000 ký tự");
    }

    if (data.behaviorInstructions && data.behaviorInstructions.length > 3000) {
      errors.push("Behavior instructions không được vượt quá 3000 ký tự");
    }

    if (data.systemPrompt && data.systemPrompt.length < 50) {
      warnings.push(
        "System prompt khá ngắn, nên mở rộng thêm để có hiệu quả tốt hơn"
      );
    }

    if (data.instructionName && data.instructionName.length < 5) {
      warnings.push("Tên instruction nên dài hơn để dễ nhận biết");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export const aiInstructionsService = new AIInstructionsService();
export default aiInstructionsService;
