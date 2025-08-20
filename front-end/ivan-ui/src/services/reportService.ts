// Report Service - Matching backend ReportController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  ReportInputDto,
  ReportDto,
  ReportFilterDto,
  ReportStatsDto,
  ReportValidationResult,
  ReportType
} from "../types/report";
import { REPORT_TYPES } from "../types/report";

// CRUD Operations
export const reportService = {
  // Get paginated event reports
  async getEventReports(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResultDto<ReportDto>> {
    const response = await apiClient.get<PagedResultDto<ReportDto>>(
      `/api/Report/listEventReport?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data!;
  },

  // Get paginated organization reports
  async getOrganizationReports(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResultDto<ReportDto>> {
    const response = await apiClient.get<PagedResultDto<ReportDto>>(
      `/api/Report/listOrganizationReport?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data!;
  },

  // Get paginated system reports
  async getSystemReports(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResultDto<ReportDto>> {
    const response = await apiClient.get<PagedResultDto<ReportDto>>(
      `/api/Report/listSystemReport?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data!;
  },

  // Get event report by ID
  async getEventReportById(id: number): Promise<ReportDto> {
    const response = await apiClient.get<ReportDto>(`/api/Report/getEventReport/${id}`);
    if (!response.data) {
      throw new Error('Event report not found');
    }
    return response.data;
  },

  // Get organization report by ID
  async getOrganizationReportById(id: number): Promise<ReportDto> {
    const response = await apiClient.get<ReportDto>(`/api/Report/getOrganizationReport/${id}`);
    if (!response.data) {
      throw new Error('Organization report not found');
    }
    return response.data;
  },

  // Get system report by ID
  async getSystemReportById(id: number): Promise<ReportDto> {
    const response = await apiClient.get<ReportDto>(`/api/Report/getSystemReport/${id}`);
    if (!response.data) {
      throw new Error('System report not found');
    }
    return response.data;
  },

  // Create event report
  async createEventReport(reportData: ReportInputDto): Promise<ReportDto> {
    const response = await apiClient.post<ReportDto>('/api/Report/addEventReport', reportData);
    return response.data!;
  },

  // Create organization report
  async createOrganizationReport(reportData: ReportInputDto): Promise<ReportDto> {
    const response = await apiClient.post<ReportDto>('/api/Report/addOrganizationReport', reportData);
    return response.data!;
  },

  // Download event report as PDF
  async downloadEventReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`/api/Report/downloadEventReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  // Download organization report as PDF
  async downloadOrganizationReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`/api/Report/downloadOrganizationReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  // Download system report as PDF
  async downloadSystemReport(id: number): Promise<Blob> {
    const response = await apiClient.get(`/api/Report/downloadSystemReport/${id}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  // Get report statistics (mock implementation - extend based on actual backend)
  async getReportStats(): Promise<ReportStatsDto> {
    // This would typically come from a dedicated analytics endpoint
    // For now, we'll aggregate from existing endpoints
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
};

// Validation Functions
export const validateReportData = (data: ReportInputDto): ReportValidationResult => {
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

  // Download report file with proper filename
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

  // Check if user can download reports (role-based)
  canDownloadReports: (userRole?: string): boolean => {
    // Implement based on your role system
    return userRole === 'Admin' || userRole === 'Coordinator';
  },

  // Check if user can create reports (role-based)
  canCreateReports: (userRole?: string): boolean => {
    // Implement based on your role system
    return userRole === 'Admin' || userRole === 'Coordinator';
  },

  // Get report content word count
  getWordCount: (content: string): number => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Validate report content format
  isValidReportContent: (content: string): boolean => {
    // Basic validation - can be extended
    return content.trim().length >= 10 && content.length <= 10000;
  }
};

export default reportService;