import { BaseService } from "./BaseService";
import { ApiError } from "./errorHandler";
import type { ChatMessageRequest, ChatMessageResponse } from "../types/chatbot";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

class ChatBotService extends BaseService {
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    try {
      // Use the AI query endpoint instead of non-existent chatbot endpoint
      const aiRequest: AiQueryRequest = {
        query: request.message,
        customInstructionId: undefined, // No specific instruction for chatbot
        preferredModel: undefined, // Use default model
        includeContext: true, // Include user role context
      };

      const aiResponse = await this.post<AiQueryResponse>(
        "/Ai/query",
        aiRequest
      );

      // Convert AI response to chatbot response format
      const chatResponse: ChatMessageResponse = {
        response: aiResponse.response,
        conversationId: request.conversationId || "", // Keep existing conversation ID
        timestamp: aiResponse.generatedAt || new Date().toISOString(),
        modelUsed: aiResponse.modelUsed,
        customInstructionUsed: aiResponse.customInstructionUsed,
      };

      return chatResponse;
    } catch (error) {
      this.logError("sendMessage", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to send message to chatbot", 500);
    }
  }
}

export const chatBotService = new ChatBotService();
