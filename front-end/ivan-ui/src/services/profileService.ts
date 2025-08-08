import { apiClient } from "./apiClient";

class ProfileService {
  async getProfileByRole(userId: number, role: string): Promise<any> {
    switch (role.toLowerCase()) {
      case "volunteer":
        const response = await apiClient.get<any>(
          `/VolunteerProfile/${userId}`
        );
        return response.data;
      case "organization":
        const response2 = await apiClient.get<any>(
          `/OrganizationProfile/get/${userId}`
        );
        return response2.data;
      case "partner":
        const response3 = await apiClient.get<any>(
          `/PartnerProfile/get/${userId}`
        );
        return response3.data;
      case "coordinator":
        return {
          userId: userId,
          role: "coordinator",
          displayName: "Coordinator Profile",
          email: "",
          personalInfo: {},
          workInfo: {},
          organizationInfo: {},
        };
      case "admin":
        return {
          userId: userId,
          role: "admin",
          displayName: "Admin Profile",
          email: "",
          personalInfo: {},
          systemInfo: {},
          adminLevel: "System Administrator",
        };
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }

  async updateProfileByRole(
    userId: number,
    role: string,
    profileData: any
  ): Promise<any> {
    switch (role.toLowerCase()) {
      case "volunteer":
        const response = await apiClient.put<any>(
          `/VolunteerProfile/${userId}`,
          profileData
        );
        return response.data;
      case "organization":
        const response2 = await apiClient.put<any>(
          `/OrganizationProfile/update/${userId}`,
          profileData
        );
        return response2.data;
      case "partner":
        const response3 = await apiClient.put<any>(
          `/PartnerProfile/update/${userId}`,
          profileData
        );
        return response3.data;
      default:
        throw new Error(`Profile update not supported for role: ${role}`);
    }
  }

  async uploadProfileImage(
    userId: number,
    role: string,
    imageFile: File,
    imageType: "avatar" | "banner" | "logo"
  ): Promise<any> {
    const formData = new FormData();
    formData.append("image", imageFile);

    switch (role.toLowerCase()) {
      case "volunteer":
        const response = await apiClient.post<any>(
          `/VolunteerProfile/${userId}/upload-${imageType}`,
          formData
        );
        return response.data;
      case "organization":
        const response2 = await apiClient.post<any>(
          `/OrganizationProfile/${userId}/upload-${imageType}`,
          formData
        );
        return response2.data;
      case "partner":
        const response3 = await apiClient.post<any>(
          `/PartnerProfile/${userId}/upload-${imageType}`,
          formData
        );
        return response3.data;
      default:
        throw new Error(`Image upload not supported for role: ${role}`);
    }
  }

  async getProfileCompletion(userId: number, role: string): Promise<any> {
    try {
      switch (role.toLowerCase()) {
        case "volunteer":
          const response = await apiClient.get<any>(
            `/VolunteerProfile/${userId}/completion`
          );
          return response.data;
        case "organization":
          const response2 = await apiClient.get<any>(
            `/OrganizationProfile/${userId}/completion`
          );
          return response2.data;
        case "partner":
          const response3 = await apiClient.get<any>(
            `/PartnerProfile/${userId}/completion`
          );
          return response3.data;
        default:
          return { completionPercentage: 100, missingFields: [] };
      }
    } catch (error) {
      return { completionPercentage: 0, missingFields: [] };
    }
  }

  async getSkills(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>("/skills");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getIndustries(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>("/industries");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getOrganizationTypes(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>("/organization-types");
      return response.data;
    } catch (error) {
      return [];
    }
  }
}

export const profileService = new ProfileService();
