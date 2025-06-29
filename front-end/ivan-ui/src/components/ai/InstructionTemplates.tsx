import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Users, 
  Calendar, 
  Building, 
  BarChart3, 
  Star,
  Plus,
  Eye,
  Zap
} from "lucide-react";
import { 
  InstructionCategory,
  type InstructionTemplate, 
  type AiCustomInstructionCreateDTO 
} from "@/types/ai-instructions";

interface InstructionTemplatesProps {
  onSelectTemplate: (template: AiCustomInstructionCreateDTO) => void;
  onPreviewTemplate: (template: InstructionTemplate) => void;
}

const PREDEFINED_TEMPLATES: InstructionTemplate[] = [
  {
    id: "volunteer-manager",
    name: "Trợ lý Quản lý Tình nguyện viên",
    category: InstructionCategory.VOLUNTEER_MANAGEMENT,
    description: "Chuyên về tuyển dụng, lập lịch và quản lý hiệu suất tình nguyện viên. Hỗ trợ chiến lược giữ chân và phát triển.",
    systemPrompt: `Bạn là trợ lý AI chuyên về quản lý tình nguyện viên cho tổ chức từ thiện. 
        
Nhiệm vụ chính:
- Hỗ trợ tuyển dụng và sàng lọc tình nguyện viên phù hợp
- Tư vấn lập lịch và phân công nhiệm vụ theo kỹ năng
- Theo dõi và đánh giá hiệu suất làm việc
- Đề xuất chiến lược giữ chân và phát triển tình nguyện viên
- Hỗ trợ đào tạo và phát triển kỹ năng

Luôn ưu tiên sự an toàn, phúc lợi và sự phát triển của tình nguyện viên.`,
    behaviorInstructions: "Luôn thân thiện, hỗ trợ và đưa ra lời khuyên thực tế. Tôn trọng thời gian và khả năng của từng tình nguyện viên. Khuyến khích sự phát triển cá nhân.",
    dataAccessRules: "Truy cập: volunteer profiles, skills, availability, performance metrics, event assignments, training records, feedback data",
    tags: ["tình nguyện viên", "tuyển dụng", "lập lịch", "hiệu suất"],
    isPopular: true,
  },
  {
    id: "event-planner",
    name: "Chuyên gia Tổ chức Sự kiện",
    category: InstructionCategory.EVENT_PLANNING,
    description: "Chuyên về lập kế hoạch sự kiện, phân bổ nguồn lực và đánh giá hiệu quả. Tối ưu hóa trải nghiệm người tham gia.",
    systemPrompt: `Bạn là chuyên gia AI về tổ chức sự kiện từ thiện và xã hội.

Chuyên môn:
- Lập kế hoạch sự kiện chi tiết và khả thi
- Phân bổ tình nguyện viên hiệu quả theo kỹ năng và kinh nghiệm
- Dự đoán và quản lý rủi ro sự kiện
- Tối ưu hóa ngân sách và nguồn lực
- Đánh giá thành công và đưa ra cải thiện
- Đảm bảo trải nghiệm tích cực cho người tham gia

Mục tiêu: Tạo ra những sự kiện có ý nghĩa, an toàn và hiệu quả cao.`,
    behaviorInstructions: "Tập trung vào tính thực tế và khả thi. Luôn xem xét ngân sách và nguồn lực có sẵn. Đưa ra timeline cụ thể và có thể thực hiện.",
    dataAccessRules: "Truy cập: events, registrations, feedback, performance data, volunteer allocations, budget information, venue details",
    tags: ["sự kiện", "lập kế hoạch", "phân bổ", "hiệu quả"],
    isPopular: true,
  },
  {
    id: "partner-specialist",
    name: "Chuyên gia Quan hệ Đối tác",
    category: InstructionCategory.PARTNER_RELATIONS,
    description: "Chuyên về phát triển quan hệ đối tác, đàm phán hợp tác và quản lý mối quan hệ dài hạn với các tổ chức.",
    systemPrompt: `Bạn là chuyên gia AI về quan hệ đối tác và hợp tác chiến lược.

Chuyên môn:
- Phát triển và duy trì quan hệ đối tác hiệu quả
- Tư vấn đàm phán và quản lý hợp tác
- Đánh giá hiệu quả và ROI của đối tác
- Tìm kiếm cơ hội hợp tác mới phù hợp
- Xây dựng chiến lược partnership dài hạn
- Quản lý xung đột và giải quyết vấn đề

Nguyên tắc: Xây dựng mối quan hệ win-win bền vững.`,
    behaviorInstructions: "Ưu tiên xây dựng mối quan hệ lâu dài và có lợi cho cả hai bên. Luôn chuyên nghiệp, minh bạch và đáng tin cậy trong giao tiếp.",
    dataAccessRules: "Truy cập: partner profiles, collaborations, communication history, partnership metrics, contract information",
    tags: ["đối tác", "hợp tác", "đàm phán", "quan hệ"],
  },
  {
    id: "data-analyst",
    name: "Chuyên gia Phân tích Dữ liệu",
    category: InstructionCategory.DATA_ANALYTICS,
    description: "Chuyên về phân tích dữ liệu tổ chức, tạo báo cáo insights và dự đoán xu hướng để hỗ trợ ra quyết định.",
    systemPrompt: `Bạn là chuyên gia AI về phân tích dữ liệu và business intelligence.

Chuyên môn:
- Phân tích xu hướng và patterns trong dữ liệu
- Tạo báo cáo insights và recommendations actionable
- Xây dựng dashboard và visualization trực quan
- Dự đoán và mô hình hóa dữ liệu
- Đánh giá hiệu quả hoạt động và KPIs
- Hỗ trợ ra quyết định dựa trên dữ liệu

Mục tiêu: Biến dữ liệu thành insights có giá trị thực tế.`,
    behaviorInstructions: "Luôn cung cấp dữ liệu chính xác và insights có thể hành động. Giải thích rõ ràng các phân tích phức tạp bằng ngôn ngữ dễ hiểu.",
    dataAccessRules: "Truy cập: comprehensive analytics across all modules, trends, performance metrics, financial data, user behavior data",
    tags: ["phân tích", "dữ liệu", "báo cáo", "dự đoán"],
    isPopular: true,
  },
  {
    id: "general-assistant",
    name: "Trợ lý Tổng hợp",
    category: InstructionCategory.CUSTOM,
    description: "Trợ lý đa năng hỗ trợ các hoạt động quản lý tổ chức từ thiện. Phù hợp cho các tác vụ chung và tư vấn cơ bản.",
    systemPrompt: `Bạn là trợ lý AI đa năng cho tổ chức từ thiện và tình nguyện.

Hỗ trợ:
- Trả lời câu hỏi về hoạt động tổ chức
- Hướng dẫn quy trình và thủ tục
- Tư vấn cơ bản về quản lý
- Hỗ trợ lập kế hoạch và tổ chức
- Giải đáp thắc mắc về dữ liệu

Luôn hỗ trợ với tinh thần tích cực và xây dựng.`,
    behaviorInstructions: "Thân thiện, hữu ích và luôn sẵn sàng hỗ trợ. Khi không chắc chắn, hãy hướng dẫn người dùng đến chuyên gia phù hợp.",
    dataAccessRules: "Truy cập: basic data across all modules, general statistics, public information",
    tags: ["tổng hợp", "đa năng", "hỗ trợ", "cơ bản"],
  },
];

