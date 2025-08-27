import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  X,
  Bot,
  MessageSquare,
  Shield,
  Database,
  AlertCircle,
} from "lucide-react";
import type { InstructionFormData, AiCustomInstructionDTO } from "@/types/ai";

interface InstructionPreviewProps {
  data?: InstructionFormData | AiCustomInstructionDTO;
  onClose: () => void;
}

export default function InstructionPreview({
  data,
  onClose,
}: InstructionPreviewProps) {
  if (!data) return null;

  // Determine data type and extract fields
  const isFormData = "isActive" in data && !("instructionId" in data);
  const isInstruction = "instructionId" in data;

  const instructionName = "instructionName" in data ? data.instructionName : "";
  const systemPrompt = "systemPrompt" in data ? data.systemPrompt : "";
  const behaviorInstructions =
    "behaviorInstructions" in data ? data.behaviorInstructions : "";
  // Note: dataAccessRules field removed as it no longer exists in backend
  const isActive = isFormData
    ? data.isActive
    : isInstruction
    ? data.isActive
    : true;
  // Generate sample response based on the instruction
  const generateSampleResponse = () => {
    return `Dựa trên vai trò của tôi như được định nghĩa, tôi sẽ phân tích câu hỏi của bạn và cung cấp những insights dựa trên dữ liệu và kinh nghiệm.

**Approach của tôi:**
1. **Data-driven Analysis**: Sử dụng available data để đưa ra insights
2. **Strategic Thinking**: Nhìn từ góc độ strategic và long-term impact  
3. **Actionable Recommendations**: Đưa ra specific steps có thể implement
4. **Continuous Learning**: Learn từ feedback để improve future responses

Bạn có câu hỏi cụ thể nào tôi có thể hỗ trợ không?`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 rounded-2xl max-w-4xl w-full h-[95vh] flex flex-col border border-blue-200 dark:border-blue-800 shadow-2xl">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Chi tiết Hướng dẫn AI
              </h3>
              <p className="text-sm text-muted-foreground">
                {instructionName || "Hướng dẫn AI"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <Card className="card-hover bg-gradient-to-br from-white to-cyan-50 dark:from-gray-900 dark:to-cyan-950 border-cyan-200 dark:border-cyan-800 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 border-b border-cyan-200 dark:border-cyan-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300">
                    <Bot className="h-5 w-5" />
                    <span>Thông tin cơ bản</span>
                  </CardTitle>
                  {isInstruction && (
                    <Badge variant={isActive ? "default" : "secondary"} className="shadow-sm">
                      {isActive ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    Tên hướng dẫn
                  </Label>
                  <p className="mt-1 text-sm text-foreground">
                    {instructionName || "Chưa đặt tên"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card className="card-hover bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-b border-blue-200 dark:border-blue-700">
                <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <MessageSquare className="h-5 w-5" />
                  <span>System Prompt</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Định nghĩa vai trò và nhiệm vụ chính của AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-4 max-h-[300px] overflow-y-auto border border-blue-200 dark:border-blue-800">
                  <pre className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap font-sans">
                    {systemPrompt || "Chưa có system prompt"}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Behavior Instructions */}
            {behaviorInstructions && (
              <Card className="card-hover bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border-indigo-200 dark:border-indigo-800 shadow-lg rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-b border-indigo-200 dark:border-indigo-700">
                  <CardTitle className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
                    <Shield className="h-5 w-5" />
                    <span>Hướng dẫn hành vi</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Phong cách giao tiếp và cách thức tương tác
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-4 max-h-[200px] overflow-y-auto border border-indigo-200 dark:border-indigo-800">
                    <pre className="text-sm text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap font-sans">
                      {behaviorInstructions}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Note: Data Access Rules section removed as field no longer exists in backend */}

            {/* Sample Response */}
            <Card className="card-hover bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-b border-purple-200 dark:border-purple-700">
                <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <MessageSquare className="h-5 w-5" />
                  <span>Ví dụ phản hồi</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Mô phỏng cách AI sẽ phản hồi với hướng dẫn này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="mb-3">
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                      <strong>Câu hỏi mẫu:</strong> "Làm thế nào để tăng số
                      lượng tình nguyện viên tham gia sự kiện?"
                    </div>
                    <Separator className="mb-3 bg-purple-200 dark:bg-purple-700" />
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      <strong>AI Response:</strong>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded p-3 border border-purple-200 dark:border-purple-700 shadow-sm">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                      {generateSampleResponse()}
                    </pre>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400 mt-4">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      Đây chỉ là ví dụ mô phỏng, phản hồi thực tế có thể khác
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Label component for consistent styling
function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
}
