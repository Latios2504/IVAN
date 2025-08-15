// Analytics Service - Matching backend AnalyticsController
import { apiClient } from "./apiClient";
import type {
  AdminDashboardDto,
  OrganizationDashboardDto,
  PartnerDashboardDto,
  CoordinatorDashboardDto,
  VolunteerDashboardDto,
} from "../types/analytics";
import { TimePeriod } from "../types/analytics";

class AnalyticsService {
  private readonly baseUrl = "/Analytics";

  // GET /api/Analytics/admin/dashboard - Get Admin Dashboard Analytics
  async getAdminDashboard(
    period: TimePeriod = TimePeriod.Last30Days
  ): Promise<AdminDashboardDto> {
    const response = await apiClient.get<AdminDashboardDto>(
      `${this.baseUrl}/admin/dashboard`,
      { period }
    );

    if (!response.data) {
      throw new Error("Failed to retrieve admin dashboard data");
    }
    return response.data;
  }

  // GET /api/Analytics/organization/dashboard - Get Organization Dashboard Analytics
  async getOrganizationDashboard(
    period: TimePeriod = TimePeriod.Last30Days
  ): Promise<OrganizationDashboardDto> {
    const response = await apiClient.get<OrganizationDashboardDto>(
      `${this.baseUrl}/organization/dashboard`,
      { period }
    );

    if (!response.data) {
      throw new Error("Failed to retrieve organization dashboard data");
    }
    return response.data;
  }

  // GET /api/Analytics/partner/dashboard - Get Partner Dashboard Analytics
  async getPartnerDashboard(
    period: TimePeriod = TimePeriod.Last30Days
  ): Promise<PartnerDashboardDto> {
    const response = await apiClient.get<PartnerDashboardDto>(
      `${this.baseUrl}/partner/dashboard`,
      { period }
    );

    if (!response.data) {
      throw new Error("Failed to retrieve partner dashboard data");
    }
    return response.data;
  }

  // GET /api/Analytics/coordinator/dashboard - Get Coordinator Dashboard Analytics
  async getCoordinatorDashboard(
    period: TimePeriod = TimePeriod.Last30Days
  ): Promise<CoordinatorDashboardDto> {
    const response = await apiClient.get<CoordinatorDashboardDto>(
      `${this.baseUrl}/coordinator/dashboard`,
      { period }
    );

    if (!response.data) {
      throw new Error("Failed to retrieve coordinator dashboard data");
    }
    return response.data;
  }

  // GET /api/Analytics/volunteer/dashboard - Get Volunteer Dashboard Analytics
  async getVolunteerDashboard(
    period: TimePeriod = TimePeriod.Last30Days
  ): Promise<VolunteerDashboardDto> {
    const response = await apiClient.get<VolunteerDashboardDto>(
      `${this.baseUrl}/volunteer/dashboard`,
      { period }
    );

    if (!response.data) {
      throw new Error("Failed to retrieve volunteer dashboard data");
    }
    return response.data;
  }

  // Utility Methods
  getTimePeriodLabel(period: TimePeriod): string {
    switch (period) {
      case TimePeriod.Last7Days:
        return "Last 7 Days";
      case TimePeriod.Last30Days:
        return "Last 30 Days";
      case TimePeriod.Last3Months:
        return "Last 3 Months";
      case TimePeriod.Last6Months:
        return "Last 6 Months";
      case TimePeriod.LastYear:
        return "Last Year";
      case TimePeriod.Custom:
        return "Custom Period";
      default:
        return "Last 30 Days";
    }
  }

  getTimePeriodOptions(): Array<{ value: TimePeriod; label: string }> {
    return [
      {
        value: TimePeriod.Last7Days,
        label: this.getTimePeriodLabel(TimePeriod.Last7Days),
      },
      {
        value: TimePeriod.Last30Days,
        label: this.getTimePeriodLabel(TimePeriod.Last30Days),
      },
      {
        value: TimePeriod.Last3Months,
        label: this.getTimePeriodLabel(TimePeriod.Last3Months),
      },
      {
        value: TimePeriod.Last6Months,
        label: this.getTimePeriodLabel(TimePeriod.Last6Months),
      },
      {
        value: TimePeriod.LastYear,
        label: this.getTimePeriodLabel(TimePeriod.LastYear),
      },
    ];
  }

  // Helper method to format numbers for display
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  // Helper method to format currency
  formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  // Helper method to format percentage
  formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  // Helper method to calculate growth rate
  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
