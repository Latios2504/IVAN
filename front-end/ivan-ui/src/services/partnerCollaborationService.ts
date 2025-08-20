// Partner Collaboration Service - Matching backend PartnerCollaborationController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CollaborationViewList,
  CollaborationDetailDto,
  PartnerCollaborationCreateDto,
  PartnerCollaborationUpdateDto,
  PartnerCollaborationFilterDto,
  CollaborationType,
  Partner,
} from "../types/partnerCollaboration";

class PartnerCollaborationService {
  private readonly baseUrl = "/api/PartnerCollaboration";

  // GET /api/PartnerCollaboration - Get paginated list of collaborations
  async getList(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<CollaborationViewList>> {
    const response = await apiClient.get<PagedResultDto<CollaborationViewList>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const result = response.data || { items: [], pageNumber: 1, pageSize: 10, totalCount: 0 };
    return {
      ...result,
      totalPages: Math.ceil(result.totalCount / result.pageSize),
      hasPreviousPage: result.pageNumber > 1,
      hasNextPage: result.pageNumber < Math.ceil(result.totalCount / result.pageSize)
    };
  }

  // GET /api/PartnerCollaboration/{collaborationId} - Get collaboration detail
  async getCollaborationDetail(collaborationId: number): Promise<CollaborationDetailDto> {
    const response = await apiClient.get<CollaborationDetailDto>(
      `${this.baseUrl}/${collaborationId}`
    );
    return response.data;
  }

  // POST /api/PartnerCollaboration/createCollaboration - Create new collaboration
  async createCollaboration(dto: PartnerCollaborationCreateDto): Promise<number> {
    const response = await apiClient.post<number>(
      `${this.baseUrl}/createCollaboration`,
      dto
    );
    return response.data;
  }

  // PUT /api/PartnerCollaboration/{collaborationId} - Update collaboration (if implemented)
  async updateCollaboration(
    collaborationId: number,
    dto: PartnerCollaborationUpdateDto
  ): Promise<boolean> {
    const response = await apiClient.put<boolean>(
      `${this.baseUrl}/${collaborationId}`,
      dto
    );
    return response.data;
  }

  // DELETE /api/PartnerCollaboration/{collaborationId} - Delete collaboration (if implemented)
  async deleteCollaboration(collaborationId: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(
      `${this.baseUrl}/${collaborationId}`
    );
    return response.data;
  }

  // GET /api/PartnerCollaboration/collaboration-types - Get collaboration types (if implemented)
  async getCollaborationTypes(): Promise<CollaborationType[]> {
    try {
      const response = await apiClient.get<CollaborationType[]>(
        `${this.baseUrl}/collaboration-types`
      );
      return response.data || [];
    } catch (error) {
      // Fallback to mock data if endpoint not implemented
      console.warn("Collaboration types endpoint not found, using mock data");
      return [
        { typeId: 1, typeName: "Tài trợ sự kiện", description: "Tài trợ cho các sự kiện tình nguyện", isActive: true },
        { typeId: 2, typeName: "Hỗ trợ vật tư", description: "Cung cấp vật tư, thiết bị", isActive: true },
        { typeId: 3, typeName: "Đào tạo", description: "Hỗ trợ đào tạo kỹ năng", isActive: true },
        { typeId: 4, typeName: "Tài trợ dài hạn", description: "Hợp tác tài trợ dài hạn", isActive: true },
      ];
    }
  }

  // GET /api/PartnerProfile/public/partners - Get partners for selection (reuse from partner profile service)
  async getPartnersForSelection(): Promise<Partner[]> {
    try {
      // Use partner profile service to get public partners
      const response = await apiClient.get<PagedResultDto<Partner>>(
        "/api/PartnerProfile/public/partners?page=1&size=100"
      );
      return response.data?.items || [];
    } catch (error) {
      console.error("Failed to fetch partners:", error);
      return [];
    }
  }

  // GET /api/OrganizationProfile/public/organizations - Get organizations for selection (if needed)
  async getOrganizationsForSelection(): Promise<any[]> {
    try {
      const response = await apiClient.get<PagedResultDto<any>>(
        "/api/OrganizationProfile/public/organizations?page=1&size=100"
      );
      return response.data?.items || [];
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      return [];
    }
  }

  // Advanced filtering (if backend supports it)
  async getFilteredCollaborations(
    filters: PartnerCollaborationFilterDto
  ): Promise<PagedResultDto<CollaborationViewList>> {
    const params = new URLSearchParams();
    
    if (filters.organizationId) params.append("organizationId", filters.organizationId.toString());
    if (filters.partnerId) params.append("partnerId", filters.partnerId.toString());
    if (filters.typeId) params.append("typeId", filters.typeId.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.startDateFrom) params.append("startDateFrom", filters.startDateFrom);
    if (filters.startDateTo) params.append("startDateTo", filters.startDateTo);
    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.page) params.append("pageNumber", filters.page.toString());
    if (filters.size) params.append("pageSize", filters.size.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortDirection) params.append("sortDirection", filters.sortDirection);

    const response = await apiClient.get<PagedResultDto<CollaborationViewList>>(
      `${this.baseUrl}?${params.toString()}`
    );
    const result = response.data || { items: [], pageNumber: 1, pageSize: 10, totalCount: 0 };
    return {
      ...result,
      totalPages: Math.ceil(result.totalCount / result.pageSize),
      hasPreviousPage: result.pageNumber > 1,
      hasNextPage: result.pageNumber < Math.ceil(result.totalCount / result.pageSize)
    };
  }

  // Utility method to format dates for API
  formatDateForApi(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  // Utility method to parse dates from API
  parseDateFromApi(dateString: string): Date {
    return new Date(dateString);
  }
}

// Export singleton instance
export const partnerCollaborationService = new PartnerCollaborationService();
export default partnerCollaborationService;