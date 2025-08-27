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
  // Note: userId is automatically set from JWT token in backend
}

// DTO for updating feedback
export interface FeedbackUpdateDto {
  idFeedback: number; // Matches backend property name
  content?: string | null;
}

// DTO for listing feedbacks (matches backend FeedbackListDTO)
export interface FeedbackListDto {
  feedbackId: number; // Maps to FeedbackId in backend
  eventId: number; // Maps to EventId in backend
  userId: number; // Maps to UserId in backend
  categoryId: number; // Maps to CategoryId in backend
  categoryName?: string | null; // Maps to CategoryName in backend
  subject: string; // Maps to Subject in backend
  content: string; // Maps to Content in backend
  rating?: number | null; // Maps to Rating in backend
  isAnonymous?: boolean | null; // Maps to IsAnonymous in backend
  status?: string | null; // Maps to Status in backend
  createdAt?: string | null; // Maps to CreatedAt in backend - ISO date string
  updatedAt?: string | null; // Maps to UpdatedAt in backend - ISO date string
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
  respondedAt?: string | null; // ISO date string
  isPublic?: boolean | null;
  isVerified?: boolean | null;
  attachmentUrls?: string | null;
  createdAt?: string | null; // ISO date string
  updatedAt?: string | null; // ISO date string
  // Navigation properties (populated when included)
  category?: FeedbackCategory | null;
  event?: any | null; // Event type would be defined elsewhere
  user?: any | null; // User type would be defined elsewhere
  respondedByNavigation?: any | null; // User type would be defined elsewhere
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
  rating?: number;
  search?: string;
}

export interface FeedbackByUserParams extends FeedbackListParams {
  userId: number;
}
