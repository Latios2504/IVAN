import { apiClient } from "./apiClient";
import type { ChatMessageRequest, ChatMessageResponse } from "../types/chatbot";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai";

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
    // Use the AI query endpoint with optional client memory
    const aiRequest: AiQueryRequest = {
      query: request.message,
      customInstructionId: undefined,
      preferredModel: undefined,
      includeContext: true,
      conversationId: request.conversationId,
      clientMessages: request.clientMessages,
      clientSummary: request.clientSummary,
    };

    const response = await apiClient.post<AiQueryResponse>(
      "/Ai/query",
      aiRequest
    );

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

export const chatBotService = new ChatBotService();
