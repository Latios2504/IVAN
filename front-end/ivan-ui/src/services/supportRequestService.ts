// Support Request Service - Matching backend SupportRequestController
import { apiClient } from "./apiClient";
import type {
  SupportRequestCreateDto,
  SupportRequestResponseDto,
  SupportRequestUpdateDto,
  SupportRequestCommentDto,
  SupportCategoryDto,
  AddCommentRequest,
  SupportRequestListResponseDto,
  SupportRequestFilterDto,
  SupportRequestStatsDto,
} from "../types/supportRequest";
import { DEFAULT_SUPPORT_REQUEST_FILTER } from "../types/supportRequest";

class SupportRequestService {
  private readonly baseUrl = "/supportrequest";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === SUPPORT REQUEST MANAGEMENT ENDPOINTS ===

  // GET /api/supportrequest - Admin sees all, Organization sees only approved
  async getAllRequests(
    status?: string,
    categoryId?: number
  ): Promise<SupportRequestResponseDto[]> {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (categoryId) params.categoryId = categoryId;

    const response = await apiClient.get<SupportRequestResponseDto[]>(
      this.baseUrl,
      params
    );

    if (!response.data) {
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);
    return Array.isArray(extractedData) ? extractedData : [];
  }

  // GET /api/supportrequest/my - Get user's own requests
  async getMyRequests(): Promise<SupportRequestResponseDto[]> {
    const response = await apiClient.get<SupportRequestResponseDto[]>(
      `${this.baseUrl}/my`
    );

    if (!response.data) {
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);
    return Array.isArray(extractedData) ? extractedData : [];
  }

  // GET /api/supportrequest/{id}
  async getRequestById(id: number): Promise<SupportRequestResponseDto> {
    const response = await apiClient.get<SupportRequestResponseDto>(
      `${this.baseUrl}/${id}`
    );
    if (!response.data) {
      throw new Error("Support request not found");
    }
    return response.data;
  }

  // POST /api/supportrequest - Allow anonymous and authenticated users
  async createRequest(
    requestData: SupportRequestCreateDto
  ): Promise<SupportRequestResponseDto> {
    const response = await apiClient.post<SupportRequestResponseDto>(
      this.baseUrl,
      requestData
    );
    if (!response.data) {
      throw new Error("Failed to create support request");
    }
    return response.data;
  }

  // PUT /api/supportrequest/{id} - Admin only
  async updateRequest(
    id: number,
    updateData: SupportRequestUpdateDto
  ): Promise<SupportRequestResponseDto> {
    const response = await apiClient.put<SupportRequestResponseDto>(
      `${this.baseUrl}/${id}`,
      updateData
    );
    if (!response.data) {
      throw new Error("Failed to update support request");
    }
    return response.data;
  }

  // POST /api/supportrequest/{id}/comments
  async addComment(
    id: number,
    commentData: AddCommentRequest
  ): Promise<SupportRequestCommentDto> {
    const response = await apiClient.post<SupportRequestCommentDto>(
      `${this.baseUrl}/${id}/comments`,
      commentData
    );
    if (!response.data) {
      throw new Error("Failed to add comment");
    }
    return response.data;
  }

  // GET /api/supportrequest/categories
  async getCategories(): Promise<SupportCategoryDto[]> {
    const response = await apiClient.get<SupportCategoryDto[]>(
      `${this.baseUrl}/categories`
    );

    if (!response.data) {
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);
    return Array.isArray(extractedData) ? extractedData : [];
  }

  // === ENHANCED QUERY METHODS ===

