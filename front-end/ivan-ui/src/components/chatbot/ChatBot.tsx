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
import { aiService } from "@/services/aiService";
import type { ChatMessage } from "@/types/ai";
import MarkdownRenderer from "./MarkdownRenderer";

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
  const [summary, setSummary] = useState<string>("");
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

  // Load existing chat from localStorage or create welcome message
  useEffect(() => {
    if (!isOpen) return;

    const storedId = localStorage.getItem("ivan_chat_conversation_id");
    const storedMsgs = localStorage.getItem("ivan_chat_messages");
    const storedSummary = localStorage.getItem("ivan_chat_summary") || "";

    if (storedId) setConversationId(storedId);
    if (storedSummary) setSummary(storedSummary);

    if (storedMsgs) {
      try {
        const parsed: any[] = JSON.parse(storedMsgs);
        const restored: ChatMessage[] = parsed.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        if (restored.length > 0) {
          setMessages(restored);
          return;
        }
      } catch {}
    }

    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        message: "",
        response:
          "Xin chào! Tôi là trợ lý AI của hệ thống IVAN. Tôi có thể giúp bạn quản lý tình nguyện viên, tổ chức sự kiện, và các hoạt động khác trong hệ thống. Bạn cần hỗ trợ gì hôm nay?",
        timestamp: new Date(),
        isUser: false,
        conversationId: "",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Persist messages and summary to localStorage
  useEffect(() => {
    if (!isOpen) return;
    const toStore = messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    localStorage.setItem("ivan_chat_messages", JSON.stringify(toStore));
    localStorage.setItem("ivan_chat_conversation_id", conversationId || "");
    localStorage.setItem("ivan_chat_summary", summary || "");
  }, [isOpen, messages, conversationId, summary]);

  const generateConversationId = () => {
    return (
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) + ""
    );
  };

  // Keep a small rolling window and lightweight summary
  const buildClientMemory = (allMessages: ChatMessage[]) => {
    const pairs = allMessages.filter(
      (m) => m.isUser || (!m.isUser && m.response)
    );
    const recent = pairs.slice(-8); // last 8 turns/items
    const clientMessages = recent.map((m) => ({
      role: m.isUser ? ("user" as const) : ("assistant" as const),
      content: m.isUser ? m.message : m.response || "",
      timestamp: m.timestamp.toISOString(),
    }));

    // Extremely naive summarization: keep first and last user questions, plus count
    const userTexts = pairs.filter((m) => m.isUser).map((m) => m.message);
    const first = userTexts[0] || "";
    const last = userTexts[userTexts.length - 1] || "";
    const sum = `Tóm tắt ngắn: ${
      userTexts.length
    } lượt trao đổi. Chủ đề ban đầu: "${first.slice(
      0,
      120
    )}". Gần đây: "${last.slice(0, 120)}".`;

    return { clientMessages, clientSummary: sum };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      timestamp: new Date(),
      isUser: true,
      conversationId,
    };

    // Prepare new state for memory computation
    const nextMessages = [...messages, userMessage];
    const { clientMessages, clientSummary } = buildClientMemory(nextMessages);
    setMessages(nextMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Always use customInstructionId = 1 for chatbot
      const response = await aiService.sendQuery({
        query: inputMessage,
        customInstructionId: 1,
        preferredModel: undefined,
        includeContext: true,
        conversationId:
          conversationId && conversationId.length > 0
            ? conversationId
            : generateConversationId(),
        clientMessages,
        clientSummary,
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "",
        response: response.response,
        timestamp: new Date(response.generatedAt || new Date()),
        isUser: false,
        conversationId: conversationId,
      };

      const updated = [...nextMessages, botMessage];
      setMessages(updated);
      if (!conversationId) {
        setConversationId(generateConversationId());
      }
      // update summary with the latest
      const mem2 = buildClientMemory(updated);
      setSummary(mem2.clientSummary);
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
    setSummary("");
    localStorage.removeItem("ivan_chat_messages");
    localStorage.removeItem("ivan_chat_conversation_id");
    localStorage.removeItem("ivan_chat_summary");
    // Thêm lại tin nhắn chào mừng
    const welcomeMessage: ChatMessage = {
      id: "welcome-new",
      message: "",
      response:
        "Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì cho bạn?",
      timestamp: new Date(),
      isUser: false,
      conversationId: "",
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[9999]">
      <Card
        className={`w-96 ${
          isMinimized ? "h-14" : "h-[500px]"
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
          <CardContent className="p-0 flex flex-col h-[440px]">
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
                          {message.isUser ? (
                            message.message
                          ) : (
                            <MarkdownRenderer content={message.response || ""} />
                          )}
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
