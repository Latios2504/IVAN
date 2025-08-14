import { apiClient } from "./apiClient";
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

    const response = await apiClient.post<any>("/Ai/query", aiRequest);

    // ApiClient already throws Error for failures, so we only get here on success
    const aiResponseData = response.data!;

    return {
      success: aiResponseData.success,
      response: aiResponseData.response,
      modelUsed: aiResponseData.modelUsed,
      errorMessage: aiResponseData.errorMessage,
      executionTimeMs: aiResponseData.executionTimeMs,
      generatedAt: aiResponseData.generatedAt,
      customInstructionUsed: aiResponseData.customInstructionUsed,
      isSqlQuery: !!aiResponseData.sqlGenerated,
      sqlData: aiResponseData.sqlData,
    };
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

    const response = await apiClient.post<any>("/Ai/query", aiRequest);

    // ApiClient already throws Error for failures, so we only get here on success
    const aiResponseData = response.data!;

    // Convert AI response to chatbot response format
    const chatResponse: ChatMessageResponse = {
      response: aiResponseData.response,
      conversationId: request.conversationId || "",
      timestamp: aiResponseData.generatedAt || new Date().toISOString(),
      modelUsed: aiResponseData.modelUsed,
      customInstructionUsed: aiResponseData.customInstructionUsed,
    };

    return chatResponse;
  }
}

export const aiService = new AiService();
