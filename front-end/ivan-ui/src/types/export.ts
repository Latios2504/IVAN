// Export Service DTOs and Types
// Moved from exportService.ts for better organization

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
  organizationType?: string;
  includeInactive?: boolean;
  verificationStatus?: boolean;
  language?: string;
}

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  description: string;
}

export interface ExportStatistics {
  totalExports: number;
  exportsThisMonth: number;
  mostRequestedFormat: string;
  averageFileSize: number;
  lastExportDate?: string;
}
