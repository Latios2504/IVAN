// Partner Profile Service - Matching backend PartnerProfileController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  PublicPartnerDto,
  PublicPartnerFiltersDto,
  PartnerIndustryDto,
  PartnerProfileViewModel,
  CreatePartnerProfileDto,
  UpdatePartnerProfileDto,
} from "../types/partnerProfile";
import type { ProfileCompletionDto } from "../types/organizationProfile"; // Reuse same interface

class PartnerProfileService {
  private readonly baseUrl = "/PartnerProfile";

  // === PUBLIC ENDPOINTS ===

  // GET /api/PartnerProfile/public - Get Public Partners
  async getPublicPartners(
    filters: PublicPartnerFiltersDto
  ): Promise<PagedResultDto<PublicPartnerDto>> {
    const response = await apiClient.get<PagedResultDto<PublicPartnerDto>>(
      `${this.baseUrl}/public`,
      filters // Let apiClient handle parameter building
    );
    return (
      response.data || {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  }

  // GET /api/PartnerProfile/public/{id} - Get Public Partner
  async getPublicPartner(id: number): Promise<PublicPartnerDto> {
    const response = await apiClient.get<PublicPartnerDto>(
      `${this.baseUrl}/public/${id}`
    );
    if (!response.data) {
      throw new Error("Partner not found");
    }
    return response.data;
  }

  // GET /api/PartnerProfile/public/partner-industries - Get Partner Industries
  async getPartnerIndustries(): Promise<PartnerIndustryDto[]> {
    const response = await apiClient.get<PartnerIndustryDto[]>(
      `${this.baseUrl}/public/partner-industries`
    );
    return response.data || [];
  }

  // === MANAGEMENT ENDPOINTS ===

  // GET /api/PartnerProfile - Get Partner Profiles (Admin only)
  async getPartnerProfiles(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<PartnerProfileViewModel>> {
    const response = await apiClient.get<
      PagedResultDto<PartnerProfileViewModel>
    >(this.baseUrl, { pageNumber, pageSize });
    return (
      response.data || {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  }

  // GET /api/PartnerProfile/get/{userId} - Get Partner Profile
  async getPartnerProfile(userId: number): Promise<PartnerProfileViewModel> {
    const response = await apiClient.get<PartnerProfileViewModel>(
      `${this.baseUrl}/get/${userId}`
    );
    if (!response.data) {
      throw new Error("Partner profile not found");
    }
    return response.data;
  }

  // POST /api/PartnerProfile/add - Create Partner Profile (Admin only)
  async createPartnerProfile(profile: CreatePartnerProfileDto): Promise<void> {
    await apiClient.post(`${this.baseUrl}/add`, profile);
  }

  // PUT /api/PartnerProfile/update/{id} - Update Partner Profile
  async updatePartnerProfile(
    userId: number,
    profile: UpdatePartnerProfileDto
  ): Promise<void> {
    await apiClient.put(`${this.baseUrl}/update/${userId}`, profile);
  }

  // GET /api/PartnerProfile/{userId}/completion - Get Profile Completion
  async getProfileCompletion(userId: number): Promise<ProfileCompletionDto> {
    const response = await apiClient.get<ProfileCompletionDto>(
      `${this.baseUrl}/${userId}/completion`
    );
    return response.data || { completionPercentage: 0, missingFields: [] };
  }
}

export const partnerProfileService = new PartnerProfileService();
export default partnerProfileService;
