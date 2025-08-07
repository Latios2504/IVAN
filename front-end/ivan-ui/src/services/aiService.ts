import { apiClient, ApiError } from "./apiClient";
import type { ApiResponse } from "../types/common";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

/**
 * Main AI Service for general queries
 * Uses the main AI endpoint that has automatic SQL detection built-in
 */
class AiService {
  /**
   * Send a query to AI with automatic SQL detection
   * The backend will automatically detect if it's a data query and use SQL generation
   */
  async sendQuery(request: {
    query: string;
    customInstructionId?: number;
    preferredModel?: string;
    includeContext?: boolean;
  }): Promise<AiQueryResponse> {
    const aiRequest: AiQueryRequest = {
      query: request.query,
      customInstructionId: request.customInstructionId,
      preferredModel: request.preferredModel,
      includeContext: request.includeContext ?? true,
    };

    const response = await apiClient.post<AiQueryResponse>(
      "/Ai/query",
      aiRequest
    );
    return response.data;
  }
}

// Export singleton instance
export const aiService = new AiService();
