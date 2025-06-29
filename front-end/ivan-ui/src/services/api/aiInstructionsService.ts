import { apiClient } from "./apiClient";
import { ApiError } from "../utils/errorHandler";
import type { ApiResponse } from "../../types/common";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  TestInstructionRequestDTO,
  AiQueryAnalyticsDTO,
  InstructionPerformance,
} from "../../types/ai-instructions";

/**
 * Service for managing AI Custom Instructions
 * Implements Phase 5: Custom Instructions UI/UX integration with backend
 */
class AIInstructionsService {
  private readonly baseEndpoint = "/AIInstructions";

  private get api() {
    return apiClient;
  }

  /**
   * Get all AI instructions in the system (Admin only)
   */
  async getAllInstructions(): Promise<AiCustomInstructionDTO[]> {
    try {
      const response = await this.api.get<AiCustomInstructionDTO[]>(
        `${this.baseEndpoint}/all`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch AI instructions", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch AI instructions", 500);
    }
  }

  /**
   * Get a specific AI instruction by ID
   */
  async getInstruction(instructionId: number): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.get<AiCustomInstructionDTO>(
        `${this.baseEndpoint}/${instructionId}`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch AI instruction", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch AI instruction", 500);
    }
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
   */
  async updateInstruction(
    instructionId: number,
    data: AiCustomInstructionUpdateDTO
  ): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.put<AiCustomInstructionDTO>(
        `${this.baseEndpoint}/admin/${instructionId}`,
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
   * Delete an AI instruction (Admin can delete any instruction)
   */
  async deleteInstruction(instructionId: number): Promise<void> {
    try {
      const deleteUrl = `${this.baseEndpoint}/admin/${instructionId}`;
      console.log("🔄 Deleting instruction with URL:", deleteUrl);
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
   * Delete an AI instruction as admin (force new method to bypass cache)
   */
  async adminDeleteInstruction(instructionId: number): Promise<void> {
    try {
      const deleteUrl = `${this.baseEndpoint}/admin/${instructionId}`;
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
   * Get template AI instructions
   */
  async getTemplateInstructions(): Promise<AiCustomInstructionDTO[]> {
    try {
      const response = await this.api.get<AiCustomInstructionDTO[]>(
        `${this.baseEndpoint}/templates`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch template instructions", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch template instructions", 500);
    }
  }

  /**
   * Get the default AI instruction
   */
  async getDefaultInstruction(): Promise<AiCustomInstructionDTO> {
    try {
      const response = await this.api.get<AiCustomInstructionDTO>(
        `${this.baseEndpoint}/default`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch default instruction", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch default instruction", 500);
    }
  }

  /**
   * Test an AI instruction with a sample query
   */
  async testInstruction(
    instructionId: number,
    request: TestInstructionRequestDTO
  ): Promise<string> {
    try {
      const response = await this.api.post<string>(
        `${this.baseEndpoint}/admin/${instructionId}/test`,
        request
      );

      if (!response.success || response.data === undefined) {
        throw new ApiError(
          response.message || "Failed to test AI instruction",
          400
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to test AI instruction", 500);
    }
  }

  /**
   * Test an AI instruction with a specific model (Admin only)
   */
  async testInstructionWithModel(
    instructionId: number,
    sampleQuery: string,
    model: string
  ): Promise<ApiResponse<string>> {
    try {
      const response = await this.api.post<string>(
        `${this.baseEndpoint}/admin/${instructionId}/test-with-model`,
        {
          sampleQuery,
          model,
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to test AI instruction with model", 500);
    }
  }

  /**
   * Get instruction analytics
   */
  async getInstructionAnalytics(
    instructionId: number
  ): Promise<AiQueryAnalyticsDTO[]> {
    try {
      const response = await this.api.get<AiQueryAnalyticsDTO[]>(
        `${this.baseEndpoint}/${instructionId}/analytics`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch instruction analytics", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch instruction analytics", 500);
    }
  }

  /**
   * Get instruction performance metrics
   */
  async getInstructionPerformance(
    instructionId: number
  ): Promise<InstructionPerformance> {
    try {
      const response = await this.api.get<InstructionPerformance>(
        `${this.baseEndpoint}/${instructionId}/performance`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch instruction performance", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch instruction performance", 500);
    }
  }

  /**
   * Get all analytics for user's instructions
   */
  async getAllAnalytics(): Promise<AiQueryAnalyticsDTO[]> {
    try {
      const response = await this.api.get<AiQueryAnalyticsDTO[]>(
        `${this.baseEndpoint}/analytics`
      );

      if (!response.success || !response.data) {
        throw new ApiError("Failed to fetch analytics", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch analytics", 500);
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

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch user AI instructions", 500);
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

    if (data.systemPrompt && data.systemPrompt.length > 10000) {
      errors.push("System prompt không được vượt quá 10,000 ký tự");
    }

    if (data.behaviorInstructions && data.behaviorInstructions.length > 5000) {
      errors.push("Hướng dẫn hành vi không được vượt quá 5,000 ký tự");
    }

    if (data.dataAccessRules && data.dataAccessRules.length > 2000) {
      errors.push("Quy tắc truy cập dữ liệu không được vượt quá 2,000 ký tự");
    }

    // Warning validation
    if (data.systemPrompt && data.systemPrompt.length < 50) {
      warnings.push("System prompt khá ngắn, hãy xem xét mở rộng thêm");
    }

    if (!data.behaviorInstructions?.trim()) {
      warnings.push("Nên thêm hướng dẫn hành vi để AI hoạt động tốt hơn");
    }

    if (!data.dataAccessRules?.trim()) {
      warnings.push("Nên định nghĩa quy tắc truy cập dữ liệu cụ thể");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate instruction from template
   */
  generateFromTemplate(templateId: string): AiCustomInstructionCreateDTO {
    // This would normally fetch from backend, but for now use local templates
    const templates = {
      "volunteer-manager": {
        instructionName: "Trợ lý Quản lý Tình nguyện viên",
        systemPrompt: `Bạn là trợ lý AI chuyên về quản lý tình nguyện viên cho tổ chức từ thiện. 
        
Nhiệm vụ chính:
- Hỗ trợ tuyển dụng và sàng lọc tình nguyện viên
- Tư vấn lập lịch và phân công nhiệm vụ phù hợp
- Theo dõi và đánh giá hiệu suất làm việc
- Đề xuất chiến lược giữ chân và phát triển tình nguyện viên

Luôn ưu tiên sự an toàn, phúc lợi và sự phát triển của tình nguyện viên.`,
        behaviorInstructions:
          "Luôn thân thiện, hỗ trợ và đưa ra lời khuyên thực tế. Tôn trọng thời gian và khả năng của từng tình nguyện viên.",
        dataAccessRules:
          "Truy cập: volunteer profiles, skills, availability, performance metrics, event assignments, training records",
      },
      "event-planner": {
        instructionName: "Chuyên gia Tổ chức Sự kiện",
        systemPrompt: `Bạn là chuyên gia AI về tổ chức sự kiện từ thiện và xã hội.

Chuyên môn:
- Lập kế hoạch sự kiện chi tiết và khả thi
- Phân bổ tình nguyện viên hiệu quả theo kỹ năng
- Dự đoán và quản lý rủi ro sự kiện
- Đánh giá thành công và đưa ra cải thiện

Mục tiêu: Tạo ra những sự kiện có ý nghĩa, an toàn và hiệu quả.`,
        behaviorInstructions:
          "Tập trung vào tính thực tế và khả thi. Luôn xem xét ngân sách và nguồn lực có sẵn.",
        dataAccessRules:
          "Truy cập: events, registrations, feedback, performance data, volunteer allocations, budget information",
      },
    };

    return (
      templates[templateId as keyof typeof templates] || {
        instructionName: "Hướng dẫn AI tùy chỉnh",
        systemPrompt: "Bạn là trợ lý AI hỗ trợ quản lý hoạt động tình nguyện.",
        behaviorInstructions: "",
        dataAccessRules: "",
      }
    );
  }

  /**
   * Get current Gemini configuration (Admin only)
   */
  async getGeminiConfig(): Promise<ApiResponse<object>> {
    try {
      const response = await this.api.get<object>(
        `${this.baseEndpoint}/admin/gemini-config`
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch Gemini configuration", 500);
    }
  }

  /**
   * Get available Gemini models (Admin only)
   */
  async getAvailableModels(): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.api.get<string[]>(
        `${this.baseEndpoint}/admin/gemini-models`
      );
      return response;
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