  // Get requests with advanced filtering (client-side implementation)
  async getRequestsWithFilter(
    filter: Partial<SupportRequestFilterDto> = {}
  ): Promise<SupportRequestListResponseDto> {
    const filterWithDefaults = { ...DEFAULT_SUPPORT_REQUEST_FILTER, ...filter };

    try {
      // Get all requests (will be filtered by backend based on user role)
      const requests = await this.getAllRequests(
        filterWithDefaults.status,
        filterWithDefaults.categoryId
      );

      // Apply client-side filtering for additional parameters
      let filteredRequests = requests;

      // Filter by priority
      if (filterWithDefaults.priority) {
        filteredRequests = filteredRequests.filter(
          (req) => req.priority === filterWithDefaults.priority
        );
      }

      // Filter by assigned user
      if (filterWithDefaults.assignedTo) {
        filteredRequests = filteredRequests.filter(
          (req) => req.assignedTo === filterWithDefaults.assignedTo
        );
      }

      // Filter by user ID
      if (filterWithDefaults.userId) {
        filteredRequests = filteredRequests.filter(
          (req) => req.userId === filterWithDefaults.userId
        );
      }

      // Filter by search term
      if (filterWithDefaults.searchTerm) {
        const searchLower = filterWithDefaults.searchTerm.toLowerCase();
        filteredRequests = filteredRequests.filter(
          (req) =>
            req.subject.toLowerCase().includes(searchLower) ||
            req.description.toLowerCase().includes(searchLower) ||
            req.userName.toLowerCase().includes(searchLower) ||
            req.categoryName.toLowerCase().includes(searchLower)
        );
      }

      // Filter by date range
      if (filterWithDefaults.dateFrom) {
        const fromDate = new Date(filterWithDefaults.dateFrom);
        filteredRequests = filteredRequests.filter((req) => {
          if (!req.createdAt) return true;
          return new Date(req.createdAt) >= fromDate;
        });
      }

      if (filterWithDefaults.dateTo) {
        const toDate = new Date(filterWithDefaults.dateTo);
        filteredRequests = filteredRequests.filter((req) => {
          if (!req.createdAt) return true;
          return new Date(req.createdAt) <= toDate;
        });
      }

      // Sort results
      if (filterWithDefaults.sortBy) {
        filteredRequests.sort((a, b) => {
          const aValue = (a as any)[filterWithDefaults.sortBy!];
          const bValue = (b as any)[filterWithDefaults.sortBy!];

          if (aValue === bValue) return 0;

          let comparison = 0;
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;

          return filterWithDefaults.sortOrder === "desc"
            ? -comparison
            : comparison;
        });
      }

      // Apply pagination
      const totalCount = filteredRequests.length;
      const page = filterWithDefaults.page || 1;
      const size = filterWithDefaults.size || 20;
      const totalPages = Math.ceil(totalCount / size);
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

      return {
        requests: paginatedRequests,
        totalCount,
        page,
        size,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching requests with filter:", error);
      return {
        requests: [],
        totalCount: 0,
        page: 1,
        size: 20,
        totalPages: 0,
      };
    }
  }

  // === STATISTICS METHODS ===

  // Get support request statistics (computed from available data)
  async getRequestStats(): Promise<SupportRequestStatsDto> {
    try {
      const [requests, categories] = await Promise.all([
        this.getAllRequests(),
        this.getCategories(),
      ]);

      const stats: SupportRequestStatsDto = {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === "Pending").length,
        inProgressRequests: requests.filter((r) => r.status === "In Progress")
          .length,
        resolvedRequests: requests.filter((r) => r.status === "Resolved")
          .length,
        closedRequests: requests.filter((r) => r.status === "Closed").length,
        averageResponseTime: 0, // Would need backend calculation
        averageResolutionTime: 0, // Would need backend calculation
        satisfactionRating: 0, // Would need backend calculation
        requestsByCategory: [],
        requestsByPriority: [],
      };

      // Calculate category statistics
      const categoryStats = categories.map((category) => {
        const count = requests.filter(
          (r) => r.categoryId === category.categoryId
        ).length;
        return {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          count,
          percentage:
            stats.totalRequests > 0 ? (count / stats.totalRequests) * 100 : 0,
        };
      });

      // Calculate priority statistics
      const priorities = ["Low", "Medium", "High", "Urgent"];
      const priorityStats = priorities.map((priority) => {
        const count = requests.filter((r) => r.priority === priority).length;
        return {
          priority,
          count,
          percentage:
            stats.totalRequests > 0 ? (count / stats.totalRequests) * 100 : 0,
        };
      });

      // Calculate average satisfaction rating
      const ratingsWithValue = requests.filter(
        (r) => r.satisfactionRating && r.satisfactionRating > 0
      );
      if (ratingsWithValue.length > 0) {
        const totalRating = ratingsWithValue.reduce(
          (sum, r) => sum + (r.satisfactionRating || 0),
          0
        );
        stats.satisfactionRating = totalRating / ratingsWithValue.length;
      }

      stats.requestsByCategory = categoryStats;
      stats.requestsByPriority = priorityStats;

      return stats;
    } catch (error) {
      console.error("Error calculating request stats:", error);
      return {
        totalRequests: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        resolvedRequests: 0,
        closedRequests: 0,
        averageResponseTime: 0,
        averageResolutionTime: 0,
        satisfactionRating: 0,
        requestsByCategory: [],
        requestsByPriority: [],
      };
    }
  }

