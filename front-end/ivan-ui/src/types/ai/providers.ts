// AI Providers Types - Aligned with Backend DTOs
// ✅ FIXED: Provider capabilities structure to match backend exactly

export enum AiProviderType {
  Gemini = 'Gemini',
  OpenRouter = 'OpenRouter'
}

// ✅ FIXED: Updated to match backend structure exactly
export interface AiProviderCapabilities {
  supportsStreaming: boolean;          // ✅ Keep from old
  supportsImageInput: boolean;         // ✅ NEW - backend has this
  supportsFileInput: boolean;          // ✅ NEW - backend has this
  maxInputTokens: number;              // ✅ CHANGED: was maxTokens
  maxOutputTokens: number;             // ✅ NEW - backend has this
  supportedModels: string[];           // ✅ Keep from old
}

// ✅ NEW - Usage stats separate from capabilities (backend pattern)
export interface AiProviderUsageStats {
  requestsToday: number;
  requestsThisMinute: number;
  tokensUsedToday: number;
  lastReset: string;                   // ISO date string from backend DateTime
}

export interface AiProviderStatus {
  providerName: string;
  providerType: AiProviderType;
  isEnabled: boolean;
  isHealthy: boolean;
  lastError?: string;
  lastChecked: string;                 // ISO date string from backend DateTime
  capabilities: AiProviderCapabilities;
  usageStats: AiProviderUsageStats;
}

// Health check result
export interface AiHealthCheckResult {
  isHealthy: boolean;
  errorMessage?: string;
  checkedAt: string;                   // ISO date string from backend DateTime
}
