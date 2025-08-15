// Certificate Template Service - Matching backend CertificateTemplateController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CertificateTemplateViewModel,
  CertificateTemplateInputModel,
  CertificateTemplateFilterModel,
  CreateCertificateTemplateRequest,
} from "../types/certificate";

class CertificateTemplateService {
  private readonly baseUrl = "/CertificateTemplate";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === CERTIFICATE TEMPLATE OPERATIONS ===

  // GET /api/CertificateTemplate - Get Certificate Templates List
  async getCertificateTemplates(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    const response = await apiClient.get<
      PagedResultDto<CertificateTemplateViewModel>
    >(this.baseUrl, { pageNumber, pageSize });

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
      const pagedResult =
        extractedData as PagedResultDto<CertificateTemplateViewModel>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<CertificateTemplateViewModel>;
  }

  // GET /api/CertificateTemplate/get/{id} - Get Certificate Template by ID
  async getCertificateTemplateById(
    id: number
  ): Promise<CertificateTemplateViewModel> {
    const response = await apiClient.get<CertificateTemplateViewModel>(
      `${this.baseUrl}/get/${id}`
    );
    if (!response.data) {
      throw new Error("Certificate template not found");
    }
    return response.data;
  }

  // POST /api/CertificateTemplate/add - Create Certificate Template
  async createCertificateTemplate(
    templateData: CreateCertificateTemplateRequest
  ): Promise<CertificateTemplateViewModel> {
    const inputModel: CertificateTemplateInputModel = {
      templateName: templateData.templateName,
      description: templateData.description,
      templateType: templateData.templateType,
      templateDesign: templateData.templateDesign,
      requiredFields: templateData.requiredFields,
      organizationId: templateData.organizationId,
      isDefault: templateData.isDefault ?? false,
      isActive: templateData.isActive ?? true,
    };

    const response = await apiClient.post<CertificateTemplateViewModel>(
      `${this.baseUrl}/add`,
      inputModel
    );

    if (!response.data) {
      throw new Error("Failed to create certificate template");
    }

    return response.data;
  }

  // === UTILITY METHODS ===

  // Get Active Templates (commonly used for dropdowns)
  async getActiveTemplates(
    pageNumber: number = 1,
    pageSize: number = 100
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    // Note: The backend doesn't have a specific active templates endpoint,
    // so we get all templates and filter on the frontend or add filtering logic
    const allTemplates = await this.getCertificateTemplates(
      pageNumber,
      pageSize
    );

    // Filter active templates
    const activeTemplates = allTemplates.items.filter(
      (template) => template.isActive === true
    );

    return {
      ...allTemplates,
      items: activeTemplates,
      totalCount: activeTemplates.length,
    };
  }

  // Get Templates by Organization
  async getTemplatesByOrganization(
    organizationId: number,
    pageNumber: number = 1,
    pageSize: number = 100
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    const allTemplates = await this.getCertificateTemplates(
      pageNumber,
      pageSize
    );

    // Filter templates by organization
    const organizationTemplates = allTemplates.items.filter(
      (template) =>
        template.organizationId === organizationId ||
        template.isDefault === true
    );

    return {
      ...allTemplates,
      items: organizationTemplates,
      totalCount: organizationTemplates.length,
    };
  }

  // Get Default Templates
  async getDefaultTemplates(
    pageNumber: number = 1,
    pageSize: number = 100
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    const allTemplates = await this.getCertificateTemplates(
      pageNumber,
      pageSize
    );

    // Filter default templates
    const defaultTemplates = allTemplates.items.filter(
      (template) => template.isDefault === true
    );

    return {
      ...allTemplates,
      items: defaultTemplates,
      totalCount: defaultTemplates.length,
    };
  }

  // Validate template data before submission
  validateTemplateData(data: CreateCertificateTemplateRequest): string[] {
    const errors: string[] = [];

    if (!data.templateName?.trim()) {
      errors.push("Template name is required");
    }

    if (data.templateName && data.templateName.length > 255) {
      errors.push("Template name cannot exceed 255 characters");
    }

    if (data.description && data.description.length > 1000) {
      errors.push("Description cannot exceed 1000 characters");
    }

    if (data.organizationId && data.organizationId <= 0) {
      errors.push("Organization ID must be a positive number");
    }

    return errors;
  }

  // Parse required fields (if stored as JSON string)
  parseRequiredFields(requiredFields?: string): string[] {
    if (!requiredFields) return [];

    try {
      const parsed = JSON.parse(requiredFields);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, treat as comma-separated string
      return requiredFields
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0);
    }
  }

  // Format required fields for storage
  formatRequiredFields(fields: string[]): string {
    return JSON.stringify(fields);
  }

  // Get template types (enum-like values)
  getTemplateTypes(): { value: string; label: string }[] {
    return [
      { value: "Participation", label: "Participation Certificate" },
      { value: "Achievement", label: "Achievement Certificate" },
      { value: "Completion", label: "Completion Certificate" },
      { value: "Recognition", label: "Recognition Certificate" },
      { value: "Custom", label: "Custom Certificate" },
    ];
  }

  // Get common required fields options
  getCommonRequiredFields(): { value: string; label: string }[] {
    return [
      { value: "volunteerName", label: "Volunteer Name" },
      { value: "eventName", label: "Event Name" },
      { value: "organizationName", label: "Organization Name" },
      { value: "issueDate", label: "Issue Date" },
      { value: "expiryDate", label: "Expiry Date" },
      { value: "hoursCompleted", label: "Hours Completed" },
      { value: "performanceLevel", label: "Performance Level" },
      { value: "certificateNumber", label: "Certificate Number" },
      { value: "verificationCode", label: "Verification Code" },
      { value: "description", label: "Description" },
    ];
  }
}

export const certificateTemplateService = new CertificateTemplateService();
export default certificateTemplateService;
