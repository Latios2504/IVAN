// AI Query Types - For general AI queries and responses

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

// Alias for backward compatibility
export type AiQueryResponse = AiResponse;
