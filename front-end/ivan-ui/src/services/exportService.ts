import { BaseService } from "./BaseService";
import { environment, API_ENDPOINTS } from "../config";
import type {
  AnalyticsExportRequest,
  UserExportRequest,
  EventExportRequest,
  EventRegistrationExportRequest,
  OrganizationExportRequest,
  ExportFormat,
  ExportStatistics,
} from "../types/export";

class ExportService extends BaseService {
  private readonly API_BASE_URL = environment.API_BASE_URL;

  /**
   * Export analytics data
   */
  async exportAnalytics(request: AnalyticsExportRequest): Promise<Blob> {
    try {
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

      // Using fetch directly for blob responses
      const response = await fetch(
        `${this.API_BASE_URL}${API_ENDPOINTS.EXPORT.ANALYTICS}`,
        {
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      return blob;
    } catch (error) {
      throw error;
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
      throw error;
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
      
      throw error;
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
      
      throw error;
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
      
      throw error;
    }
  }

  /**
   * Get supported export formats
   */
  async getSupportedFormats(): Promise<ExportFormat[]> {
    try {
      const response = await this.api.get<ExportFormat[]>("/export/formats");
      return response.data || [];
    } catch (error) {
      
      // Return default formats if API fails
      return [
        {
          id: "excel",
          name: "Excel",
          extension: "xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: "Microsoft Excel format",
        },
        {
          id: "csv",
          name: "CSV",
          extension: "csv",
          mimeType: "text/csv",
          description: "Comma-separated values",
        },
        {
          id: "pdf",
          name: "PDF",
          extension: "pdf",
          mimeType: "application/pdf",
          description: "Portable Document Format",
        },
        {
          id: "json",
          name: "JSON",
          extension: "json",
          mimeType: "application/json",
          description: "JavaScript Object Notation",
        },
      ];
    }
  }

  /**
   * Get export statistics (Admin only)
   */
  async getExportStatistics(): Promise<ExportStatistics> {
    try {
      const response = await this.api.get<ExportStatistics>(
        "/export/statistics"
      );
      return (
        response.data || {
          totalExports: 0,
          exportsThisMonth: 0,
          mostRequestedFormat: "Excel",
          averageFileSize: 0,
        }
      );
    } catch (error) {
      
      return {
        totalExports: 0,
        exportsThisMonth: 0,
        mostRequestedFormat: "Excel",
        averageFileSize: 0,
      };
    }
  }

  /**
   * Helper method to get the appropriate Accept header for the format
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
   * Helper method to download a blob as a file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Method for frontend export that returns blob and filename
  async exportAnalyticsFromFrontend(
    request: any
  ): Promise<{ blob: Blob; filename: string }> {
    const blob = await this.exportAnalytics(request);
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `analytics-${timestamp}.${
      request.format?.toLowerCase() || "xlsx"
    }`;
    return { blob, filename };
  }

  // Alias for downloadBlob for backward compatibility
  downloadFile(blob: Blob, filename: string): void {
    this.downloadBlob(blob, filename);
  }
}

// Export a singleton instance
export const exportService = new ExportService();
export default exportService;
