import { BaseService } from "./BaseService";
import { ApiError } from "./errorHandler";
import type { ApiResponse } from "../types/common";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

/**
 * Main AI Service for general queries
 * Uses the main AI endpoint that has automatic SQL detection built-in
 */
class AiService extends BaseService {
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

      return await this.post<AiQueryResponse>("/Ai/query", aiRequest);
    } catch (error) {
      this.logError("sendQuery", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to send AI query", 500);
    }
  }
}

// Export singleton instance
export const aiService = new AiService();
