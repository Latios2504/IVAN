// useProfile Hook for IVAN System
// Manages profile data state and operations across all user roles

import { useState, useEffect } from "react";
import { profileService } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UseProfileState {
  profile: any | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  profileCompletion: any | null;
}

interface UseProfileActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  uploadImage: (
    file: File,
    imageType: "avatar" | "banner" | "logo"
  ) => Promise<void>;
  toggleEdit: () => void;
  setIsEditing: (editing: boolean) => void;
  refetch: () => Promise<void>;
}

export function useProfile(
  userId?: number,
  role?: string
): UseProfileState & UseProfileActions {
  const { user } = useAuth();
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: false,
    error: null,
    isEditing: false,
    profileCompletion: null,
  });

  // Use provided userId/role or fall back to current user
  const targetUserId = userId || user?.id;
  const targetRole = role || user?.role;

  const updateState = (updates: Partial<UseProfileState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchProfile = async () => {
    if (!targetUserId || !targetRole) {
      updateState({ error: "User ID và role là bắt buộc" });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const [profileData, completionData] = await Promise.allSettled([
        profileService.getProfileByRole(targetUserId, targetRole),
        profileService.getProfileCompletion(targetUserId, targetRole),
      ]);

      const profileResult =
        profileData.status === "fulfilled" ? profileData.value : null;
      const completionResult =
        completionData.status === "fulfilled" ? completionData.value : null;

      updateState({
        profile: profileResult,
        profileCompletion: completionResult,
        loading: false,
        error: null, // Don't treat "profile not found" as an error - just show null profile
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      updateState({
        loading: false,
        error: "Có lỗi xảy ra khi tải thông tin hồ sơ",
      });
    }
  };

  const updateProfile = async (data: any) => {
    if (!targetUserId || !targetRole) {
      toast.error("Thiếu thông tin user ID hoặc role");
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const updatedProfile = await profileService.updateProfileByRole(
        targetUserId,
        targetRole,
        data
      );

      updateState({
        profile: updatedProfile,
        loading: false,
        isEditing: false,
      });

      // Refresh completion data
      try {
        const completionData = await profileService.getProfileCompletion(
          targetUserId,
          targetRole
        );
        updateState({ profileCompletion: completionData });
      } catch (completionError) {
        console.warn(
          "Could not fetch updated completion data:",
          completionError
        );
      }

      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      updateState({
        loading: false,
        error: "Có lỗi xảy ra khi cập nhật hồ sơ",
      });
      toast.error("Có lỗi xảy ra khi cập nhật hồ sơ");
    }
  };

  const uploadImage = async (
    file: File,
    imageType: "avatar" | "banner" | "logo"
  ) => {
    if (!targetUserId) {
      toast.error("Thiếu thông tin user ID");
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const imageUrl = await profileService.uploadProfileImage(
        file,
        targetUserId,
        imageType
      );

      // Update the profile with the new image URL
      const imageField =
        imageType === "avatar"
          ? "avatar"
          : imageType === "banner"
          ? "bannerUrl"
          : "logoUrl";

      const updatedProfile = { ...state.profile, [imageField]: imageUrl };
      updateState({
        profile: updatedProfile,
        loading: false,
      });

      toast.success(`Cập nhật ${imageType} thành công!`);
    } catch (error) {
      console.error("Error uploading image:", error);
      updateState({
        loading: false,
        error: "Có lỗi xảy ra khi tải ảnh lên",
      });
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  const toggleEdit = () => {
    updateState({ isEditing: !state.isEditing });
  };

  const setIsEditing = (editing: boolean) => {
    updateState({ isEditing: editing });
  };

  const refetch = async () => {
    await fetchProfile();
  };

  // Auto-fetch profile when component mounts or dependencies change
  useEffect(() => {
    if (targetUserId && targetRole) {
      fetchProfile();
    }
  }, [targetUserId, targetRole]);

  return {
    ...state,
    fetchProfile,
    updateProfile,
    uploadImage,
    toggleEdit,
    setIsEditing,
    refetch,
  };
}

// Hook for fetching data needed for profile forms
export function useProfileFormData(role: string) {
  const [formData, setFormData] = useState<{
    skills: any[];
    organizationTypes: any[];
    partnerIndustries: any[];
    loading: boolean;
    error: string | null;
  }>({
    skills: [],
    organizationTypes: [],
    partnerIndustries: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchFormData = async () => {
      setFormData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const promises: Promise<any>[] = [];

        if (role === "volunteer") {
          promises.push(profileService.getAvailableSkills());
        }
        if (role === "organization") {
          promises.push(profileService.getOrganizationTypes());
        }
        if (role === "partner") {
          promises.push(profileService.getPartnerIndustries());
        }

        const results = await Promise.allSettled(promises);

        const newFormData: any = { loading: false, error: null };

        if (role === "volunteer" && results[0]) {
          newFormData.skills =
            results[0].status === "fulfilled" ? results[0].value : [];
        }
        if (role === "organization" && results[0]) {
          newFormData.organizationTypes =
            results[0].status === "fulfilled" ? results[0].value : [];
        }
        if (role === "partner" && results[0]) {
          newFormData.partnerIndustries =
            results[0].status === "fulfilled" ? results[0].value : [];
        }

        setFormData((prev) => ({ ...prev, ...newFormData }));
      } catch (error) {
        console.error("Error fetching form data:", error);
        setFormData((prev) => ({
          ...prev,
          loading: false,
          error: "Có lỗi xảy ra khi tải dữ liệu form",
        }));
      }
    };

    if (role) {
      fetchFormData();
    }
  }, [role]);

  return formData;
}
