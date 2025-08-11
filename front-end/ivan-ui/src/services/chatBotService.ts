import type { ChatMessageRequest, ChatMessageResponse } from "../types/chatbot";
import { aiService } from "./aiService";

/**
 * ChatBot Service - Simplified wrapper around aiService
 * Provides chatbot-specific interface while delegating to the unified AI service
 */
class ChatBotService {
  /**
   * Send a chatbot message using the unified AI service
   */
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
    // Delegate to the unified AI service
    return await aiService.sendChatMessage(request);
  }
}

export const chatBotService = new ChatBotService();
