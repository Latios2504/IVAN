// Report API Types - Matching backend ReportController

// Input DTOs for creating reports
export interface ReportInputDto {
  content: string;
}

// View model for report data
export interface ReportDto {
  reportId: number;
  reportType: string;
  content: string;
  generatedDate?: string;
  createdBy?: number;
  createdAt?: string;
}

// Filter model for report queries
export interface ReportFilterDto {
  pageNumber: number;
  pageSize: number;
}

// Report statistics (for dashboard/analytics)
export interface ReportStatsDto {
  totalReports: number;
  eventReports: number;
  organizationReports: number;
  systemReports: number;
  recentReports: number;
}

// Report validation result
export interface ReportValidationResult {
  isValid: boolean;
  errors: string[];
}

// Report type constants
export const REPORT_TYPES = {
  EVENT: 'Event',
  ORGANIZATION: 'Organization',
  SYSTEM: 'System'
} as const;

export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

// Report type options for UI
export const REPORT_TYPE_OPTIONS = [
  { value: REPORT_TYPES.EVENT, label: 'Event Report' },
  { value: REPORT_TYPES.ORGANIZATION, label: 'Organization Report' },
  { value: REPORT_TYPES.SYSTEM, label: 'System Report' }
];

// Default filter values
export const DEFAULT_REPORT_FILTER: ReportFilterDto = {
  pageNumber: 1,
  pageSize: 10
};

// Report sort options
export const REPORT_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'reportType_asc', label: 'Type A-Z' },
  { value: 'reportType_desc', label: 'Type Z-A' }
];

export type ReportSortOption = typeof REPORT_SORT_OPTIONS[number]['value'];

// Report download formats
export const REPORT_DOWNLOAD_FORMATS = {
  PDF: 'pdf'
} as const;

export type ReportDownloadFormat = typeof REPORT_DOWNLOAD_FORMATS[keyof typeof REPORT_DOWNLOAD_FORMATS];