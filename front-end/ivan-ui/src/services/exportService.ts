import { apiClient } from "./apiClient";
import config from "../config/environment";

export interface AnalyticsExportRequest {
  format: "Excel" | "Csv" | "Pdf" | "Json";
  period?:
    | "Last7Days"
    | "Last30Days"
    | "Last3Months"
    | "Last6Months"
    | "LastYear"
    | "Custom";
  startDate?: string;
  endDate?: string;
  sections?: (
    | "UserAnalytics"
    | "EventAnalytics"
    | "GeographicDistribution"
    | "RoleDistribution"
    | "EventTrends"
    | "CategoryStats"
    | "RegistrationStats"
  )[];
  includeCharts?: boolean;
  language?: string;
}

export interface UserExportRequest {
  format: "Excel" | "Csv" | "Pdf" | "Json";
  userTypes?: string[];
  includeInactive?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  language?: string;
}

export interface EventExportRequest {
  format: "Excel" | "Csv" | "Pdf" | "Json";
  organizationId?: number;
  eventStatus?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  language?: string;
}

export interface EventRegistrationExportRequest {
  format: "Excel" | "Csv" | "Pdf" | "Json";
  eventId?: number;
  organizationId?: number;
  registrationStatus?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  language?: string;
}

export interface OrganizationExportRequest {
  format: "Excel" | "Csv" | "Pdf" | "Json";
  includeInactive?: boolean;
  verificationStatus?: string[];
  language?: string;
}

class ExportService {
  private readonly API_BASE_URL = config.API_BASE_URL;

