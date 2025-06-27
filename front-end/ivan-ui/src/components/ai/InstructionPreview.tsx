import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye,
  X,
  Bot,
  MessageSquare,
  Shield,
  Database,
  Check,
  AlertCircle
} from "lucide-react";
import type { 
  InstructionTemplate, 
  InstructionFormData,
  AiCustomInstructionDTO 
} from "@/types/ai-instructions";

interface InstructionPreviewProps {
  data?: InstructionTemplate | InstructionFormData | AiCustomInstructionDTO;
  onClose: () => void;
  onUse?: () => void;
  showUseButton?: boolean;
}

export default function InstructionPreview({ 
  data, 
  onClose, 
  onUse, 
  showUseButton = false 
}: InstructionPreviewProps) {
  if (!data) return null;

  // Determine data type and extract fields
  const isTemplate = 'category' in data && 'tags' in data;
  const isFormData = 'isActive' in data && !('instructionId' in data);
  const isInstruction = 'instructionId' in data;

  const instructionName = isTemplate ? data.name : 
                         'instructionName' in data ? data.instructionName : '';
  const systemPrompt = 'systemPrompt' in data ? data.systemPrompt : '';
  const behaviorInstructions = 'behaviorInstructions' in data ? data.behaviorInstructions : '';
  const dataAccessRules = 'dataAccessRules' in data ? data.dataAccessRules : '';
  const description = isTemplate ? data.description : '';
  const tags = isTemplate ? data.tags : [];
  const isActive = isFormData ? data.isActive : isInstruction ? data.isActive : true;

  // Sample query for demonstration
  const sampleQuery = "Làm thế nào để tôi có thể tăng số lượng tình nguyện viên tham gia các hoạt động?";
  
  // Generate sample response based on the instruction
  const generateSampleResponse = () => {
    if (instructionName.toLowerCase().includes('tình nguyện viên')) {
      return `Dựa trên dữ liệu hiện tại của tổ chức, tôi khuyến nghị các chiến lược sau để tăng tham gia của tình nguyện viên:

1. **Cải thiện quy trình tuyển dụng:**
   - Đơn giản hóa form đăng ký
   - Tăng cường quảng bá trên social media
   - Tạo video giới thiệu hoạt động

2. **Nâng cao trải nghiệm:**
   - Cung cấp training đầy đủ
   - Ghi nhận và tôn vinh đóng góp
   - Tạo cơ hội networking

3. **Phân tích dữ liệu cho thấy:**
   - 70% tình nguyện viên quan tâm đến flexibility
   - Các hoạt động cuối tuần có tỷ lệ tham gia cao hơn 40%

Bạn có muốn tôi phân tích chi tiết hơn về một khía cạnh nào không?`;
    }
    
    if (instructionName.toLowerCase().includes('sự kiện')) {
      return `Để tăng hiệu quả tổ chức sự kiện và thu hút tình nguyện viên, tôi đề xuất:

1. **Lập kế hoạch sự kiện hấp dẫn:**
   - Chọn chủ đề phù hợp với sứ mệnh tổ chức
   - Lên timeline chi tiết và realistic
   - Đảm bảo logistics đầy đủ

2. **Chiến lược recruitment:**
   - Tạo job description rõ ràng cho từng vị trí
   - Sử dụng network hiện tại để referral
   - Đăng tuyển sớm và đa kênh

3. **Dựa trên phân tích event trước:**
   - Events có catering thu hút nhiều volunteers hơn 25%
   - Thời gian 2-4 tiếng là optimal
   - Weekend events có retention rate cao hơn

Tôi có thể hỗ trợ bạn lập timeline cụ thể cho sự kiện sắp tới không?`;
    }

    return `Dựa trên vai trò của tôi như được định nghĩa, tôi sẽ phân tích câu hỏi của bạn và cung cấp những insights dựa trên dữ liệu và kinh nghiệm quản lý tổ chức.

Để tăng số lượng tình nguyện viên tham gia, tôi khuyến nghị:

1. **Phân tích dữ liệu hiện tại** để hiểu patterns và preferences
2. **Cải thiện communication strategy** để reach target audience
3. **Tối ưu hóa onboarding process** để giảm dropout rate
4. **Xây dựng community** để tăng long-term engagement

Bạn có muốn tôi đi sâu vào từng chiến lược cụ thể không?`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Xem trước Hướng dẫn AI
              </h3>
              <p className="text-sm text-gray-600">
                {instructionName || "Hướng dẫn AI tùy chỉnh"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showUseButton && onUse && (
              <Button onClick={onUse}>
                <Check className="h-4 w-4 mr-2" />
                Sử dụng mẫu này
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
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
                  <Label className="text-sm font-medium text-gray-700">Tên hướng dẫn</Label>
                  <p className="mt-1 text-sm text-gray-900">{instructionName || "Chưa đặt tên"}</p>
                </div>
                
                {description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                )}

                {tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                <div className="bg-gray-50 rounded-lg p-4">
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
                  <div className="bg-blue-50 rounded-lg p-4">
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
                  <div className="bg-green-50 rounded-lg p-4">
                    <pre className="text-sm text-green-800 whitespace-pre-wrap font-sans">
                      {dataAccessRules}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Interaction */}
            <Card>
              <CardHeader>
                <CardTitle>Ví dụ tương tác</CardTitle>
                <CardDescription>
                  Mô phỏng cách AI sẽ phản hồi với hướng dẫn này
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Question */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">U</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex-1">
                    <p className="text-sm text-gray-800">{sampleQuery}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 flex-1">
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                      {generateSampleResponse()}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-4">
                  <AlertCircle className="h-3 w-3" />
                  <span>Đây chỉ là ví dụ mô phỏng, phản hồi thực tế có thể khác</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Helper Label component for consistent styling
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
}
