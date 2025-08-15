// Feedback Types - Matching backend FeedbackController DTOs and Models

// DTO for creating feedback
export interface FeedbackCreateDto {
  eventId: number;
  categoryId: number;
  subject: string;
  content: string;
  rating?: number | null;
  isAnonymous?: boolean | null;
  isPublic?: boolean | null;
  attachmentUrls?: string | null;
}

// DTO for updating feedback
export interface FeedbackUpdateDto {
  idFeedback: number;
  content?: string | null;
}

// DTO for listing feedbacks
export interface FeedbackListDto {
  feedbackId: number;
  eventId: number;
  userId: number;
  categoryId: number;
  categoryName?: string | null;
  subject: string;
  content: string;
  rating?: number | null;
  isAnonymous?: boolean | null;
  status?: string | null;
}

// Complete feedback model (as returned by create endpoint)
export interface Feedback {
  feedbackId: number;
  eventId: number;
  userId: number;
  categoryId: number;
  subject: string;
  content: string;
  rating?: number | null;
  isAnonymous?: boolean | null;
  status?: string | null;
  responseContent?: string | null;
  respondedBy?: number | null;
  respondedAt?: string | null;
  isPublic?: boolean | null;
  isVerified?: boolean | null;
  attachmentUrls?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Feedback category model
export interface FeedbackCategory {
  categoryId: number;
  categoryName: string;
  description?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

// Request parameters for pagination
export interface FeedbackListParams {
  pageNumber: number;
  pageSize: number;
}

export interface FeedbackByEventParams extends FeedbackListParams {
  eventId: number;
}

export interface FeedbackByUserParams extends FeedbackListParams {
  userId: number;
}
