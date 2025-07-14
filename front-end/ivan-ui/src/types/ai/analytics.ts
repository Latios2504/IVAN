// AI Analytics Types - Aligned with Backend DTOs
// ✅ CRITICAL FIX: intentId instead of queryId

export interface AiQueryAnalyticsDTO {
  intentId: number;                    // ✅ FIXED: Was queryId in old frontend
  userId: number;
  conversationId?: string;
  queryText: string;
  detectedIntent?: string;
  entityMentions?: string;
  isCorrect?: boolean;
  correctedIntent?: string;
  processingTimeMs?: number;
  responseQuality?: number;
  dataTablesAccessed?: string;
  instructionId?: number;
  createdAt: string;                   // ISO date string from backend DateTime
}

// ✅ NEW - Missing from old frontend
export interface InstructionPerformanceDTO {
  totalQueries: number;
  averageExecutionTime: number;
  averageResponseQuality: number;
  queriesLast7Days: number;
  mostAccessedTables: Record<string, number>;
}
