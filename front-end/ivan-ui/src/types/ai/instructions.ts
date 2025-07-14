// AI Instructions Types - Aligned with Backend DTOs
// All types match backend exactly

export interface AiCustomInstructionDTO {
  instructionId: number;
  createdByUserId: number;
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  dataAccessRules?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;          // ISO date string from backend DateTime
  updatedAt: string;          // ISO date string from backend DateTime
  createdByUser?: UserBasicInfoDTO;
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

// ✅ NEW - Missing from old frontend
export interface ToggleInstructionStatusDTO {
  isActive: boolean;
}

// ✅ NEW - Missing from old frontend  
export interface UserBasicInfoDTO {
  userId: number;
  email: string;
  fullName: string;
}

// Testing DTOs
export interface TestInstructionRequestDTO {
  sampleQuery: string;
}

// ✅ NEW - Missing from old frontend
export interface TestInstructionWithModelRequestDTO {
  sampleQuery: string;
  modelName: string;
}

// ✅ FIXED - Old frontend returned string, backend returns object
export interface TestInstructionResponseDTO {
  response: string;
  modelUsed: string;
  executionTimeMs: number;
  success: boolean;
  error?: string;
  testedAt: string;           // ISO date string from backend DateTime
}

// Frontend-specific UI helper types (keep these)
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

export interface InstructionStats {
  totalInstructions: number;
  activeInstructions: number;
  templatesUsed: number;
  avgResponseQuality: number;
  totalQueries: number;
}
