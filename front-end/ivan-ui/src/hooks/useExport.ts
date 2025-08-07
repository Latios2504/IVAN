import { useState } from "react";
import { exportService } from "../services/exportService";
import type {
  AnalyticsExportRequest,
  UserExportRequest,
  EventExportRequest,
} from "../types/export";
import { toast } from "sonner";

export type ExportDataType =
  | "analytics"
  | "users"
  | "events"
  | "registrations"
  | "organizations";
export type ExportFormat = "excel" | "csv" | "pdf" | "json";

export interface UseExportOptions {
  onSuccess?: (filename: string) => void;
  onError?: (error: string) => void;
}

export const useExport = (options?: UseExportOptions) => {
  const [isExporting, setIsExporting] = useState(false);

  // Helper function to generate filename
  const generateFilename = (dataType: string, format: ExportFormat): string => {
    const timestamp = new Date().toISOString().split("T")[0];
    const extension = format === "excel" ? "xlsx" : format;
    return `${dataType}-${timestamp}.${extension}`;
  };

  const exportData = async (
    dataType: ExportDataType,
    format: ExportFormat,
    exportOptions: {
      dateRange?: { startDate: Date; endDate: Date };
      sections?: string[];
      includeCharts?: boolean;
      language?: string;
      [key: string]: any;
    } = {}
  ) => {
    try {
      setIsExporting(true);
      toast.info("Đang xuất dữ liệu...");

      let result: { blob: Blob; filename: string };

      switch (dataType) {
        case "analytics":
          result = await exportService.exportAnalyticsFromFrontend({
            format,
            dateRange: exportOptions.dateRange,
            sections: exportOptions.sections,
            includeCharts: exportOptions.includeCharts,
            language: exportOptions.language || "vi-VN",
          });
          break;

        case "users":
          const userRequest: UserExportRequest = {
            format: (format.charAt(0).toUpperCase() + format.slice(1)) as any,
            userTypes: exportOptions.userTypes,
            includeInactive: exportOptions.includeInactive,
            dateRange: exportOptions.dateRange
              ? {
                  startDate: exportOptions.dateRange.startDate.toISOString(),
                  endDate: exportOptions.dateRange.endDate.toISOString(),
                }
              : undefined,
            language: exportOptions.language || "vi-VN",
          };
          const userBlob = await exportService.exportUsers(userRequest);
          result = {
            blob: userBlob,
            filename: generateFilename("users", format),
          };
          break;

        case "events":
          const eventRequest: EventExportRequest = {
            format: (format.charAt(0).toUpperCase() + format.slice(1)) as any,
            organizationId: exportOptions.organizationId,
            eventStatus: exportOptions.eventStatus,
            dateRange: exportOptions.dateRange
              ? {
                  startDate: exportOptions.dateRange.startDate.toISOString(),
                  endDate: exportOptions.dateRange.endDate.toISOString(),
                }
              : undefined,
            language: exportOptions.language || "vi-VN",
          };
          const eventBlob = await exportService.exportEvents(eventRequest);
          result = {
            blob: eventBlob,
            filename: generateFilename("events", format),
          };
          break;

        case "registrations":
          const registrationRequest = {
            format: (format.charAt(0).toUpperCase() + format.slice(1)) as any,
            eventId: exportOptions.eventId,
            organizationId: exportOptions.organizationId,
            registrationStatus: exportOptions.registrationStatus,
            dateRange: exportOptions.dateRange
              ? {
                  startDate: exportOptions.dateRange.startDate.toISOString(),
                  endDate: exportOptions.dateRange.endDate.toISOString(),
                }
              : undefined,
            language: exportOptions.language || "vi-VN",
          };
          const registrationBlob = await exportService.exportEventRegistrations(
            registrationRequest
          );
          result = {
            blob: registrationBlob,
            filename: generateFilename("registrations", format),
          };
          break;

        case "organizations":
          const orgRequest = {
            format: (format.charAt(0).toUpperCase() + format.slice(1)) as any,
            includeInactive: exportOptions.includeInactive,
            verificationStatus: exportOptions.verificationStatus,
            language: exportOptions.language || "vi-VN",
          };
          const orgBlob = await exportService.exportOrganizations(orgRequest);
          result = {
            blob: orgBlob,
            filename: generateFilename("organizations", format),
          };
          break;

        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }

      exportService.downloadFile(result.blob, result.filename);

      const successMessage = `Xuất dữ liệu thành công! Tệp ${result.filename} đã được tải xuống.`;
      toast.success(successMessage);
      options?.onSuccess?.(result.filename);

      return result;
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể xuất dữ liệu. Vui lòng thử lại sau.";
      toast.error(errorMessage);
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportAnalytics = (
    format: ExportFormat,
    options: {
      dateRange?: { startDate: Date; endDate: Date };
      sections?: string[];
      includeCharts?: boolean;
      language?: string;
    } = {}
  ) => exportData("analytics", format, options);

  const exportUsers = (
    format: ExportFormat,
    options: {
      userTypes?: string[];
      includeInactive?: boolean;
      dateRange?: { startDate: Date; endDate: Date };
      language?: string;
    } = {}
  ) => exportData("users", format, options);

  const exportEvents = (
    format: ExportFormat,
    options: {
      organizationId?: number;
      eventStatus?: string[];
      dateRange?: { startDate: Date; endDate: Date };
      language?: string;
    } = {}
  ) => exportData("events", format, options);

  const exportEventRegistrations = (
    format: ExportFormat,
    options: {
      eventId?: number;
      organizationId?: number;
      registrationStatus?: string[];
      dateRange?: { startDate: Date; endDate: Date };
      language?: string;
    } = {}
  ) => exportData("registrations", format, options);

  const exportOrganizations = (
    format: ExportFormat,
    options: {
      includeInactive?: boolean;
      verificationStatus?: string[];
      language?: string;
    } = {}
  ) => exportData("organizations", format, options);

  return {
    isExporting,
    exportData,
    exportAnalytics,
    exportUsers,
    exportEvents,
    exportEventRegistrations,
    exportOrganizations,
  };
};
