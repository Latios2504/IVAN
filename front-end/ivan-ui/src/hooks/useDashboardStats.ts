import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import type {
  SystemStats,
  OrganizationStats,
  VolunteerStats,
  PartnerStats,
  AdminStats,
} from "../types/dashboard";
import { useAuth } from "@/hooks/useAuth";

// Hook for system statistics (used on homepage)
export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getSystemStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load system statistics");
        console.error("Failed to fetch system stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => window.location.reload() };
};

// Hook for role-specific dashboard statistics
export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<
    OrganizationStats | VolunteerStats | PartnerStats | AdminStats | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        switch (user.role) {
          case "organization":
            data = await dashboardService.getOrganizationStats(
              user.organizationId
            );
            break;
          case "volunteer":
            // For volunteers, we need to get the volunteerId from their profile
            const volunteerId = (user.profile as any)?.volunteerId || user.id;
            data = await dashboardService.getVolunteerStats(volunteerId);
            break;
          case "partner":
            // For partners, we need to get the partnerId from their profile
            const partnerId = (user.profile as any)?.partnerId || user.id;
            data = await dashboardService.getPartnerStats(partnerId);
            break;
          case "admin":
            data = await dashboardService.getAdminStats();
            break;
          case "coordinator":
            // Coordinators use organization stats
            data = await dashboardService.getOrganizationStats(
              user.organizationId
            );
            break;
          default:
            throw new Error(`Unsupported role: ${user.role}`);
        }

        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard statistics");
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: () => window.location.reload(),
    userRole: user?.role,
  };
};
