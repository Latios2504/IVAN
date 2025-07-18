// AI Instructions Types - Updated to match new backend DTOs
// Simplified structure to match AiSimplifiedDTOs.cs

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

import type { AiResponse } from "./queries";

// Toggle status DTO for UI
export interface ToggleInstructionStatusDTO {
  isActive: boolean;
}

// Frontend-specific UI helper types (keep these for UI functionality)
export interface InstructionFormData {
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions: string;
  isActive: boolean;
}

export interface InstructionFilters {
  isActive?: boolean;
  searchQuery?: string;
}
