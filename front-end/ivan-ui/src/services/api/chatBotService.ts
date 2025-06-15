import { apiClient } from "./apiClient";
import { ApiError } from "../utils/errorHandler";
import type {
  ChatMessageRequest,
  ChatMessageResponse,
} from "../../types/chatbot";

class ChatBotService {
  private get api() {
    return apiClient;
  }

  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    try {
      const response = await this.api.post<ChatMessageResponse>(
        "/chatbot/send-message",
        request
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to send message", 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to send message to chatbot", 500);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.api.get("/chatbot/health");
      return response.success;
    } catch (error) {
      console.error("ChatBot health check failed:", error);
      return false;
    }
  }
}

export const chatBotService = new ChatBotService();
