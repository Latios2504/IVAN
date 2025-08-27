// Feedback Service - Matching backend FeedbackController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  FeedbackCreateDto,
  FeedbackUpdateDto,
  FeedbackListDto,
  Feedback,
  FeedbackListParams,
  FeedbackByEventParams,
  FeedbackByUserParams,
} from "../types/feedback";

class FeedbackService {
  private readonly baseUrl = "/Feedback";

  // === PUBLIC ENDPOINTS (No Authentication Required) ===

  // POST /api/Feedback/listAllFeedbacks - Get All Feedbacks
  async getAllFeedbacks(
    params: FeedbackListParams
  ): Promise<PagedResultDto<FeedbackListDto>> {
    const response = await apiClient.post<PagedResultDto<FeedbackListDto>>(
      `${this.baseUrl}/listAllFeedbacks?PageNumber=${params.pageNumber}&PageSize=${params.pageSize}`
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
      const pagedResult = extractedData as PagedResultDto<FeedbackListDto>;
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

    return extractedData as PagedResultDto<FeedbackListDto>;
  }

  // POST /api/Feedback/listFeedbackByEvent - Get Feedbacks by Event
  async getFeedbacksByEvent(
    params: FeedbackByEventParams
  ): Promise<PagedResultDto<FeedbackListDto>> {
    const response = await apiClient.post<PagedResultDto<FeedbackListDto>>(
      `${this.baseUrl}/listFeedbackByEvent?eventId=${params.eventId}&PageNumber=${params.pageNumber}&PageSize=${params.pageSize}`
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
      const pagedResult = extractedData as PagedResultDto<FeedbackListDto>;
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

    return extractedData as PagedResultDto<FeedbackListDto>;
  }

  // POST /api/Feedback/listFeedbackByUser - Get Feedbacks by User
  async getFeedbacksByUser(
    params: FeedbackByUserParams
  ): Promise<PagedResultDto<FeedbackListDto>> {
    const response = await apiClient.post<PagedResultDto<FeedbackListDto>>(
      `${this.baseUrl}/listFeedbackByUser?userId=${params.userId}&PageNumber=${params.pageNumber}&PageSize=${params.pageSize}`
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
      const pagedResult = extractedData as PagedResultDto<FeedbackListDto>;
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

    return extractedData as PagedResultDto<FeedbackListDto>;
  }

  // POST /api/Feedback/updateFeedback - Update Feedback
  async updateFeedback(
    feedback: FeedbackUpdateDto
  ): Promise<FeedbackUpdateDto> {
    const response = await apiClient.post<FeedbackUpdateDto>(
      `${this.baseUrl}/updateFeedback`,
      feedback
    );

    if (!response.data) {
      throw new Error("Failed to update feedback");
    }

    return response.data;
  }

  // === AUTHENTICATED ENDPOINTS (JWT Token Required) ===

  // POST /api/Feedback/createFeedback - Create Feedback (JWT required)
  async createFeedback(feedback: FeedbackCreateDto): Promise<Feedback> {
    const response = await apiClient.post<Feedback>(
      `${this.baseUrl}/createFeedback`,
      feedback
    );

    if (!response.data) {
      throw new Error("Failed to create feedback");
    }

    return response.data;
  }

  // DELETE /api/Feedback/deleteFeedbackByID - Delete Feedback (JWT required)
  async deleteFeedback(id: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(
      `${this.baseUrl}/deleteFeedbackByID?id=${id}`
    );

    return response.data || false;
  }
}

export const feedbackService = new FeedbackService();
export default feedbackService;
