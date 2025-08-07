import { apiClient } from "./apiClient";
import type { ChatMessageRequest, ChatMessageResponse } from "../types/chatbot";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

class ChatBotService {
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    // Use the AI query endpoint instead of non-existent chatbot endpoint
    const aiRequest: AiQueryRequest = {
      query: request.message,
      customInstructionId: undefined, // No specific instruction for chatbot
      preferredModel: undefined, // Use default model
      includeContext: true, // Include user role context
    };

    const response = await apiClient.post<AiQueryResponse>(
      "/Ai/query",
      aiRequest
    );

    // Convert AI response to chatbot response format
    const chatResponse: ChatMessageResponse = {
      response: response.data.response,
      conversationId: request.conversationId || "", // Keep existing conversation ID
      timestamp: response.data.generatedAt || new Date().toISOString(),
      modelUsed: response.data.modelUsed,
      customInstructionUsed: response.data.customInstructionUsed,
    };

    return chatResponse;
  }
}

export const chatBotService = new ChatBotService();