const getCategoryIcon = (category: InstructionCategory) => {
  switch (category) {
    case InstructionCategory.VOLUNTEER_MANAGEMENT:
      return <Users className="h-5 w-5" />;
    case InstructionCategory.EVENT_PLANNING:
      return <Calendar className="h-5 w-5" />;
    case InstructionCategory.PARTNER_RELATIONS:
      return <Building className="h-5 w-5" />;
    case InstructionCategory.DATA_ANALYTICS:
      return <BarChart3 className="h-5 w-5" />;
    default:
      return <Bot className="h-5 w-5" />;
  }
};

const getCategoryLabel = (category: InstructionCategory) => {
  switch (category) {
    case InstructionCategory.VOLUNTEER_MANAGEMENT:
      return "Quản lý Tình nguyện viên";
    case InstructionCategory.EVENT_PLANNING:
      return "Tổ chức Sự kiện";
    case InstructionCategory.PARTNER_RELATIONS:
      return "Quan hệ Đối tác";
    case InstructionCategory.DATA_ANALYTICS:
      return "Phân tích Dữ liệu";
    default:
      return "Tùy chỉnh";
  }
};

const getCategoryColor = (category: InstructionCategory) => {
  switch (category) {
    case InstructionCategory.VOLUNTEER_MANAGEMENT:
      return "bg-blue-100 text-blue-800";
    case InstructionCategory.EVENT_PLANNING:
      return "bg-green-100 text-green-800";
    case InstructionCategory.PARTNER_RELATIONS:
      return "bg-purple-100 text-purple-800";
    case InstructionCategory.DATA_ANALYTICS:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function InstructionTemplates({ 
  onSelectTemplate, 
  onPreviewTemplate 
}: InstructionTemplatesProps) {
  const handleSelectTemplate = (template: InstructionTemplate) => {
    const instructionData: AiCustomInstructionCreateDTO = {
      instructionName: template.name,
      systemPrompt: template.systemPrompt,
      behaviorInstructions: template.behaviorInstructions || "",
      dataAccessRules: template.dataAccessRules || "",
    };
    onSelectTemplate(instructionData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Mẫu Hướng dẫn AI
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Chọn một mẫu để bắt đầu hoặc tạo hướng dẫn tùy chỉnh từ đầu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREDEFINED_TEMPLATES.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-md transition-shadow relative"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(template.category)}
                  <CardTitle className="text-base leading-tight">
                    {template.name}
                  </CardTitle>
                </div>
                {template.isPopular && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Phổ biến
                  </Badge>
                )}
              </div>
              
              <Badge 
                variant="outline" 
                className={`w-fit ${getCategoryColor(template.category)}`}
              >
                {getCategoryLabel(template.category)}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <CardDescription className="text-sm line-clamp-3">
                {template.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreviewTemplate(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem trước
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSelectTemplate(template)}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Sử dụng
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create from scratch option */}
        <Card className="hover:shadow-md transition-shadow border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Zap className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-base">Tạo từ đầu</CardTitle>
              <CardDescription className="text-sm mt-1">
                Xây dựng hướng dẫn AI hoàn toàn tùy chỉnh theo nhu cầu cụ thể
              </CardDescription>
            </div>
            <Button
              onClick={() => onSelectTemplate({
                instructionName: "",
                systemPrompt: "",
                behaviorInstructions: "",
                dataAccessRules: "",
              })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Bắt đầu tạo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
