import { useState, useEffect, useCallback } from "react";
import {
  volunteerProfileService,
  type VolunteerProfileDetailDto,
  type VolunteerProfileCreateDto,
  type VolunteerProfileUpdateDto,
  type VolunteerProfileListDto,
} from "../services/api/volunteerProfileService";
import { useAuth } from "./useAuth";

interface UseVolunteerProfileOptions {
  userId?: number;
  autoLoad?: boolean;
}

interface UseVolunteerProfileReturn {
  profile: VolunteerProfileDetailDto | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;

  // Actions
  loadProfile: (userId: number) => Promise<void>;
  createProfile: (data: VolunteerProfileCreateDto) => Promise<void>;
  updateProfile: (data: VolunteerProfileUpdateDto) => Promise<void>;
  deleteProfile: (userId: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing volunteer profile data and operations
 * Implements FE-02: Manage Volunteer Profile use cases
 */
export function useVolunteerProfile(
  options: UseVolunteerProfileOptions = {}
): UseVolunteerProfileReturn {
  const { userId: optionsUserId, autoLoad = false } = options;
  const { user } = useAuth();

  const [profile, setProfile] = useState<VolunteerProfileDetailDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = optionsUserId || user?.id;
  const hasProfile = profile !== null;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadProfile = useCallback(async (targetUserId: number) => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await volunteerProfileService.getProfileByUserId(
        targetUserId
      );
      setProfile(profileData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (data: VolunteerProfileCreateDto) => {
    setLoading(true);
    setError(null);

    try {
      const newProfile = await volunteerProfileService.createProfile(data);
      setProfile(newProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create profile";
      setError(errorMessage);
      throw err; // Re-throw for form error handling
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: VolunteerProfileUpdateDto) => {
      if (!userId) {
        setError("User ID is required for profile update");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await volunteerProfileService.updateProfile(userId, data);
        // Reload profile to get updated data
        await loadProfile(userId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        throw err; // Re-throw for form error handling
      } finally {
        setLoading(false);
      }
    },
    [userId, loadProfile]
  );

  const deleteProfile = useCallback(async (targetUserId: number) => {
    setLoading(true);
    setError(null);

    try {
      await volunteerProfileService.deleteProfile(targetUserId);
      setProfile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete profile";
      setError(errorMessage);
      throw err; // Re-throw for UI error handling
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setError("User ID is required for profile refresh");
      return;
    }
    await loadProfile(userId);
  }, [userId, loadProfile]);

  // Auto-load profile if userId is available and autoLoad is enabled
  useEffect(() => {
    if (autoLoad && userId) {
      loadProfile(userId);
    }
  }, [autoLoad, userId, loadProfile]);

  return {
    profile,
    loading,
    error,
    hasProfile,
    loadProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    refreshProfile,
    clearError,
  };
}

interface UseVolunteerProfileListOptions {
  autoLoad?: boolean;
}

interface UseVolunteerProfileListReturn {
  profiles: VolunteerProfileListDto[];
  loading: boolean;
  error: string | null;

  // Actions
  loadProfiles: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing volunteer profile lists (Admin use)
 * Implements List Volunteer Profiles use case
 */
export function useVolunteerProfileList(
  options: UseVolunteerProfileListOptions = {}
): UseVolunteerProfileListReturn {
  const { autoLoad = false } = options;

  const [profiles, setProfiles] = useState<VolunteerProfileListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await volunteerProfileService.getAllProfiles();
      setProfiles(profileData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profiles";
      setError(errorMessage);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfiles = useCallback(async () => {
    await loadProfiles();
  }, [loadProfiles]);

  // Auto-load profiles if autoLoad is enabled
  useEffect(() => {
    if (autoLoad) {
      loadProfiles();
    }
  }, [autoLoad, loadProfiles]);

  return {
    profiles,
    loading,
    error,
    loadProfiles,
    refreshProfiles,
    clearError,
  };
}

interface UseVolunteerProfileStatsOptions {
  userId?: number;
  autoLoad?: boolean;
}

interface UseVolunteerProfileStatsReturn {
  stats: {
    volunteerHours: number;
    rating: number;
    ratingCount: number;
    eventsParticipated: number;
    certificates: number;
  } | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadStats: (userId: number) => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for volunteer profile statistics
 * Used in dashboard and profile summary components
 */
export function useVolunteerProfileStats(
  options: UseVolunteerProfileStatsOptions = {}
): UseVolunteerProfileStatsReturn {
  const { userId: optionsUserId, autoLoad = false } = options;
  const { user } = useAuth();

  const [stats, setStats] =
    useState<UseVolunteerProfileStatsReturn["stats"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = optionsUserId || user?.id;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadStats = useCallback(async (targetUserId: number) => {
    setLoading(true);
    setError(null);

    try {
      const statsData = await volunteerProfileService.getProfileStats(
        targetUserId
      );
      setStats(statsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load statistics";
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    if (!userId) {
      setError("User ID is required for stats refresh");
      return;
    }
    await loadStats(userId);
  }, [userId, loadStats]);

  // Auto-load stats if userId is available and autoLoad is enabled
  useEffect(() => {
    if (autoLoad && userId) {
      loadStats(userId);
    }
  }, [autoLoad, userId, loadStats]);

  return {
    stats,
    loading,
    error,
    loadStats,
    refreshStats,
    clearError,
  };
}
