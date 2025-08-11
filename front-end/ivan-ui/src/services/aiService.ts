import { apiClient, ApiError } from "./apiClient";
import type {
  AiQueryRequest,
  AiResponse,
  ChatMessageRequest,
  ChatMessageResponse,
} from "../types/ai";

class AiService {
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
      customInstructionId: undefined, // Public chatbot uses default instructions only
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

export const aiService = new AiService();
