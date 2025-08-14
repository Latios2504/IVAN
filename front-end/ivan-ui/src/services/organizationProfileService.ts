// Organization Profile Service - Matching backend OrganizationProfileController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  PublicOrganizationDto,
  PublicOrganizationFiltersDto,
  OrganizationTypeDto,
  OrganizationProfileViewModel,
  CreateOrganizationProfileDto,
  UpdateOrganizationProfileDto,
  ProfileCompletionDto,
} from "../types/organizationProfile";

class OrganizationProfileService {
  private readonly baseUrl = "/OrganizationProfile";

  // === PUBLIC ENDPOINTS ===

  // GET /api/OrganizationProfile/public - Get Public Organizations
  async getPublicOrganizations(
    filters: PublicOrganizationFiltersDto
  ): Promise<PagedResultDto<PublicOrganizationDto>> {
    const response = await apiClient.get<PagedResultDto<PublicOrganizationDto>>(
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

  // GET /api/OrganizationProfile/public/{id} - Get Public Organization
  async getPublicOrganization(id: number): Promise<PublicOrganizationDto> {
    const response = await apiClient.get<PublicOrganizationDto>(
      `${this.baseUrl}/public/${id}`
    );
    if (!response.data) {
      throw new Error("Organization not found");
    }
    return response.data;
  }

  // GET /api/OrganizationProfile/public/organization-types - Get Organization Types
  async getOrganizationTypes(): Promise<OrganizationTypeDto[]> {
    const response = await apiClient.get<OrganizationTypeDto[]>(
      `${this.baseUrl}/public/organization-types`
    );
    return response.data || [];
  }

  // === MANAGEMENT ENDPOINTS ===

  // GET /api/OrganizationProfile - Get Organization Profiles (Admin only)
  async getOrganizationProfiles(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<OrganizationProfileViewModel>> {
    const response = await apiClient.get<
      PagedResultDto<OrganizationProfileViewModel>
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

  // GET /api/OrganizationProfile/get/{userId} - Get Organization Profile
  async getOrganizationProfile(
    userId: number
  ): Promise<OrganizationProfileViewModel> {
    const response = await apiClient.get<OrganizationProfileViewModel>(
      `${this.baseUrl}/get/${userId}`
    );
    if (!response.data) {
      throw new Error("Organization profile not found");
    }
    return response.data;
  }

  // POST /api/OrganizationProfile/add - Create Organization Profile (Admin only)
  async createOrganizationProfile(
    profile: CreateOrganizationProfileDto
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/add`, profile);
  }

  // PUT /api/OrganizationProfile/update/{id} - Update Organization Profile
  async updateOrganizationProfile(
    userId: number,
    profile: UpdateOrganizationProfileDto
  ): Promise<void> {
    await apiClient.put(`${this.baseUrl}/update/${userId}`, profile);
  }

  // GET /api/OrganizationProfile/{userId}/completion - Get Profile Completion
  async getProfileCompletion(userId: number): Promise<ProfileCompletionDto> {
    const response = await apiClient.get<ProfileCompletionDto>(
      `${this.baseUrl}/${userId}/completion`
    );
    return response.data || { completionPercentage: 0, missingFields: [] };
  }
}

export const organizationProfileService = new OrganizationProfileService();
export default organizationProfileService;
