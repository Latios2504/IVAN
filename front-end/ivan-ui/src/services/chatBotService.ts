import type { ChatMessageRequest, ChatMessageResponse, AiQueryRequest } from "../types/ai";
import { aiService } from "./aiService";
import { chatbotConfigurationService } from "./chatbotConfigurationService";
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
      // Get default custom instruction ID from configuration
      const defaultCustomInstructionId = await chatbotConfigurationService.getDefaultCustomInstructionId();
      
      // Use the AI query endpoint with default custom instruction
      const aiRequest: AiQueryRequest = {
        query: request.message,
        customInstructionId: defaultCustomInstructionId ?? undefined, // Convert null to undefined
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
      
      // Fallback to original aiService method if configuration fails
      return await aiService.sendChatMessage(request);
    }
  }

  /**
   * Get current chatbot configuration (for admin UI)
   */
  async getConfiguration() {
    return await chatbotConfigurationService.getConfiguration();
  }

  /**
   * Set default custom instruction (Admin only)
   */
  async setDefaultInstruction(instructionId: number | null): Promise<boolean> {
    return await chatbotConfigurationService.setDefaultInstruction(instructionId);
  }

  /**
   * Get available custom instructions for admin selection
   */
  async getAvailableInstructions() {
    return await chatbotConfigurationService.getAvailableInstructions();
  }

  /**
   * Clear configuration cache
   */
  async clearCache(): Promise<boolean> {
    return await chatbotConfigurationService.clearServerCache();
  }
}

export const chatBotService = new ChatBotService();
