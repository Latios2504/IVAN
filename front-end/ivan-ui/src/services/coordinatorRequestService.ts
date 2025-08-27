// Coordinator Request Service - Matching backend CoordinatorRequestsController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CoordinatorRequestListItemDto,
  CreateCoordinatorRequestDto,
  UpdateCoordinatorRequestDto,
  CoordinatorRequestFilterDto,
  CoordinatorRequestStatsDto,
  CoordinatorRequestValidationResult,
  CoordinatorRequestCreatePayload,
} from "../types/coordinatorRequest";
import { DEFAULT_COORDINATOR_REQUEST_FILTER } from "../types/coordinatorRequest";

class CoordinatorRequestService {
  private readonly baseUrl = "/CoordinatorRequests";

  // === ORGANIZATION ENDPOINTS ===

  // POST /api/orgs/{organizationId}/coordinator-requests - Create Coordinator Request (Organization role)
  async createCoordinatorRequest(
    organizationId: number,
    request: CoordinatorRequestCreatePayload
  ): Promise<void> {
    // Convert Date to ISO string if needed
    const payload: CreateCoordinatorRequestDto = {
      ...request,
      hireDate: typeof request.hireDate === 'string' 
        ? request.hireDate 
        : request.hireDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    };

    const response = await apiClient.post(
      `/orgs/${organizationId}/coordinator-requests`,
      payload
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to create coordinator request");
    }
  }

  // === ADMIN ENDPOINTS ===

  // GET /api/admin/coordinator-requests - Get Coordinator Requests List (Admin role)
  async getCoordinatorRequests(
    status?: string
  ): Promise<CoordinatorRequestListItemDto[]> {
    const params: Record<string, any> = {};
    if (status) {
      params.status = status;
    }

    const response = await apiClient.get<CoordinatorRequestListItemDto[]>(
      "/admin/coordinator-requests",
      params
    );

    if (!response.success || !response.data) {
      console.warn("Failed to load coordinator requests or received empty data:", response);
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // Ensure the data is an array
    if (!Array.isArray(extractedData)) {
      console.warn(
        "Expected coordinator requests data to be an array, received:",
        typeof extractedData,
        extractedData
      );
      return [];
    }

    return extractedData;
  }

  // PATCH /api/admin/coordinator-requests/{id} - Update Coordinator Request (Admin role)
  async updateCoordinatorRequest(
    requestId: number,
    updateData: UpdateCoordinatorRequestDto
  ): Promise<void> {
    const response = await apiClient.patch(
      `/admin/coordinator-requests/${requestId}`,
      updateData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update coordinator request");
    }
  }

  // === UTILITY METHODS ===

  // Helper method to validate coordinator request data before creation
  validateCoordinatorRequestData(data: CoordinatorRequestCreatePayload): CoordinatorRequestValidationResult {
    const errors: string[] = [];

    if (!data.candidateEmail?.trim()) {
      errors.push("Candidate email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.candidateEmail)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.fullName?.trim()) {
      errors.push("Full name is required");
    } else if (data.fullName.length > 200) {
      errors.push("Full name must be 200 characters or less");
    }

    if (!data.position?.trim()) {
      errors.push("Position is required");
    } else if (data.position.length > 100) {
      errors.push("Position must be 100 characters or less");
    }

    if (!data.department?.trim()) {
      errors.push("Department is required");
    } else if (data.department.length > 100) {
      errors.push("Department must be 100 characters or less");
    }

    if (!data.responsibilities?.trim()) {
      errors.push("Responsibilities are required");
    } else if (data.responsibilities.length > 1000) {
      errors.push("Responsibilities must be 1000 characters or less");
    }

    if (!data.hireDate) {
      errors.push("Hire date is required");
    } else {
      const hireDate = new Date(data.hireDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (hireDate < today) {
        errors.push("Hire date cannot be in the past");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Helper method to validate update request data
  validateUpdateRequestData(data: UpdateCoordinatorRequestDto): CoordinatorRequestValidationResult {
    const errors: string[] = [];

    if (!data.action?.trim()) {
      errors.push("Action is required");
    } else if (!['APPROVE', 'REJECT'].includes(data.action)) {
      errors.push("Action must be either APPROVE or REJECT");
    }

    if (data.note && data.note.length > 1000) {
      errors.push("Note must be 1000 characters or less");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Helper method to format date for display
  formatRequestDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // Helper method to get status color for UI
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  }

  // Helper method to get status display text
  getStatusDisplayText(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "Đang chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  }

  // Helper method to get action display text
  getActionDisplayText(action: string): string {
    switch (action) {
      case "APPROVE":
        return "Duyệt";
      case "REJECT":
        return "Từ chối";
      default:
        return action;
    }
  }

  // Helper method to check if request can be updated
  canUpdateRequest(status: string): boolean {
    return status.toLowerCase() === "pending";
  }

  // Helper method to format hire date for display
  formatHireDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  // Helper method to calculate days until hire date
  getDaysUntilHireDate(hireDateString: string): number {
    const hireDate = new Date(hireDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    hireDate.setHours(0, 0, 0, 0);
    
    const diffTime = hireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Helper method to check if hire date is soon (within 7 days)
  isHireDateSoon(hireDateString: string): boolean {
    const daysUntil = this.getDaysUntilHireDate(hireDateString);
    return daysUntil >= 0 && daysUntil <= 7;
  }

  // Helper method to get request urgency level
  getRequestUrgency(hireDateString: string): 'high' | 'medium' | 'low' {
    const daysUntil = this.getDaysUntilHireDate(hireDateString);
    
    if (daysUntil < 0) {
      return 'high'; // Overdue
    } else if (daysUntil <= 3) {
      return 'high'; // Very urgent
    } else if (daysUntil <= 7) {
      return 'medium'; // Urgent
    } else {
      return 'low'; // Normal
    }
  }

  // Helper method to get urgency color
  getUrgencyColor(urgency: 'high' | 'medium' | 'low'): string {
    switch (urgency) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  }
}

export const coordinatorRequestService = new CoordinatorRequestService();
export default coordinatorRequestService;