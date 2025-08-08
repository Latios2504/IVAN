import { apiClient } from "./apiClient";

export interface SupportRequestCreateRequest {
  categoryId: number;
  subject: string;
  description: string;
  priority?: string;
  attachmentUrls?: string[];
}

export interface SupportRequestResponse {
  requestId: number;
  userId: number;
  userName: string;
  userEmail: string;
  categoryId: number;
  categoryName: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: number;
  assignedToName?: string;
  assignedDate?: string;
  resolution?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  resolvedDate?: string;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  attachmentUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  comments?: SupportRequestComment[];
}

export interface SupportCategory {
  categoryId: number;
  categoryName: string;
  description?: string;
  priority: string;
  expectedResponseTime: number;
  isActive: boolean;
}

export interface SupportRequestComment {
  commentId: number;
  userId: number;
  userName: string;
  comment: string;
  isInternal: boolean;
  attachmentUrls?: string[];
  createdAt?: string;
}

export interface SupportRequestUpdateRequest {
  status?: string;
  assignedTo?: number;
  resolution?: string;
  priority?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

class SupportRequestService {
  private baseUrl = "/api/supportrequest";

  async getAll(
    status?: string,
    categoryId?: number
  ): Promise<SupportRequestResponse[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (categoryId) params.append("categoryId", categoryId.toString());

      const response = await apiClient.get<
        ApiResponse<SupportRequestResponse[]>
      >(`${this.baseUrl}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching support requests:", error);
      throw error;
    }
  }

  async getUserRequests(): Promise<SupportRequestResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<SupportRequestResponse[]>
      >(`${this.baseUrl}/my`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user support requests:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<SupportRequestResponse> {
    try {
      const response = await apiClient.get<ApiResponse<SupportRequestResponse>>(
        `${this.baseUrl}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching support request:", error);
      throw error;
    }
  }

  async create(
    request: SupportRequestCreateRequest
  ): Promise<SupportRequestResponse> {
    try {
      const response = await apiClient.post<
        ApiResponse<SupportRequestResponse>
      >(this.baseUrl, request);
      return response.data.data;
    } catch (error) {
      console.error("Error creating support request:", error);
      throw error;
    }
  }

  async update(
    id: number,
    updates: SupportRequestUpdateRequest
  ): Promise<boolean> {
    try {
      const response = await apiClient.put<ApiResponse<boolean>>(
        `${this.baseUrl}/${id}`,
        updates
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating support request:", error);
      throw error;
    }
  }

  async addComment(
    id: number,
    comment: string,
    isInternal: boolean = false
  ): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        `${this.baseUrl}/${id}/comments`,
        {
          comment,
          isInternal,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  async getCategories(): Promise<SupportCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<SupportCategory[]>>(
        `${this.baseUrl}/categories`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching support categories:", error);
      throw error;
    }
  }
}

export const supportRequestService = new SupportRequestService();
