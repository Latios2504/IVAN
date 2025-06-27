// AI Instructions Types and DTOs
// Matching backend DTOs for AI Instructions management

export interface AiCustomInstructionDTO {
  instructionId: number;
  createdByUserId: number;
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  dataAccessRules?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    userId: number;
    email: string;
    fullName: string;
  };
}

export interface AiCustomInstructionCreateDTO {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  dataAccessRules?: string;
}

export interface AiCustomInstructionUpdateDTO {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  dataAccessRules?: string;
  isActive: boolean;
}

export interface TestInstructionRequestDTO {
  sampleQuery: string;
}

export interface AiQueryAnalyticsDTO {
  queryId: number;
  userId: number;
  instructionId?: number;
  queryText?: string;
  responseQuality?: number; // 1-5 rating
  executionTime: number; // milliseconds
  dataTablesAccessed?: string;
  createdAt: string;
}

// Frontend-specific types for UI components
export interface InstructionTemplate {
  id: string;
  name: string;
  category: InstructionCategory;
  description: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  dataAccessRules?: string;
  tags: string[];
  isPopular?: boolean;
}

export enum InstructionCategory {
  VOLUNTEER_MANAGEMENT = "volunteer_management",
  EVENT_PLANNING = "event_planning", 
  PARTNER_RELATIONS = "partner_relations",
  DATA_ANALYTICS = "data_analytics",
  CUSTOM = "custom",
}

export interface InstructionPerformance {
  totalQueries: number;
  averageExecutionTime: number;
  averageResponseQuality: number;
  queriesLast7Days: number;
  mostAccessedTables: Record<string, number>;
}

export interface InstructionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface InstructionTestResult {
  success: boolean;
  testPrompt: string;
  expectedResponse?: string;
  actualResponse?: string;
  executionTime?: number;
}

// Form states and UI helpers
export interface InstructionFormData {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions: string;
  dataAccessRules: string;
  isActive: boolean;
}

export interface InstructionFilters {
  category?: InstructionCategory;
  isActive?: boolean;
  isDefault?: boolean;
  searchQuery?: string;
  createdBy?: number;
}

export interface InstructionStats {
  totalInstructions: number;
  activeInstructions: number;
  templatesUsed: number;
  avgResponseQuality: number;
  totalQueries: number;
}

// Predefined instruction templates
export const INSTRUCTION_TEMPLATES: InstructionTemplate[] = [
  {
    id: "volunteer-manager",
    name: "Volunteer Management Assistant",
    category: InstructionCategory.VOLUNTEER_MANAGEMENT,
    description: "Chuyên về tuyển dụng, lập lịch và quản lý tình nguyện viên",
    systemPrompt: `Bạn là trợ lý chuyên về quản lý tình nguyện viên. Hãy giúp tổ chức:
- Tuyển dụng và sàng lọc tình nguyện viên
- Lập lịch và phân công nhiệm vụ
- Theo dõi hiệu suất và phát triển kỹ năng
- Chiến lược giữ chân tình nguyện viên`,
    behaviorInstructions: "Luôn ưu tiên sự an toàn và phúc lợi của tình nguyện viên. Đưa ra lời khuyên thực tế và có thể thực hiện.",
    dataAccessRules: "Truy cập dữ liệu: volunteer profiles, skills, availability, performance metrics, event assignments",
    tags: ["volunteer", "recruitment", "scheduling", "performance"],
    isPopular: true,
  },
  {
    id: "event-planner",
    name: "Event Planning Expert", 
    category: InstructionCategory.EVENT_PLANNING,
    description: "Chuyên về tổ chức sự kiện và phân bổ tình nguyện viên",
    systemPrompt: `Bạn là chuyên gia tổ chức sự kiện. Hãy hỗ trợ:
- Lập kế hoạch và tổ chức sự kiện
- Phân bổ tình nguyện viên hiệu quả
- Đánh giá thành công sự kiện
- Tối ưu hóa quy trình sự kiện`,
    behaviorInstructions: "Tập trung vào việc tạo ra những sự kiện có ý nghĩa và hiệu quả. Luôn xem xét khả năng thực hiện và ngân sách.",
    dataAccessRules: "Truy cập dữ liệu: events, registrations, feedback, performance data, volunteer allocations",
    tags: ["events", "planning", "allocation", "success-metrics"],
    isPopular: true,
  },
  {
    id: "partner-specialist",
    name: "Partner Relations Specialist",
    category: InstructionCategory.PARTNER_RELATIONS,
    description: "Chuyên về quản lý quan hệ đối tác và hợp tác",
    systemPrompt: `Bạn là chuyên gia quan hệ đối tác. Hãy hỗ trợ:
- Phát triển và duy trì quan hệ đối tác
- Đàm phán và quản lý hợp tác
- Đánh giá hiệu quả đối tác
- Tìm kiếm cơ hội hợp tác mới`,
    behaviorInstructions: "Ưu tiên xây dựng mối quan hệ lâu dài và có lợi cho cả hai bên. Luôn chuyên nghiệp và minh bạch.",
    dataAccessRules: "Truy cập dữ liệu: partner profiles, collaborations, communication history, partnership metrics",
    tags: ["partnerships", "collaboration", "relationship-management"],
  },
  {
    id: "data-analyst",
    name: "Data Analytics Assistant",
    category: InstructionCategory.DATA_ANALYTICS,
    description: "Chuyên về phân tích dữ liệu và báo cáo insights",
    systemPrompt: `Bạn là chuyên gia phân tích dữ liệu. Hãy cung cấp:
- Phân tích xu hướng và patterns
- Báo cáo insights và recommendations
- Dự đoán và mô hình hóa
- Dashboard và visualization`,
    behaviorInstructions: "Luôn cung cấp dữ liệu chính xác và insights có thể hành động. Giải thích rõ ràng các phân tích phức tạp.",
    dataAccessRules: "Truy cập dữ liệu: comprehensive analytics across all modules, trends, performance metrics",
    tags: ["analytics", "insights", "reporting", "predictions"],
    isPopular: true,
  },
];

// Export default template names for quick access
export const DEFAULT_INSTRUCTION_NAMES = {
  DEFAULT: "Default AI Assistant",
  VOLUNTEER_MANAGER: "Volunteer Management Assistant",
  EVENT_PLANNER: "Event Planning Expert",
  PARTNER_SPECIALIST: "Partner Relations Specialist", 
  DATA_ANALYST: "Data Analytics Assistant",
} as const;
