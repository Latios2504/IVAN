// Moderation Service - Matching backend ModerationController
import { apiClient } from "./apiClient";
import type {
  ModerationEventListDto,
  ModerationEventDetailDto,
  RejectEventRequestDto,
  ModerationEventsResponse,
  ModerationEventsParams,
  ApproveEventResult,
  RejectEventResult,
} from "../types/moderation";

class ModerationService {
  private readonly baseUrl = "/Moderation";



  // GET /api/Moderation - Get Events for Moderation (Admin only)
  async getEventsForModeration(
    params: ModerationEventsParams = { page: 1, pageSize: 10 }
  ): Promise<ModerationEventsResponse> {
    const response = await apiClient.get<ModerationEventsResponse>(
      this.baseUrl,
      params
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as ModerationEventsResponse;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as ModerationEventsResponse;
  }

  // GET /api/Moderation/{eventId} - Get Event Details for Moderation (Admin only)
  async getEventDetailsForModeration(
    eventId: number
  ): Promise<ModerationEventDetailDto> {
    const response = await apiClient.get<ModerationEventDetailDto>(
      `${this.baseUrl}/${eventId}`
    );
    
    if (!response.data) {
      throw new Error("Event details not found");
    }
    
    return response.data;
  }

  // POST /api/Moderation/{eventId}/approve - Approve Event (Admin only)
  async approveEvent(eventId: number): Promise<ApproveEventResult> {
    const response = await apiClient.post<ApproveEventResult>(
      `${this.baseUrl}/${eventId}/approve`
    );
    
    if (!response.success) {
      throw new Error(response.message || "Failed to approve event");
    }
    
    return response.data || { eventId };
  }

  // POST /api/Moderation/{eventId}/reject - Reject Event (Admin only)
  async rejectEvent(
    eventId: number,
    request: RejectEventRequestDto
  ): Promise<RejectEventResult> {
    if (!request.reason || request.reason.trim() === "") {
      throw new Error("Rejection reason is required");
    }

    const response = await apiClient.post<RejectEventResult>(
      `${this.baseUrl}/${eventId}/reject`,
      request
    );
    
    if (!response.success) {
      throw new Error(response.message || "Failed to reject event");
    }
    
    return response.data || { eventId, reason: request.reason };
  }
}

export const moderationService = new ModerationService();
export default moderationService;