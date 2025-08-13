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
    file: File,
    userId: number,
    imageType: "avatar" | "banner" | "logo"
  ): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post<{ imageUrl: string }>(
        `/Upload/${imageType}/${userId}`,
        formData
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
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

  async getAvailableSkills(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        "/VolunteerProfile/public/skills"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  }

  async getPartnerIndustries(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        "/PartnerProfile/public/partner-industries"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching partner industries:", error);
      return [];
    }
  }

  async getSkills(): Promise<any[]> {
    return this.getAvailableSkills();
  }

  async getIndustries(): Promise<any[]> {
    return this.getPartnerIndustries();
  }

  async getOrganizationTypes(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        "/OrganizationProfile/public/organization-types"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching organization types:", error);
      return [];
    }
  }
}

export const profileService = new ProfileService();
