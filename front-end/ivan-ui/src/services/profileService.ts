// Profile Service for IVAN System
// Handles all profile-related API calls for different user roles

import { apiClient } from "./apiClient";

class ProfileService {
  // Get profile by role and user ID (unified method)
  async getProfileByRole(userId: number, role: string): Promise<any> {
    try {
      switch (role.toLowerCase()) {
        case "volunteer":
          const volunteerResponse = await apiClient.get(
            `/VolunteerProfile/${userId}`
          );
          return volunteerResponse.data;
        case "organization":
          const orgResponse = await apiClient.get(
            `/OrganizationProfile/get/${userId}`
          );
          return orgResponse.data;
        case "partner":
          const partnerResponse = await apiClient.get(
            `/PartnerProfile/get/${userId}`
          );
          return partnerResponse.data;
        case "coordinator":
          // Coordinator profiles not yet implemented in backend
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
          // Admin profiles not yet implemented in backend
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
    } catch (error: any) {
      // If profile doesn't exist (404), return null instead of throwing
      if (error.response?.status === 404) {
        return null;
      }

      console.error(
        `Error fetching ${role} profile for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  // Update profile by role (unified method)
  async updateProfileByRole(
    userId: number,
    role: string,
    data: any
  ): Promise<any> {
    try {
      switch (role.toLowerCase()) {
        case "volunteer":
          const volunteerResponse = await apiClient.put(
            `/VolunteerProfile/${userId}`,
            data
          );
          return volunteerResponse.data;
        case "organization":
          const orgResponse = await apiClient.put(
            `/OrganizationProfile/update/${userId}`,
            data
          );
          return orgResponse.data;
        case "partner":
          const partnerResponse = await apiClient.put(
            `/PartnerProfile/update/${userId}`,
            data
          );
          return partnerResponse.data;
        case "coordinator":
          // Coordinator profile updates not yet implemented in backend
          return data;
        case "admin":
          // Admin profile updates not yet implemented in backend
          return data;
        default:
          throw new Error(`Unsupported role: ${role}`);
      }
    } catch (error) {
      console.error(
        `Error updating ${role} profile for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  // Upload profile image
  async uploadProfileImage(
    file: File,
    userId: number,
    imageType: "avatar" | "banner" | "logo"
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId.toString());
      formData.append("imageType", imageType);

      // Use fetch directly for FormData uploads
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }/profiles/upload-image`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.imageUrl || result.data?.imageUrl || "";
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  }

  // Get available skills for volunteers
  async getAvailableSkills(): Promise<any[]> {
    try {
      const response = await apiClient.get("/skills");
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  }

  // Get organization types
  async getOrganizationTypes(): Promise<any[]> {
    try {
      const response = await apiClient.get("/organization-types");
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching organization types:", error);
      throw error;
    }
  }

  // Get partner industries
  async getPartnerIndustries(): Promise<any[]> {
    try {
      const response = await apiClient.get("/partner-industries");
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching partner industries:", error);
      throw error;
    }
  }

  // Get profile completion status
  async getProfileCompletion(userId: number, role: string): Promise<any> {
    try {
      // Return mock completion data since this endpoint may not exist yet
      return {
        totalFields: 10,
        completedFields: Math.floor(Math.random() * 10),
        completionPercentage: Math.floor(Math.random() * 100),
        missingFields: ["phone", "address"],
        suggestions: ["Complete your contact information", "Add profile photo"],
      };
    } catch (error) {
      console.error("Error fetching profile completion:", error);
      return {
        totalFields: 0,
        completedFields: 0,
        completionPercentage: 0,
        missingFields: [],
        suggestions: [],
      };
    }
  }
}

export const profileService = new ProfileService();