  /**
   * Export analytics data
   */
  async exportAnalytics(request: AnalyticsExportRequest): Promise<Blob> {
    try {
      console.log("Sending analytics export request:", request);

      // Create a minimal test request to debug the issue
      const minimalRequest = {
        format: "Excel",
        period: "Last30Days",
        includeCharts: true,
        language: "vi-VN",
      };

      // Try wrapping in request field based on error message
      const wrappedRequest = {
        request: minimalRequest,
      };

      console.log("Sending wrapped request:", wrappedRequest);

      // Using fetch directly for blob responses
      const response = await fetch(`${this.API_BASE_URL}/export/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: this.getAcceptHeader(request.format),
          // Add authorization header if available
          ...(localStorage.getItem("authToken") && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify(wrappedRequest),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Analytics export failed:", error);
      throw new Error("Không thể xuất dữ liệu thống kê. Vui lòng thử lại sau.");
    }
  }

  /**
   * Export users data
   */
  async exportUsers(request: UserExportRequest): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/export/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: this.getAcceptHeader(request.format),
          ...(localStorage.getItem("authToken") && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Users export failed:", error);
      throw new Error(
        "Không thể xuất dữ liệu người dùng. Vui lòng thử lại sau."
      );
    }
  }

  /**
   * Export events data
   */
  async exportEvents(request: EventExportRequest): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/export/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: this.getAcceptHeader(request.format),
          ...(localStorage.getItem("authToken") && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Events export failed:", error);
      throw new Error("Không thể xuất dữ liệu sự kiện. Vui lòng thử lại sau.");
    }
  }

  /**
   * Export event registrations data
   */
  async exportEventRegistrations(
    request: EventRegistrationExportRequest
  ): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/export/event-registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: this.getAcceptHeader(request.format),
            ...(localStorage.getItem("authToken") && {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }),
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Event registrations export failed:", error);
      throw new Error(
        "Không thể xuất dữ liệu đăng ký sự kiện. Vui lòng thử lại sau."
      );
    }
  }

  /**
   * Export organizations data (Admin only)
   */
  async exportOrganizations(request: OrganizationExportRequest): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/export/organizations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: this.getAcceptHeader(request.format),
            ...(localStorage.getItem("authToken") && {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }),
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Organizations export failed:", error);
      throw new Error("Không thể xuất dữ liệu tổ chức. Vui lòng thử lại sau.");
    }
  }

  /**
   * Get supported export formats
   */
  async getSupportedFormats() {
    try {
      const response = await apiClient.get(
        `${this.API_BASE_URL}/export/formats`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get supported formats:", error);
      throw new Error("Không thể lấy danh sách định dạng hỗ trợ.");
    }
  }

  /**
   * Get export statistics (Admin only)
   */
  async getExportStatistics() {
    try {
      const response = await apiClient.get(
        `${this.API_BASE_URL}/export/statistics`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get export statistics:", error);
      throw new Error("Không thể lấy thống kê xuất dữ liệu.");
    }
  }

  /**
   * Download a blob as a file
   */
  downloadFile(blob: Blob, filename: string): void {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      throw new Error("Không thể tải xuống tệp. Vui lòng thử lại.");
    }
  }

  /**
   * Generate filename based on data type and format
   */
  generateFilename(dataType: string, format: string, timestamp?: Date): string {
    const date = timestamp || new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "");

    const extension = this.getFileExtension(format);

    return `${dataType}-${dateStr}-${timeStr}${extension}`;
  }

  /**
   * Get file extension for format
   */
  private getFileExtension(format: string): string {
    switch (format.toLowerCase()) {
      case "excel":
        return ".xlsx";
      case "csv":
        return ".csv";
      case "pdf":
        return ".pdf";
      case "json":
        return ".json";
      default:
        return ".dat";
    }
  }

  /**
   * Get Accept header for format
   */
  private getAcceptHeader(format: string): string {
    switch (format.toLowerCase()) {
      case "excel":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "csv":
        return "text/csv";
      case "pdf":
        return "application/pdf";
      case "json":
        return "application/json";
      default:
        return "application/octet-stream";
    }
  }

  /**
   * Convert frontend format to backend format
   */
  private formatToBackendFormat(
    format: "excel" | "csv" | "pdf" | "json"
  ): "Excel" | "Csv" | "Pdf" | "Json" {
    const formatMap = {
      excel: "Excel" as const,
      csv: "Csv" as const,
      pdf: "Pdf" as const,
      json: "Json" as const,
    };

    return formatMap[format];
  }

  /**
   * Export analytics with frontend format conversion
   */
  async exportAnalyticsFromFrontend(options: {
    format: "excel" | "csv" | "pdf" | "json";
    dateRange?: { startDate: Date; endDate: Date };
    sections?: string[];
    includeCharts?: boolean;
    language?: string;
  }): Promise<{ blob: Blob; filename: string }> {
    // Map frontend sections to backend sections
    const mapSections = (
      sections?: string[]
    ):
      | (
          | "UserAnalytics"
          | "EventAnalytics"
          | "GeographicDistribution"
          | "RoleDistribution"
          | "EventTrends"
          | "CategoryStats"
          | "RegistrationStats"
        )[]
      | undefined => {
      if (!sections) return undefined;

      const sectionMap: Record<
        string,
        | "UserAnalytics"
        | "EventAnalytics"
        | "GeographicDistribution"
        | "RoleDistribution"
        | "EventTrends"
        | "CategoryStats"
        | "RegistrationStats"
      > = {
        user: "UserAnalytics",
        users: "UserAnalytics",
        userAnalytics: "UserAnalytics",
        event: "EventAnalytics",
        events: "EventAnalytics",
        eventAnalytics: "EventAnalytics",
        geographic: "GeographicDistribution",
        geographicDistribution: "GeographicDistribution",
        role: "RoleDistribution",
        roles: "RoleDistribution",
        roleDistribution: "RoleDistribution",
        trends: "EventTrends",
        eventTrends: "EventTrends",
        category: "CategoryStats",
        categories: "CategoryStats",
        categoryStats: "CategoryStats",
        registration: "RegistrationStats",
        registrations: "RegistrationStats",
        registrationStats: "RegistrationStats",
      };

      return sections.map((section) => sectionMap[section] || "UserAnalytics");
    };

    const request: AnalyticsExportRequest = {
      format: this.formatToBackendFormat(options.format),
      period: options.dateRange ? "Custom" : "Last30Days",
      startDate: options.dateRange?.startDate.toISOString(),
      endDate: options.dateRange?.endDate.toISOString(),
      sections: mapSections(options.sections),
      includeCharts: options.includeCharts ?? true,
      language: options.language || "vi-VN",
    };

    const blob = await this.exportAnalytics(request);
    const filename = this.generateFilename("analytics", options.format);

    return { blob, filename };
  }
}

// Export a singleton instance
export const exportService = new ExportService();
export default exportService;
