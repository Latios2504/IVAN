import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import ChatBot from "./ChatBot";

const ChatBotFloatingButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Hiển thị cho tất cả user đã đăng nhập
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-4 z-[9998] w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Bot Component */}
      <ChatBot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </>
  );
};

export default ChatBotFloatingButton;
