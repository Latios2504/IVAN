// =============================================================================
// AI INSTRUCTIONS TYPES
// =============================================================================

export interface AiCustomInstructionDTO {
  instructionId: number;
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  isActive: boolean;
  createdAt: string; // ISO date string from backend DateTime
  updatedAt: string; // ISO date string from backend DateTime
}

export interface AiCustomInstructionCreateDTO {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
}

export interface AiCustomInstructionUpdateDTO {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions?: string;
  isActive: boolean;
}

// Toggle status DTO for UI
export interface ToggleInstructionStatusDTO {
  isActive: boolean;
}

// Frontend-specific UI helper types
export interface InstructionFormData {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions: string;
  isActive: boolean;
}

// =============================================================================
// AI QUERIES TYPES
// =============================================================================

export interface AiQueryRequest {
  query: string;
  customInstructionId?: number;
  preferredModel?: string;
  includeContext?: boolean;
  // Optional client-side memory (no server persistence)
  conversationId?: string;
  clientMessages?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }>;
  clientSummary?: string;
}

// SQL Data structure
export interface SqlData {
  sqlGenerated: string;
  data: any[];
  totalRows: number;
  rowsReturned: number;
  executionTime: string;
}

// Shared AI Response DTO - Used for both queries and instruction testing
export interface AiResponse {
  success: boolean;
  response: string;
  modelUsed: string;
  errorMessage?: string;
  executionTimeMs: number;
  generatedAt?: string;
  customInstructionUsed?: string;
  isSqlQuery?: boolean;
  sqlData?: SqlData;
}

// =============================================================================
// CHATBOT TYPES (Consolidated from chatbot.ts)
// =============================================================================

export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
  conversationId?: string;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

export interface ChatMessageResponse {
  response: string;
  conversationId: string;
  timestamp: string;
  modelUsed?: string;
  customInstructionUsed?: string;
}
