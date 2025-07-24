import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
} from "lucide-react";
import { chatBotService } from "@/services/chatBotService";
import type { ChatMessage } from "@/types/chatbot";

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simple toast function
  const showToast = (message: string, type: "success" | "error" = "error") => {
    // Simple alert for now - can be replaced with proper toast later
    if (type === "error") {
      alert(`Lỗi: ${message}`);
    } else {
      alert(message);
    }
  };

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo conversation với tin nhắn chào mừng
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        message: "",
        response:
          "Xin chào Admin! Tôi là trợ lý AI của hệ thống IVAN. Tôi có thể giúp bạn quản lý tình nguyện viên, tổ chức sự kiện, và các hoạt động khác trong hệ thống. Bạn cần hỗ trợ gì hôm nay?",
        timestamp: new Date(),
        isUser: false,
        conversationId: "",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      timestamp: new Date(),
      isUser: true,
      conversationId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatBotService.sendMessage({
        message: inputMessage,
        conversationId: conversationId || undefined,
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "",
        response: response.response,
        timestamp: new Date(response.timestamp),
        isUser: false,
        conversationId: response.conversationId,
      };

      setMessages((prev) => [...prev, botMessage]);
      setConversationId(response.conversationId);
    } catch (error: any) {
      console.error("Error sending message:", error);
      showToast(
        error.message || "Không thể gửi tin nhắn. Vui lòng thử lại.",
        "error"
      );

      // Thêm tin nhắn lỗi vào chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "",
        response: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
        timestamp: new Date(),
        isUser: false,
        conversationId,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId("");
    // Thêm lại tin nhắn chào mừng
    const welcomeMessage: ChatMessage = {
      id: "welcome-new",
      message: "",
      response:
        "Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì cho bạn khác?",
      timestamp: new Date(),
      isUser: false,
      conversationId: "",
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-80 ${
          isMinimized ? "h-14" : "h-96"
        } shadow-xl border-2 border-blue-200 transition-all duration-300`}
      >
        <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">
                IVAN AI Assistant
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-800"
              >
                Online
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {" "}
            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[85%] ${
                        message.isUser ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          message.isUser ? "bg-blue-500" : "bg-gray-500"
                        }`}
                      >
                        {message.isUser ? (
                          <User className="h-3 w-3 text-white" />
                        ) : (
                          <Bot className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-2 text-sm ${
                          message.isUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.isUser ? message.message : message.response}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.isUser ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* Input Area */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Gõ tin nhắn của bạn..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  {messages.length > 1 && `${messages.length - 1} tin nhắn`}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Làm mới
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
