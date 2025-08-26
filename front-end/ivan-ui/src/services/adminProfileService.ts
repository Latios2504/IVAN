// Admin Profile Service - Matching backend AdminProfileController
import { apiClient } from "./apiClient";
import {
  type AdminProfileViewModel,
  type AdminProfileUpdateDto,
  type AdminAvatarUpdateDto,
  type ProfileCompletionInfo,
  validateAdminProfileUpdate,
} from "../types/adminProfile";
import { calculateProfileCompletion } from "../types/adminProfile";

class AdminProfileService {
  private readonly baseUrl = "/AdminProfile";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // Helper function to handle API errors
  private handleApiError(error: any): never {
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy thông tin admin");
    } else if (error.response?.status === 400) {
      const message = error.response?.data?.message || "Dữ liệu không hợp lệ";
      throw new Error(message);
    } else if (error.response?.status === 401) {
      throw new Error("Bạn không có quyền truy cập");
    } else if (error.response?.status === 500) {
      throw new Error("Lỗi hệ thống, vui lòng thử lại sau");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Đã xảy ra lỗi không xác định");
    }
  }

  // === PROFILE MANAGEMENT ENDPOINTS ===

  // GET /api/AdminProfile/me - Get My Profile
  async getMyProfile(): Promise<AdminProfileViewModel> {
    try {
      const response = await apiClient.get<AdminProfileViewModel>(
        `${this.baseUrl}/me`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Admin profile not found");
      }
      
      return this.extractDataFromNetResponse(response.data);
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  // PUT /api/AdminProfile - Update My Profile
  async updateMyProfile(
    profileData: AdminProfileUpdateDto
  ): Promise<AdminProfileViewModel> {
    // Validate data before sending
    const validationErrors = validateAdminProfileUpdate(profileData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    try {
      const response = await apiClient.put<AdminProfileViewModel>(
        this.baseUrl,
        profileData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update admin profile");
      }
      
      return this.extractDataFromNetResponse(response.data);
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  // POST /api/Upload/avatar/{userId} - Upload Avatar Image
  async uploadAvatarImage(file: File, userId: number): Promise<string> {
    if (!file) {
      throw new Error("File is required");
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed types: JPG, JPEG, PNG, GIF, WEBP");
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB");
    }

    try {
      const response = await apiClient.uploadFile<{ imageUrl: string }>(
        `/Upload/avatar/${userId}`,
        file
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to upload avatar image");
      }
      
      return response.data.imageUrl;
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  // PATCH /api/AdminProfile/avatar - Update Avatar
  async updateAvatar(avatarUrl: string): Promise<{ avatar: string }> {
    if (!avatarUrl || avatarUrl.trim() === "") {
      throw new Error("Avatar URL is required");
    }

    const avatarData: AdminAvatarUpdateDto = {
      avatarUrl: avatarUrl.trim(),
    };

    try {
      const response = await apiClient.patch<{ avatar: string }>(
        `${this.baseUrl}/avatar`,
        avatarData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update avatar");
      }
      
      return this.extractDataFromNetResponse(response.data);
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  // Combined method: Upload file and update avatar
  async uploadAndUpdateAvatar(file: File, userId: number): Promise<AdminProfileViewModel> {
    try {
      // First upload the image file
      const imageUrl = await this.uploadAvatarImage(file, userId);
      
      // Then update the avatar with the returned URL
      await this.updateAvatar(imageUrl);
      
      // Return updated profile
      return await this.getMyProfile();
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  // === UTILITY METHODS ===

  // Get profile completion information
  async getProfileCompletion(): Promise<ProfileCompletionInfo> {
    try {
      const profile = await this.getMyProfile();
      return calculateProfileCompletion(profile);
    } catch (error) {
      console.error("Error calculating profile completion:", error);
      return {
        completionPercentage: 0,
        missingFields: [],
      };
    }
  }

  // Check if profile is complete (for dashboard/navigation purposes)
  async isProfileComplete(): Promise<boolean> {
    try {
      const completion = await this.getProfileCompletion();
      return completion.completionPercentage >= 80; // Consider 80%+ as complete
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  }

  // Update specific profile fields (convenience method)
  async updateProfileField(
    field: keyof AdminProfileUpdateDto,
    value: string | undefined
  ): Promise<AdminProfileViewModel> {
    const updateData: AdminProfileUpdateDto = {
      [field]: value,
    };
    
    return this.updateMyProfile(updateData);
  }

  // Update personal information (convenience method)
  async updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  }): Promise<AdminProfileViewModel> {
    const updateData: AdminProfileUpdateDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
    };
    
    return this.updateMyProfile(updateData);
  }

  // Update address information (convenience method)
  async updateAddressInfo(data: {
    address?: string;
    wardCommune?: string;
    district?: string;
    province?: string;
    postalCode?: string;
  }): Promise<AdminProfileViewModel> {
    const updateData: AdminProfileUpdateDto = {
      address: data.address,
      wardCommune: data.wardCommune,
      district: data.district,
      province: data.province,
      postalCode: data.postalCode,
    };
    
    return this.updateMyProfile(updateData);
  }

  // Update emergency contact information (convenience method)
  async updateEmergencyContact(data: {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }): Promise<AdminProfileViewModel> {
    const updateData: AdminProfileUpdateDto = {
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
    };
    
    return this.updateMyProfile(updateData);
  }

  // === VALIDATION METHODS ===

  // Validate profile data before submission
  validateProfileData(data: AdminProfileUpdateDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors = validateAdminProfileUpdate(data);
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Check if avatar URL is valid
  isValidAvatarUrl(url: string): boolean {
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
    } catch {
      return false;
    }
  }

}

export const adminProfileService = new AdminProfileService();
export default adminProfileService;