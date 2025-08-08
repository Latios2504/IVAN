import { apiClient } from "./apiClient";
import type { PagedResultDto } from "@/types/common";
import type {
  CollaborationViewList,
  CollaborationDetailDto,
  PartnerCollaborationCreateDto,
  PartnerCollaborationUpdateDto,
  CollaborationType,
  Partner,
} from "@/types/partnerCollaboration";

export const partnerCollaborationService = {
  // Get paginated list of collaborations
  async getList(
    pageNumber = 1,
    pageSize = 10
  ): Promise<PagedResultDto<CollaborationViewList>> {
    try {
      const response = await apiClient.get<
        PagedResultDto<CollaborationViewList>
      >("/api/PartnerCollaboration", {
        pageNumber,
        pageSize,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      throw error;
    }
  },

  // Get collaboration detail
  async getDetail(id: number): Promise<CollaborationDetailDto> {
    try {
      const response = await apiClient.get<CollaborationDetailDto>(
        `/api/PartnerCollaboration/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching collaboration detail:", error);
      throw error;
    }
  },

  // Create new collaboration
  async create(data: PartnerCollaborationCreateDto): Promise<number> {
    try {
      const response = await apiClient.post<number>(
        "/api/PartnerCollaboration/createCollaboration",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating collaboration:", error);
      throw error;
    }
  },

  // Update collaboration
  async update(
    id: number,
    data: PartnerCollaborationUpdateDto
  ): Promise<boolean> {
    try {
      const response = await apiClient.put<boolean>(
        `/api/PartnerCollaboration/update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating collaboration:", error);
      throw error;
    }
  },

  // Delete collaboration
  async delete(id: number): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(
        `/api/PartnerCollaboration/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting collaboration:", error);
      throw error;
    }
  },

  // Get collaborations by organization
  async getByOrganization(
    organizationId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PagedResultDto<CollaborationViewList>> {
    try {
      const response = await apiClient.get<
        PagedResultDto<CollaborationViewList>
      >(`/api/PartnerCollaboration/organization/${organizationId}`, {
        pageNumber,
        pageSize,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching organization collaborations:", error);
      throw error;
    }
  },

  // Get collaborations by partner
  async getByPartner(
    partnerId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PagedResultDto<CollaborationViewList>> {
    try {
      const response = await apiClient.get<
        PagedResultDto<CollaborationViewList>
      >(`/api/PartnerCollaboration/partner/${partnerId}`, {
        pageNumber,
        pageSize,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching partner collaborations:", error);
      throw error;
    }
  },

  // Get collaboration types (for dropdown)
  async getCollaborationTypes(): Promise<CollaborationType[]> {
    try {
      // Note: This endpoint might need to be created if it doesn't exist
      const response = await apiClient.get<CollaborationType[]>(
        "/api/CollaborationType"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching collaboration types:", error);
      // Return default types if API fails
      return [
        { typeId: 1, typeName: "Tài trợ kỹ thuật", isActive: true },
        { typeId: 2, typeName: "Đồng tổ chức sự kiện", isActive: true },
        { typeId: 3, typeName: "Cung cấp tình nguyện viên", isActive: true },
        { typeId: 4, typeName: "Tài trợ tài chính", isActive: true },
        { typeId: 5, typeName: "Hỗ trợ truyền thông", isActive: true },
      ];
    }
  },

  // Get partners (for dropdown)
  async getPartners(): Promise<Partner[]> {
    try {
      // Using existing partner profile endpoint
      const response = await apiClient.get<any>("/api/PartnerProfile");
      const data = response.data;
      return data.items || data; // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error("Error fetching partners:", error);
      throw error;
    }
  },
};