  // === UTILITY METHODS ===

  // Get active categories only
  async getActiveCategories(): Promise<SupportCategoryDto[]> {
    const categories = await this.getCategories();
    return categories.filter((category) => category.isActive);
  }

  // Get requests by status
  async getRequestsByStatus(
    status: string
  ): Promise<SupportRequestResponseDto[]> {
    return this.getAllRequests(status);
  }

  // Get requests by category
  async getRequestsByCategory(
    categoryId: number
  ): Promise<SupportRequestResponseDto[]> {
    return this.getAllRequests(undefined, categoryId);
  }

  // Check if user can edit request (client-side check)
  canUserEditRequest(
    request: SupportRequestResponseDto,
    currentUserId?: number,
    userRole?: string
  ): boolean {
    // Admin can edit any request
    if (userRole === "Admin") return true;

    // User can edit their own pending requests
    if (
      currentUserId &&
      request.userId === currentUserId &&
      request.status === "Pending"
    ) {
      return true;
    }

    return false;
  }

  // Check if user can add comments
  canUserAddComment(
    request: SupportRequestResponseDto,
    currentUserId?: number,
    userRole?: string
  ): boolean {
    // Admin and Organization can always comment
    if (userRole === "Admin" || userRole === "Organization") return true;

    // User can comment on their own requests if not closed
    if (
      currentUserId &&
      request.userId === currentUserId &&
      request.status !== "Closed"
    ) {
      return true;
    }

    return false;
  }

  // Validate request data
  validateCreateRequest(data: SupportRequestCreateDto): string[] {
    const errors: string[] = [];

    if (!data.categoryId || data.categoryId <= 0) {
      errors.push("Category is required");
    }

    if (!data.subject?.trim()) {
      errors.push("Subject is required");
    } else if (data.subject.length > 300) {
      errors.push("Subject must be 300 characters or less");
    }

    if (!data.description?.trim()) {
      errors.push("Description is required");
    }

    if (
      data.priority &&
      !["Low", "Medium", "High", "Urgent"].includes(data.priority)
    ) {
      errors.push("Invalid priority value");
    }

    return errors;
  }

  // Validate comment data
  validateComment(comment: string): string[] {
    const errors: string[] = [];

    if (!comment?.trim()) {
      errors.push("Comment cannot be empty");
    }

    if (comment && comment.length > 2000) {
      errors.push("Comment must be 2000 characters or less");
    }

    return errors;
  }

  // Format display helpers
  getStatusColor(status: string): string {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Resolved":
        return "text-green-600 bg-green-100";
      case "Closed":
        return "text-gray-600 bg-gray-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "Low":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Urgent":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // === COMPATIBILITY METHODS FOR EXISTING PAGES ===

  // Alias methods to match what the pages are expecting
  async create(
    requestData: SupportRequestCreateDto
  ): Promise<SupportRequestResponseDto> {
    return this.createRequest(requestData);
  }

  async getUserRequests(): Promise<SupportRequestResponseDto[]> {
    return this.getMyRequests();
  }

  async getById(id: number): Promise<SupportRequestResponseDto> {
    return this.getRequestById(id);
  }

  // Admin methods for management page
  async getAll(
    status?: string,
    categoryId?: number
  ): Promise<SupportRequestResponseDto[]> {
    return this.getAllRequests(status, categoryId);
  }

  async update(
    id: number,
    updateData: SupportRequestUpdateDto
  ): Promise<SupportRequestResponseDto> {
    return this.updateRequest(id, updateData);
  }

  // Add comment with attachment method that matches page usage
  async addCommentWithAttachment(
    requestId: number,
    comment: string,
    isInternal: boolean = false,
    attachmentUrls?: string[]
  ): Promise<SupportRequestCommentDto> {
    const commentData: AddCommentRequest = {
      comment,
      isInternal,
      attachmentUrls,
    };
    return this.addComment(requestId, commentData);
  }

  // Upload attachment method using the actual upload endpoint
  async uploadAttachment(file: File): Promise<string> {
    try {
      // Use the uploadFile method from apiClient
      const response = await apiClient.uploadFile<{ fileUrl: string }>(
        "/Upload/support-request-attachment",
        file
      );

      if (!response.data?.fileUrl) {
        throw new Error("Upload failed - no file URL returned");
      }

      return response.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

export const supportRequestService = new SupportRequestService();
export default supportRequestService;
