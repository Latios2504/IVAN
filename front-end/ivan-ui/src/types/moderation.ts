// Moderation types - Matching backend ModerationController DTOs
import type { PagedResultDto } from "./common";

// DTO for moderation event list item
export interface ModerationEventListDto {
  eventId: number;
  eventName: string;
  organizationName: string;
  submissionDate: string; // ISO date string
}

// DTO for detailed moderation event view
export interface ModerationEventDetailDto {
  eventId: number;
  eventName: string;
  organizationName: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

// Request DTO for rejecting an event
export interface RejectEventRequestDto {
  reason: string;
}

// Response types for moderation endpoints
export interface ModerationEventsResponse extends PagedResultDto<ModerationEventListDto> {}

export interface ModerationEventDetailResponse {
  eventId: number;
  eventName: string;
  organizationName: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Request parameters for getting events for moderation
export interface ModerationEventsParams {
  page?: number;
  pageSize?: number;
}

// Action result types for approve/reject operations
export interface ApproveEventResult {
  eventId: number;
}

export interface RejectEventResult {
  eventId: number;
  reason: string;
}