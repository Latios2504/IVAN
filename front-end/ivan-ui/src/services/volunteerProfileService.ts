// Volunteer Profile Service - Matching backend VolunteerProfileController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  PublicVolunteerDto,
  PublicVolunteerFiltersDto,
  SkillDto,
  VolunteerProfileViewModel,
  CreateVolunteerProfileDto,
  UpdateVolunteerProfileDto,
} from "../types/volunteerProfile";
import type { ProfileCompletionDto } from "../types/organizationProfile"; // Reuse same interface

class VolunteerProfileService {
  private readonly baseUrl = "/VolunteerProfile";

  // === PUBLIC ENDPOINTS ===

  // GET /api/VolunteerProfile/public - Get Public Volunteers
  async getPublicVolunteers(
    filters: PublicVolunteerFiltersDto
  ): Promise<PagedResultDto<PublicVolunteerDto>> {
    const response = await apiClient.get<PagedResultDto<PublicVolunteerDto>>(
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

  // GET /api/VolunteerProfile/public/{id} - Get Public Volunteer
  async getPublicVolunteer(id: number): Promise<PublicVolunteerDto> {
    const response = await apiClient.get<PublicVolunteerDto>(
      `${this.baseUrl}/public/${id}`
    );
    if (!response.data) {
      throw new Error("Volunteer not found");
    }
    return response.data;
  }

  // GET /api/VolunteerProfile/public/skills - Get All Skills
  async getSkills(): Promise<SkillDto[]> {
    const response = await apiClient.get<SkillDto[]>(
      `${this.baseUrl}/public/skills`
    );
    return response.data || [];
  }

  // === MANAGEMENT ENDPOINTS ===

  // GET /api/VolunteerProfile - Get Volunteer Profiles (Admin only)
  async getVolunteerProfiles(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<VolunteerProfileViewModel>> {
    const response = await apiClient.get<
      PagedResultDto<VolunteerProfileViewModel>
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

  // GET /api/VolunteerProfile/{userId} - Get Volunteer Profile
  async getVolunteerProfile(
    userId: number
  ): Promise<VolunteerProfileViewModel> {
    const response = await apiClient.get<VolunteerProfileViewModel>(
      `${this.baseUrl}/${userId}`
    );
    if (!response.data) {
      throw new Error("Volunteer profile not found");
    }
    return response.data;
  }

  // POST /api/VolunteerProfile - Create Volunteer Profile (Public - open registration)
  async createVolunteerProfile(
    profile: CreateVolunteerProfileDto
  ): Promise<void> {
    await apiClient.post(this.baseUrl, profile);
  }

  // PUT /api/VolunteerProfile/{userId} - Update Volunteer Profile
  async updateVolunteerProfile(
    userId: number,
    profile: UpdateVolunteerProfileDto
  ): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${userId}`, profile);
  }

  // GET /api/VolunteerProfile/{userId}/completion - Get Profile Completion
  async getProfileCompletion(userId: number): Promise<ProfileCompletionDto> {
    const response = await apiClient.get<ProfileCompletionDto>(
      `${this.baseUrl}/${userId}/completion`
    );
    return response.data || { completionPercentage: 0, missingFields: [] };
  }
}

export const volunteerProfileService = new VolunteerProfileService();
export default volunteerProfileService;
