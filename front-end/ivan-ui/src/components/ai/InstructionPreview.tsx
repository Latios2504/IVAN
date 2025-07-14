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
import type {
  InstructionFormData,
  AiCustomInstructionDTO,
} from "@/types/ai";

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
  const dataAccessRules = "dataAccessRules" in data ? data.dataAccessRules : "";
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
      <div className="bg-white rounded-lg max-w-4xl w-full h-[95vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết Hướng dẫn AI
              </h3>
              <p className="text-sm text-gray-600">
                {instructionName || "Hướng dẫn AI"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>Thông tin cơ bản</span>
                  </CardTitle>
                  {isInstruction && (
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Tên hướng dẫn
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {instructionName || "Chưa đặt tên"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>System Prompt</span>
                </CardTitle>
                <CardDescription>
                  Định nghĩa vai trò và nhiệm vụ chính của AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {systemPrompt || "Chưa có system prompt"}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Behavior Instructions */}
            {behaviorInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Hướng dẫn hành vi</span>
                  </CardTitle>
                  <CardDescription>
                    Phong cách giao tiếp và cách thức tương tác
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                      {behaviorInstructions}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Access Rules */}
            {dataAccessRules && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Quy tắc truy cập dữ liệu</span>
                  </CardTitle>
                  <CardDescription>
                    Dữ liệu AI có thể truy cập và sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 rounded-lg p-4 max-h-[150px] overflow-y-auto">
                    <pre className="text-sm text-green-800 whitespace-pre-wrap font-sans">
                      {dataAccessRules}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Response */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Ví dụ phản hồi</span>
                </CardTitle>
                <CardDescription>
                  Mô phỏng cách AI sẽ phản hồi với hướng dẫn này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Câu hỏi mẫu:</strong> "Làm thế nào để tăng số
                      lượng tình nguyện viên tham gia sự kiện?"
                    </div>
                    <Separator className="mb-3" />
                    <div className="text-sm text-gray-700">
                      <strong>AI Response:</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 border border-purple-200">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                      {generateSampleResponse()}
                    </pre>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-4">
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
