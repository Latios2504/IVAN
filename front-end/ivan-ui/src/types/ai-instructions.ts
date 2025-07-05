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
