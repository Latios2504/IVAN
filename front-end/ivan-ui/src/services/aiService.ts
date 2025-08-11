import { apiClient, ApiError } from "./apiClient";
import type { AiQueryRequest, AiResponse } from "../types/ai";
import type { ChatMessageRequest, ChatMessageResponse } from "../types/chatbot";

/**
 * Unified AI Service for all AI operations
 * Handles both general queries and chatbot interactions
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
    conversationId?: string;
    clientMessages?: Array<{
      role: "user" | "assistant";
      content: string;
      timestamp?: string;
    }>;
    clientSummary?: string;
  }): Promise<AiResponse> {
    const aiRequest: AiQueryRequest = {
      query: request.query,
      customInstructionId: request.customInstructionId,
      preferredModel: request.preferredModel,
      includeContext: request.includeContext ?? true,
      conversationId: request.conversationId,
      clientMessages: request.clientMessages,
      clientSummary: request.clientSummary,
    };

    const response = await apiClient.post<AiResponse>("/Ai/query", aiRequest);
    return response.data;
  }

  /**
   * Send a chatbot message - simplified interface for chat interactions
   * This is a wrapper around sendQuery for chatbot-specific use cases
   */
  async sendChatMessage(
    request: ChatMessageRequest & {
      clientMessages?: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp?: string;
      }>;
      clientSummary?: string;
    }
  ): Promise<ChatMessageResponse> {
    // Use the AI query endpoint with chatbot-optimized parameters
    const aiRequest: AiQueryRequest = {
      query: request.message,
      customInstructionId: undefined, // Chatbot uses default instructions
      preferredModel: undefined, // Use default model
      includeContext: true,
      conversationId: request.conversationId,
      clientMessages: request.clientMessages,
      clientSummary: request.clientSummary,
    };

    const response = await apiClient.post<AiResponse>("/Ai/query", aiRequest);

    // Convert AI response to chatbot response format
    const chatResponse: ChatMessageResponse = {
      response: response.data.response,
      conversationId: request.conversationId || "",
      timestamp: response.data.generatedAt || new Date().toISOString(),
      modelUsed: response.data.modelUsed,
      customInstructionUsed: response.data.customInstructionUsed,
    };

    return chatResponse;
  }
}

// Export singleton instance
export const aiService = new AiService();
