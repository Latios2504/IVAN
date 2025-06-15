export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
  conversationId?: string;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

export interface ChatMessageResponse {
  response: string;
  conversationId: string;
  timestamp: string;
}
