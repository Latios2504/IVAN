import { apiClient } from "./apiClient";
import type { ApiResponse } from "../../types/common";

// DTOs aligned with backend
export interface VolunteerSkillCreateDto {
  skillId: number;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  description?: string;
}

export interface VolunteerSkillUpdateDto {
  skillId: number;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  description?: string;
}

export interface VolunteerSkillDto {
  skillId: number;
  skillName: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  description?: string;
}

export interface VolunteerProfileCreateDto {
  userId: number;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  skills: VolunteerSkillCreateDto[];
}

export interface VolunteerProfileUpdateDto {
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  skills: VolunteerSkillUpdateDto[];
}

export interface VolunteerProfileListDto {
  volunteerId: number;
  fullName: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  volunteerHours: number;
  rating?: number;
}

export interface VolunteerProfileDetailDto {
  volunteerId: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  volunteerHours: number;
  rating?: number;
  ratingCount: number;
  skills: VolunteerSkillDto[];
  isVerified?: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
}

/**
 * Service for managing volunteer profiles
 * Implements FE-02: Manage Volunteer Profile use cases
 */
export class VolunteerProfileService {
  private readonly baseEndpoint = "/api/volunteerprofile";

  /**
   * Get all volunteer profiles (Admin only)
   * Use case: List Volunteer Profiles
   */
  async getAllProfiles(): Promise<VolunteerProfileListDto[]> {
    const response = await apiClient.get<VolunteerProfileListDto[]>(
      this.baseEndpoint
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch volunteer profiles");
    }

    return response.data;
  }

  /**
   * Get volunteer profile by user ID
   * Use case: View Volunteer Profile
   */
  async getProfileByUserId(
    userId: number
  ): Promise<VolunteerProfileDetailDto | null> {
    try {
      const response = await apiClient.get<VolunteerProfileDetailDto>(
        `${this.baseEndpoint}/${userId}`
      );

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      // If profile doesn't exist, return null instead of throwing
      if ((error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new volunteer profile
   * Use case: Add Volunteer Profile
   */
  async createProfile(
    data: VolunteerProfileCreateDto
  ): Promise<VolunteerProfileDetailDto> {
    const response = await apiClient.post<VolunteerProfileDetailDto>(
      this.baseEndpoint,
      data
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to create volunteer profile");
    }

    return response.data;
  }

  /**
   * Update an existing volunteer profile
   * Use case: Update Volunteer Profile
   */
  async updateProfile(
    userId: number,
    data: VolunteerProfileUpdateDto
  ): Promise<void> {
    const response = await apiClient.put<void>(
      `${this.baseEndpoint}/${userId}`,
      data
    );

    if (!response.success) {
      throw new Error("Failed to update volunteer profile");
    }
  }

  /**
   * Delete a volunteer profile (Admin only)
   * Use case: Delete Volunteer Profile
   */
  async deleteProfile(userId: number): Promise<void> {
    const response = await apiClient.delete<void>(
      `${this.baseEndpoint}/${userId}`
    );

    if (!response.success) {
      throw new Error("Failed to delete volunteer profile");
    }
  }

  /**
   * Check if user has a volunteer profile
   * Utility method for profile existence check
   */
  async hasProfile(userId: number): Promise<boolean> {
    const profile = await this.getProfileByUserId(userId);
    return profile !== null;
  }

  /**
   * Get profile statistics for dashboard
   * Utility method for volunteer dashboard
   */
  async getProfileStats(userId: number): Promise<{
    volunteerHours: number;
    rating: number;
    ratingCount: number;
    eventsParticipated: number;
    certificates: number;
  } | null> {
    const profile = await this.getProfileByUserId(userId);

    if (!profile) {
      return null;
    }

    return {
      volunteerHours: profile.volunteerHours,
      rating: profile.rating || 0,
      ratingCount: profile.ratingCount,
      // These will be implemented in future features
      eventsParticipated: 0, // From EventRegistrations
      certificates: 0, // From Certificates table
    };
  }
}

// Export singleton instance
export const volunteerProfileService = new VolunteerProfileService();
