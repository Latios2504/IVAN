// Certificate Template Service - Matching backend CertificateTemplateController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CertificateTemplateViewModel,
  CertificateTemplateInputModel,
  CertificateTemplateUpdateModel,
  CertificateTemplateFilterModel,
  CreateCertificateTemplateRequest,
  UpdateCertificateTemplateRequest,
} from "../types/certificate";

class CertificateTemplateService {
  private readonly baseUrl = "/CertificateTemplate";

  // === CERTIFICATE TEMPLATE OPERATIONS ===

  // GET /api/CertificateTemplate - Get Certificate Templates List
  async getCertificateTemplates(
    pageNumber: number = 1,
    pageSize: number = 12
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    const response = await apiClient.get<
      PagedResultDto<CertificateTemplateViewModel>
    >(this.baseUrl, { pageNumber, pageSize });

    if (!response.data || !response.success) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: pageSize,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

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
    if (!response.data || !response.success) {
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
      // organizationId: undefined, // Let backend auto-detect from authenticated user
      isDefault: templateData.isDefault ?? false,
      isActive: templateData.isActive ?? true,
    };

    const response = await apiClient.post<CertificateTemplateViewModel>(
      `${this.baseUrl}/add`,
      inputModel
    );

    if (!response.data || !response.success) {
      throw new Error(
        response.message || "Failed to create certificate template"
      );
    }

    return response.data;
  }

  // POST /api/CertificateTemplate/filter - Get Filtered Certificates (Organization-specific)
  async getFilteredCertificateTemplates(
    filter: Partial<CertificateTemplateFilterModel> & { pageNumber?: number; pageSize?: number }
  ): Promise<PagedResultDto<CertificateTemplateViewModel>> {
    // Ensure required fields have default values
    const completeFilter: CertificateTemplateFilterModel = {
      pageNumber: filter.pageNumber || 1,
      pageSize: filter.pageSize || 10,
      organizationId: filter.organizationId,
      searchTerm: filter.searchTerm
    };
    
    const response = await apiClient.post<
      PagedResultDto<CertificateTemplateViewModel>
    >(`${this.baseUrl}/filter`, completeFilter);

    if (!response.data || !response.success) {
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
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

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

  // PUT /api/CertificateTemplate/update/{id} - Update Certificate Template
  async updateCertificateTemplate(
    templateId: number,
    updateData: UpdateCertificateTemplateRequest
  ): Promise<CertificateTemplateViewModel> {
    // First get the current template to merge with updates
    const currentTemplate = await this.getCertificateTemplateById(templateId);

    const updateModel: CertificateTemplateUpdateModel = {
      templateId: templateId,
      templateName: updateData.templateName ?? currentTemplate.templateName,
      description: updateData.description ?? currentTemplate.description,
      templateType: updateData.templateType ?? currentTemplate.templateType,
      templateDesign:
        updateData.templateDesign ?? currentTemplate.templateDesign,
      requiredFields:
        updateData.requiredFields ?? currentTemplate.requiredFields,
      organizationId: currentTemplate.organizationId,
      isDefault: updateData.isDefault ?? currentTemplate.isDefault,
      isActive: updateData.isActive ?? currentTemplate.isActive,
    };

    const response = await apiClient.put<CertificateTemplateViewModel>(
      `${this.baseUrl}/update/${templateId}`,
      updateModel
    );

    if (!response.data || !response.success) {
      throw new Error(
        response.message || "Failed to update certificate template"
      );
    }

    return response.data;
  }

  // DELETE /api/CertificateTemplate/delete/{id} - Delete Certificate Template
  async deleteCertificateTemplate(templateId: number): Promise<boolean> {
    const response = await apiClient.delete<{ deletedId: number }>(
      `${this.baseUrl}/delete/${templateId}`
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to delete certificate template"
      );
    }

    return true;
  }

  // === UTILITY METHODS ===

  // Soft delete helper (uses existing update endpoint)
  async deactivateTemplate(
    templateId: number
  ): Promise<CertificateTemplateViewModel> {
    return this.updateCertificateTemplate(templateId, { isActive: false });
  }

  // Reactivate template helper (uses existing update endpoint)
  async activateTemplate(
    templateId: number
  ): Promise<CertificateTemplateViewModel> {
    return this.updateCertificateTemplate(templateId, { isActive: true });
  }

  // Duplicate template helper (uses existing get and create endpoints)
  async duplicateTemplate(
    templateId: number,
    newName?: string
  ): Promise<CertificateTemplateViewModel> {
    const originalTemplate = await this.getCertificateTemplateById(templateId);

    const duplicateData: CreateCertificateTemplateRequest = {
      templateName: newName || `${originalTemplate.templateName} (Copy)`,
      description: originalTemplate.description,
      templateType: originalTemplate.templateType,
      templateDesign: originalTemplate.templateDesign,
      requiredFields: originalTemplate.requiredFields,
      isDefault: false, // Copies should not be default
      isActive: true,
    };

    return this.createCertificateTemplate(duplicateData);
  }
}

export const certificateTemplateService = new CertificateTemplateService();
export default certificateTemplateService;
