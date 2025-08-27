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
      const pagedResult = extractedData as PagedResultDto<PublicVolunteerDto>;
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

    return extractedData as PagedResultDto<PublicVolunteerDto>;
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

    // Ensure we always return an array, even if the response is null or undefined
    if (!response.success || !response.data) {
      console.warn("Failed to load skills or received empty data:", response);
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // Ensure the data is an array
    if (!Array.isArray(extractedData)) {
      console.warn(
        "Expected skills data to be an array, received:",
        typeof extractedData,
        extractedData
      );
      return [];
    }

    return extractedData;
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
    
    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);
    
    // Handle volunteerSkills array if it's wrapped in $values
    if (extractedData && typeof extractedData === "object" && "volunteerSkills" in extractedData) {
      const profile = extractedData as VolunteerProfileViewModel;
      if (profile.volunteerSkills && typeof profile.volunteerSkills === "object" && "$values" in profile.volunteerSkills) {
        profile.volunteerSkills = (profile.volunteerSkills as any).$values;
      }
      return profile;
    }
    
    return extractedData as VolunteerProfileViewModel;
  }

  // POST /api/VolunteerProfile - Create Volunteer Profile (Public - open registration)
  async createVolunteerProfile(
    profile: CreateVolunteerProfileDto
  ): Promise<VolunteerProfileViewModel> {
    const response = await apiClient.post<VolunteerProfileViewModel>(this.baseUrl, profile);
    if (!response.data) {
      throw new Error("Failed to create volunteer profile");
    }
    return response.data;
  }

  // PUT /api/VolunteerProfile/{userId} - Update Volunteer Profile
  async updateVolunteerProfile(
    userId: number,
    profile: UpdateVolunteerProfileDto
  ): Promise<VolunteerProfileViewModel> {
    const response = await apiClient.put<VolunteerProfileViewModel>(`${this.baseUrl}/${userId}`, profile);
    if (!response.data) {
      throw new Error("Failed to update volunteer profile");
    }
    
    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);
    
    // Handle volunteerSkills array if it's wrapped in $values
    if (extractedData && typeof extractedData === "object" && "volunteerSkills" in extractedData) {
      const updatedProfile = extractedData as VolunteerProfileViewModel;
      if (updatedProfile.volunteerSkills && typeof updatedProfile.volunteerSkills === "object" && "$values" in updatedProfile.volunteerSkills) {
        updatedProfile.volunteerSkills = (updatedProfile.volunteerSkills as any).$values;
      }
      return updatedProfile;
    }
    
    return extractedData as VolunteerProfileViewModel;
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
