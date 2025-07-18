// AI Testing Types - Aligned with Backend DTOs
// Moved from service files to centralized location

import type { SqlData } from "./queries";

export interface TestResult {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  executionTime: number;
  success: boolean;
  model: string;
  error?: string;
  sqlData?: SqlData;
}

export interface AiTestResult {
  success: boolean;
  providerName: string;
  model: string;
  prompt: string;
  response: string;
  errorMessage?: string;
  responseTimeMs: number;
  tokensUsed: number;
  testedAt: string; // ISO date string from backend DateTime
  metadata: Record<string, any>;
}

export interface MultiModelTestRequest {
  prompt: string;
  providerNames: string[];
  runSimultaneously: boolean;
  timeoutSeconds: number;
  customModels?: Record<string, string>;
}

export interface MultiModelTestResponse {
  testId: string;
  results: AiTestResult[];
  totalTestTimeMs: number;
  startedAt: string; // ISO date string from backend DateTime
  completedAt: string; // ISO date string from backend DateTime
  status: string;
}

export interface DatabaseIntegratedTestRequest {
  query: string;
  providerNames: string[];
  includeDatabaseContext: boolean;
  maxDatabaseRows: number;
}

// Playground session for frontend UI
export interface AiPlaygroundSession {
  sessionId: string;
  userId: number;
  testHistory: MultiModelTestResponse[];
  createdAt: string; // ISO date string
  lastActivity: string; // ISO date string
  isActive: boolean;
}
