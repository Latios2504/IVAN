// Certificate Service - Matching backend CertificateController
import { apiClient } from "./apiClient";
import type { PagedResultDto, ApiResponse } from "../types/common";
import type {
  CertificateViewModel,
  CertificateInputModel,
  CertificateUpdateModel,
  CertificateFilterModel,
  CertificateApprovalModel,
  CertificateRejectionModel,
  BulkCertificateActionModel,
  CreateCertificateRequest,
  CertificateDownloadResponse,
} from "../types/certificate";

class CertificateService {
  private readonly baseUrl = "/Certificate";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === CERTIFICATE CRUD OPERATIONS ===

  // GET /api/Certificate - Get Certificates List
  async getCertificates(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<CertificateViewModel>> {
    const response = await apiClient.get<PagedResultDto<CertificateViewModel>>(
      this.baseUrl,
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

    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<CertificateViewModel>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<CertificateViewModel>;
  }

  // GET /api/Certificate/by-organization/{organizationId} - Get Certificates by Organization
  async getCertificatesByOrganization(
    organizationId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<CertificateViewModel>> {
    const response = await apiClient.get<PagedResultDto<CertificateViewModel>>(
      `${this.baseUrl}/by-organization/${organizationId}`,
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

    const extractedData = this.extractDataFromNetResponse(response.data);

    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<CertificateViewModel>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<CertificateViewModel>;
  }

  // POST /api/Certificate/filter - Get Filtered Certificates
  async getFilteredCertificates(
    filter: CertificateFilterModel
  ): Promise<CertificateViewModel[]> {
    const response = await apiClient.post<CertificateViewModel[]>(
      `${this.baseUrl}/filter`,
      filter
    );

    if (!response.data) {
      return [];
    }

    const extractedData = this.extractDataFromNetResponse(response.data);
    return Array.isArray(extractedData) ? extractedData : [];
  }

  // GET /api/Certificate/get/{id} - Get Certificate by ID
  async getCertificateById(id: number): Promise<CertificateViewModel> {
    const response = await apiClient.get<CertificateViewModel>(
      `${this.baseUrl}/get/${id}`
    );
    if (!response.data) {
      throw new Error("Certificate not found");
    }
    return response.data;
  }

  // POST /api/Certificate/add - Create Certificate
  async createCertificate(
    certificateData: CreateCertificateRequest
  ): Promise<CertificateViewModel> {
    // Generate certificate number and verification code
    const timestamp = Date.now();
    const certificateNumber = `CERT-${timestamp}`;
    const verificationCode = `VERIFY-${timestamp}`;

    const inputModel: CertificateInputModel = {
      volunteerId: certificateData.volunteerId,
      eventId: certificateData.eventId,
      templateId: certificateData.templateId,
      certificateNumber,
      certificateName: certificateData.certificateName,
      description: certificateData.description,
      hoursCompleted: certificateData.hoursCompleted,
      performanceLevel: certificateData.performanceLevel,
      verificationCode,
    };

    const response = await apiClient.post<CertificateViewModel>(
      `${this.baseUrl}/add`,
      inputModel
    );

    if (!response.data) {
      throw new Error("Failed to create certificate");
    }

    return response.data;
  }

  // PUT /api/Certificate/update/{id} - Update Certificate
  async updateCertificate(
    id: number,
    updateData: Partial<CertificateUpdateModel>
  ): Promise<CertificateViewModel> {
    const updateModel: CertificateUpdateModel = {
      certificateId: id,
      ...updateData,
    };

    const response = await apiClient.put<CertificateViewModel>(
      `${this.baseUrl}/update/${id}`,
      updateModel
    );

    if (!response.data) {
      throw new Error("Failed to update certificate");
    }

    return response.data;
  }

  // DELETE /api/Certificate/delete/{id} - Delete Certificate
  async deleteCertificate(id: number): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    if (!response.success) {
      throw new Error("Failed to delete certificate");
    }
  }

  // === APPROVAL WORKFLOW ===

  // PUT /api/Certificate/approve/{id} - Approve Certificate
  async approveCertificate(
    approvalData: CertificateApprovalModel
  ): Promise<CertificateViewModel> {
    const response = await apiClient.put<CertificateViewModel>(
      `${this.baseUrl}/approve/${approvalData.certificateId}`,
      approvalData
    );

    if (!response.data) {
      throw new Error("Failed to approve certificate");
    }

    return response.data;
  }

  // PUT /api/Certificate/reject/{id} - Reject Certificate
  async rejectCertificate(
    rejectionData: CertificateRejectionModel
  ): Promise<CertificateViewModel> {
    const response = await apiClient.put<CertificateViewModel>(
      `${this.baseUrl}/reject/${rejectionData.certificateId}`,
      rejectionData
    );

    if (!response.data) {
      throw new Error("Failed to reject certificate");
    }

    return response.data;
  }

  // === BULK OPERATIONS ===

  // POST /api/Certificate/bulk-approve - Bulk Approve Certificates
  async bulkApproveCertificates(
    bulkData: BulkCertificateActionModel
  ): Promise<void> {
    const response = await apiClient.post(
      `${this.baseUrl}/bulk-approve`,
      bulkData
    );
    if (!response.success) {
      throw new Error("Failed to bulk approve certificates");
    }
  }

  // POST /api/Certificate/bulk-revoke - Bulk Revoke Certificates
  async bulkRevokeCertificates(
    bulkData: BulkCertificateActionModel
  ): Promise<void> {
    const response = await apiClient.post(
      `${this.baseUrl}/bulk-revoke`,
      bulkData
    );
    if (!response.success) {
      throw new Error("Failed to bulk revoke certificates");
    }
  }

  // === DOWNLOAD FUNCTIONALITY ===

  // GET /api/Certificate/download/{id} - Download Certificate PDF
  async downloadCertificate(id: number): Promise<CertificateDownloadResponse> {
    try {
      // Get certificate details first to generate filename
      const certificate = await this.getCertificateById(id);

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5283/api";
      const response = await fetch(
        `${API_BASE_URL}/Certificate/download/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to download certificate: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const fileName = `certificate_${certificate.certificateNumber || id}.pdf`;

      return {
        fileContent: blob,
        fileName,
      };
    } catch (error) {
      console.error("Error downloading certificate:", error);
      throw new Error("Failed to download certificate");
    }
  }

  // Helper method to trigger file download in browser
  async downloadCertificateFile(id: number): Promise<void> {
    const downloadData = await this.downloadCertificate(id);

    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(downloadData.fileContent);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // === UTILITY METHODS ===

  // Generate certificate number (can be used before creation)
  generateCertificateNumber(): string {
    const timestamp = Date.now();
    return `CERT-${timestamp}`;
  }

  // Generate verification code (can be used before creation)
  generateVerificationCode(): string {
    const timestamp = Date.now();
    return `VERIFY-${timestamp}`;
  }

  // Validate certificate data before submission
  validateCertificateData(data: CreateCertificateRequest): string[] {
    const errors: string[] = [];

    if (!data.certificateName?.trim()) {
      errors.push("Certificate name is required");
    }

    if (!data.volunteerId || data.volunteerId <= 0) {
      errors.push("Valid volunteer ID is required");
    }

    if (!data.eventId || data.eventId <= 0) {
      errors.push("Valid event ID is required");
    }

    if (!data.templateId || data.templateId <= 0) {
      errors.push("Valid template ID is required");
    }

    if (data.hoursCompleted && data.hoursCompleted < 0) {
      errors.push("Hours completed cannot be negative");
    }

    return errors;
  }
}

export const certificateService = new CertificateService();
export default certificateService;
