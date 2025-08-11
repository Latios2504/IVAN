import type { ChatMessageRequest, ChatMessageResponse } from "../types/ai";
import { aiService } from "./aiService";

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
    return await aiService.sendChatMessage(request);
  }
}

export const chatBotService = new ChatBotService();
