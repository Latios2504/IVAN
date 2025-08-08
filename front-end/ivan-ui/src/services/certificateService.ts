import { apiClient } from "./apiClient";
import { API_ENDPOINTS, environment } from "@/config";
import type {
  Certificate,
  CertificateTemplate,
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CreateCertificateTemplateRequest,
  CertificateFilterRequest,
  BulkCertificateActionRequest,
  CertificateApprovalRequest,
  CertificateRejectionRequest,
  CertificateListResponse,
  CertificateTemplateListResponse,
  CertificateAnalytics,
} from "@/types/certificate";

class CertificateService {
  // Certificate CRUD Operations
  async getList(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<CertificateListResponse> {
    const response = await apiClient.get<CertificateListResponse>(
      `${API_ENDPOINTS.CERTIFICATES.LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getById(id: number): Promise<Certificate> {
    const response = await apiClient.get<Certificate>(
      API_ENDPOINTS.CERTIFICATES.BY_ID(id)
    );
    return response.data;
  }

  async getByOrganization(
    organizationId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<CertificateListResponse> {
    const response = await apiClient.get<CertificateListResponse>(
      `${API_ENDPOINTS.CERTIFICATES.BY_ORGANIZATION(
        organizationId
      )}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getFiltered(filter: CertificateFilterRequest): Promise<Certificate[]> {
    const response = await apiClient.post<Certificate[]>(
      API_ENDPOINTS.CERTIFICATES.FILTER,
      filter
    );
    return response.data;
  }

  async create(certificate: CreateCertificateRequest): Promise<Certificate> {
    const response = await apiClient.post<Certificate>(
      API_ENDPOINTS.CERTIFICATES.CREATE,
      certificate
    );
    return response.data;
  }

  async update(
    id: number,
    certificate: UpdateCertificateRequest
  ): Promise<Certificate> {
    const response = await apiClient.put<Certificate>(
      API_ENDPOINTS.CERTIFICATES.UPDATE(id),
      certificate
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CERTIFICATES.DELETE(id));
  }

  // Approval Workflow
  async approve(approval: CertificateApprovalRequest): Promise<Certificate> {
    const response = await apiClient.put<Certificate>(
      API_ENDPOINTS.CERTIFICATES.APPROVE(approval.certificateId),
      approval
    );
    return response.data;
  }

  async reject(rejection: CertificateRejectionRequest): Promise<Certificate> {
    const response = await apiClient.put<Certificate>(
      API_ENDPOINTS.CERTIFICATES.REJECT(rejection.certificateId),
      rejection
    );
    return response.data;
  }

  // Bulk Operations
  async bulkApprove(
    bulkAction: BulkCertificateActionRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.CERTIFICATES.BULK_APPROVE,
      bulkAction
    );
    return response.data;
  }

  async bulkRevoke(
    bulkAction: BulkCertificateActionRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.CERTIFICATES.BULK_REVOKE,
      bulkAction
    );
    return response.data;
  }

  // Download Operations
  async download(id: number): Promise<Blob> {
    const response = await fetch(
      `${environment.API_BASE_URL}${API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download certificate: ${response.statusText}`);
    }

    return response.blob();
  }

  async downloadAsFile(id: number, filename?: string): Promise<void> {
    try {
      const blob = await this.download(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `certificate_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      throw error;
    }
  }

  // Analytics (future implementation)
  async getAnalytics(organizationId?: number): Promise<CertificateAnalytics> {
    // This would be implemented when analytics endpoints are available
    const params = organizationId ? `?organizationId=${organizationId}` : "";
    const response = await apiClient.get<CertificateAnalytics>(
      `/certificate/analytics${params}`
    );
    return response.data;
  }
}

class CertificateTemplateService {
  // Certificate Template CRUD Operations
  async getList(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<CertificateTemplateListResponse> {
    const response = await apiClient.get<CertificateTemplateListResponse>(
      `${API_ENDPOINTS.CERTIFICATE_TEMPLATES.LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getById(id: number): Promise<CertificateTemplate> {
    const response = await apiClient.get<CertificateTemplate>(
      API_ENDPOINTS.CERTIFICATE_TEMPLATES.BY_ID(id)
    );
    return response.data;
  }

  async getByOrganization(
    organizationId: number
  ): Promise<CertificateTemplate[]> {
    const response = await apiClient.get<CertificateTemplate[]>(
      `${API_ENDPOINTS.CERTIFICATE_TEMPLATES.LIST}?organizationId=${organizationId}`
    );
    return response.data;
  }

  async create(
    template: CreateCertificateTemplateRequest
  ): Promise<CertificateTemplate> {
    const response = await apiClient.post<CertificateTemplate>(
      API_ENDPOINTS.CERTIFICATE_TEMPLATES.CREATE,
      template
    );
    return response.data;
  }

  async update(
    id: number,
    template: Partial<CreateCertificateTemplateRequest>
  ): Promise<CertificateTemplate> {
    const response = await apiClient.put<CertificateTemplate>(
      API_ENDPOINTS.CERTIFICATE_TEMPLATES.UPDATE(id),
      template
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CERTIFICATE_TEMPLATES.DELETE(id));
  }

  // Template Preview (future implementation)
  async preview(id: number, data: Record<string, any>): Promise<Blob> {
    const response = await fetch(
      `${environment.API_BASE_URL}/certificatetemplate/preview/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to preview template: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Create service instances
export const certificateService = new CertificateService();
export const certificateTemplateService = new CertificateTemplateService();

// Export service classes for testing or extending
export { CertificateService, CertificateTemplateService };
