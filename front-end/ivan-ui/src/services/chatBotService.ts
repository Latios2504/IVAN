import { apiClient } from "./apiClient";
import { ApiError } from "./errorHandler";
import type {
  ChatMessageRequest,
  ChatMessageResponse,
} from "../../types/chatbot";

import type { AiQueryRequest, AiQueryResponse } from "../../types/ai";

class ChatBotService {
  private get api() {
    return apiClient;
  }

  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    try {
      // Use the AI query endpoint instead of non-existent chatbot endpoint
      const aiRequest: AiQueryRequest = {
        query: request.message,
        customInstructionId: undefined, // No specific instruction for chatbot
        preferredModel: undefined, // Use default model
        includeContext: true, // Include user role context
      };

      const response = await this.api.post<AiQueryResponse>(
        "/Ai/query",
        aiRequest
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to send message", 400);
      }

      // Convert AI response to chatbot response format
      const chatResponse: ChatMessageResponse = {
        response: response.data.response,
        conversationId: request.conversationId || "", // Keep existing conversation ID
        timestamp: response.data.generatedAt,
        modelUsed: response.data.modelUsed,
        customInstructionUsed: response.data.customInstructionUsed,
      };

      return chatResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to send message to chatbot", 500);
    }
  }
}

export const chatBotService = new ChatBotService();
