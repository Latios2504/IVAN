import type { ChatMessageRequest, ChatMessageResponse, AiQueryRequest } from "../types/ai";
import { aiService } from "./aiService";
import { apiClient } from "./apiClient";

class ChatBotService {
  async sendMessage(
    request: ChatMessageRequest & {
      clientMessages?: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp?: string;
      }>;
      clientSummary?: string;
    }
  ): Promise<ChatMessageResponse> {
    try {
      // Use the AI query endpoint with fixed custom instruction ID = 1
      const aiRequest: AiQueryRequest = {
        query: request.message,
        customInstructionId: 1,
        preferredModel: undefined, // Use default model
        includeContext: true,
        conversationId: request.conversationId,
        clientMessages: request.clientMessages,
        clientSummary: request.clientSummary,
      };

      const response = await apiClient.post<any>("/Ai/query", aiRequest);

      // ApiClient already throws Error for failures, so we only get here on success
      const aiResponseData = response.data!;

      // Convert AI response to chatbot response format
      const chatResponse: ChatMessageResponse = {
        response: aiResponseData.response,
        conversationId: request.conversationId || "",
        timestamp: new Date().toISOString(),
        modelUsed: aiResponseData.modelUsed,
        customInstructionUsed: aiResponseData.customInstructionUsed,
        executionTimeMs: aiResponseData.executionTimeMs,
      };

      return chatResponse;
    } catch (error) {
      console.error("Error in chatbot service:", error);
      
      // Fallback to original aiService method
      return await aiService.sendChatMessage(request);
    }
  }


}

export const chatBotService = new ChatBotService();
