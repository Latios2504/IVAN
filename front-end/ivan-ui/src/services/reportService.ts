// Report Service - Matching backend ReportController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  ReportInputModel,
  ReportViewModel,
  ReportFilterModel,
  ReportStatsDto,
  ReportValidationResult,
  ReportType
} from "../types/report";
import { REPORT_TYPES } from "../types/report";

class ReportService {
  private readonly baseUrl = "/Report";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === LIST ENDPOINTS ===

  // GET /api/Report/listEventReport - Get Event Reports (VolunteerCoordinator, Admin)
  async getEventReports(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<ReportViewModel>> {
    const response = await apiClient.get<PagedResultDto<ReportViewModel>>(
      `${this.baseUrl}/listEventReport`,
      { pageNumber, pageSize }
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<ReportViewModel>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<ReportViewModel>;
  }

  // GET /api/Report/listOrganizationReport - Get Organization Reports (Organization, Admin)
  async getOrganizationReports(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<ReportViewModel>> {
    const response = await apiClient.get<PagedResultDto<ReportViewModel>>(
      `${this.baseUrl}/listOrganizationReport`,
      { pageNumber, pageSize }
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    return this.extractDataFromNetResponse(response.data) as PagedResultDto<ReportViewModel>;
  }

  // GET /api/Report/listSystemReport - Get System Reports (Admin only)
  async getSystemReports(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<ReportViewModel>> {
    const response = await apiClient.get<PagedResultDto<ReportViewModel>>(
      `${this.baseUrl}/listSystemReport`,
      { pageNumber, pageSize }
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    return this.extractDataFromNetResponse(response.data) as PagedResultDto<ReportViewModel>;
  }

  // === GET BY ID ENDPOINTS ===

  // GET /api/Report/getEventReport/{id} - Get Event Report by ID (VolunteerCoordinator, Admin)
  async getEventReportById(id: number): Promise<ReportViewModel> {
    const response = await apiClient.get<ReportViewModel>(
      `${this.baseUrl}/getEventReport/${id}`
    );
    if (!response.data) {
      throw new Error("Event report not found");
    }
    return response.data;
  }

  // GET /api/Report/getOrganizationReport/{id} - Get Organization Report by ID (Organization, Admin)
  async getOrganizationReportById(id: number): Promise<ReportViewModel> {
    const response = await apiClient.get<ReportViewModel>(
      `${this.baseUrl}/getOrganizationReport/${id}`
    );
    if (!response.data) {
      throw new Error("Organization report not found");
    }
    return response.data;
  }

  // GET /api/Report/getSystemReport/{id} - Get System Report by ID (Admin only)
  async getSystemReportById(id: number): Promise<ReportViewModel> {
    const response = await apiClient.get<ReportViewModel>(
      `${this.baseUrl}/getSystemReport/${id}`
    );
    if (!response.data) {
      throw new Error("System report not found");
    }
    return response.data;
  }

  // GET /api/Report/getReport/{id} - Get Report by ID (Any authenticated user)
  async getReportById(id: number): Promise<ReportViewModel> {
    const response = await apiClient.get<ReportViewModel>(
      `${this.baseUrl}/getReport/${id}`
    );
    if (!response.data) {
      throw new Error("Report not found");
    }
    return response.data;
  }

  // === CREATE ENDPOINTS ===

  // POST /api/Report/addEventReport/{eventId} - Create Event Report (VolunteerCoordinator, Admin)
  async createEventReport(
    eventId: number,
    reportData: ReportInputModel
  ): Promise<ReportViewModel> {
    const response = await apiClient.post<ReportViewModel>(
      `${this.baseUrl}/addEventReport/${eventId}`,
      reportData
    );
    if (!response.data) {
      throw new Error("Failed to create event report");
    }
    return response.data;
  }

  // POST /api/Report/addOrganizationReport/{orgId} - Create Organization Report (Organization, Admin)
  async createOrganizationReport(
    orgId: number,
    reportData: ReportInputModel
  ): Promise<ReportViewModel> {
    const response = await apiClient.post<ReportViewModel>(
      `${this.baseUrl}/addOrganizationReport/${orgId}`,
      reportData
    );
    if (!response.data) {
      throw new Error("Failed to create organization report");
    }
    return response.data;
  }

  // === DOWNLOAD ENDPOINTS ===

  // GET /api/Report/downloadEventReport/{id} - Download Event Report as PDF (VolunteerCoordinator, Admin)
  async downloadEventReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/downloadEventReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  // GET /api/Report/downloadOrganizationReport/{id} - Download Organization Report as PDF (Organization, Admin)
  async downloadOrganizationReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/downloadOrganizationReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  // GET /api/Report/downloadSystemReport/{id} - Download System Report as PDF (Admin only)
  async downloadSystemReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/downloadSystemReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  // GET /api/Report/downloadReport/{id} - Download Report as PDF (Any authenticated user)
  async downloadReportById(id: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/downloadReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  // === UTILITY METHODS ===

  // Get report statistics (aggregated from existing endpoints)
  async getReportStats(): Promise<ReportStatsDto> {
    try {
      const [eventReports, orgReports, systemReports] = await Promise.all([
        this.getEventReports(1, 1),
        this.getOrganizationReports(1, 1),
        this.getSystemReports(1, 1)
      ]);

      return {
        totalReports: eventReports.totalCount + orgReports.totalCount + systemReports.totalCount,
        eventReports: eventReports.totalCount,
        organizationReports: orgReports.totalCount,
        systemReports: systemReports.totalCount,
        recentReports: 0 // Would need additional endpoint for this
      };
    } catch (error) {
      console.error('Error fetching report stats:', error);
      return {
        totalReports: 0,
        eventReports: 0,
        organizationReports: 0,
        systemReports: 0,
        recentReports: 0
      };
    }
  }
}

// Validation Functions
export const validateReportData = (data: ReportInputModel): ReportValidationResult => {
  const errors: string[] = [];

  // Validate content
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Report content is required');
  }

  if (data.content && data.content.length < 10) {
    errors.push('Report content must be at least 10 characters long');
  }

  if (data.content && data.content.length > 10000) {
    errors.push('Report content must not exceed 10,000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility Functions
export const reportUtils = {
  // Format report date for display
  formatReportDate: (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get report type display name
  getReportTypeDisplayName: (reportType: string): string => {
    switch (reportType) {
      case REPORT_TYPES.EVENT:
        return 'Event Report';
      case REPORT_TYPES.ORGANIZATION:
        return 'Organization Report';
      case REPORT_TYPES.SYSTEM:
        return 'System Report';
      default:
        return reportType;
    }
  },

  // Get report type color for UI
  getReportTypeColor: (reportType: string): string => {
    switch (reportType) {
      case REPORT_TYPES.EVENT:
        return 'blue';
      case REPORT_TYPES.ORGANIZATION:
        return 'green';
      case REPORT_TYPES.SYSTEM:
        return 'purple';
      default:
        return 'gray';
    }
  },

  // Truncate report content for preview
  truncateContent: (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  },

  // Download report file with proper naming
  downloadReportFile: (blob: Blob, reportType: ReportType, reportId: number): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}Report_${reportId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Check if user can download reports (based on role)
  canDownloadReports: (userRole?: string): boolean => {
    return ['Admin', 'VolunteerCoordinator', 'Organization'].includes(userRole || '');
  },

  // Check if user can create reports (based on role)
  canCreateReports: (userRole?: string): boolean => {
    return ['Admin', 'VolunteerCoordinator', 'Organization'].includes(userRole || '');
  },

  // Get word count from content
  getWordCount: (content: string): number => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Validate report content
  isValidReportContent: (content: string): boolean => {
    return content.trim().length >= 10 && content.length <= 10000;
  }
};

export const reportService = new ReportService();
export default reportService;