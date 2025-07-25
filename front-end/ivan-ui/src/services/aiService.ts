import { apiClient } from "./apiClient";
import { ApiError } from "./errorHandler";
import type { ApiResponse } from "../types/common";

import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

/**
 * Main AI Service for general queries
 * Uses the main AI endpoint that has automatic SQL detection built-in
 */
class AiService {
  private get api() {
    return apiClient;
  }

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
    try {
      const aiRequest: AiQueryRequest = {
        query: request.query,
        customInstructionId: request.customInstructionId,
        preferredModel: request.preferredModel,
        includeContext: request.includeContext ?? true,
      };

      const response = await this.api.post<AiQueryResponse>(
        "/Ai/query",
        aiRequest
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to send AI query", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to send AI query", 500);
    }
  }
}

// Export singleton instance
export const aiService = new AiService();
