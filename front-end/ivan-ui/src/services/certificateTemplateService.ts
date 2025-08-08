import { api } from "@/config";
import type {
  CertificateTemplate,
  CertificateTemplateListResponse,
  CreateCertificateTemplateRequest,
  UpdateCertificateTemplateRequest,
} from "@/types/certificate";

export const certificateTemplateService = {
  // Get list of certificate templates
  async getList(
    page: number = 1,
    pageSize: number = 10
  ): Promise<CertificateTemplateListResponse> {
    const response = await fetch(
      `${api.certificateTemplate.list}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header when authentication is implemented
          // "Authorization": `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch certificate templates: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Get single certificate template by ID
  async getById(id: number): Promise<CertificateTemplate> {
    const response = await fetch(`${api.certificateTemplate.getById(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch certificate template: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Create new certificate template
  async create(
    data: CreateCertificateTemplateRequest
  ): Promise<CertificateTemplate> {
    const response = await fetch(api.certificateTemplate.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create certificate template: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Update certificate template
  async update(
    id: number,
    data: UpdateCertificateTemplateRequest
  ): Promise<CertificateTemplate> {
    const response = await fetch(`${api.certificateTemplate.update(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update certificate template: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Delete certificate template
  async delete(id: number): Promise<void> {
    const response = await fetch(`${api.certificateTemplate.delete(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete certificate template: ${response.statusText}`
      );
    }
  },

  // Get template preview
  async getPreview(id: number): Promise<Blob> {
    const response = await fetch(`${api.certificateTemplate.preview(id)}`, {
      method: "GET",
      headers: {
        // "Authorization": `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get template preview: ${response.statusText}`);
    }

    return response.blob();
  },

  // Download template preview as file
  async downloadPreview(id: number, filename?: string): Promise<void> {
    const blob = await this.getPreview(id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `template_preview_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get organization templates
  async getByOrganization(
    organizationId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CertificateTemplateListResponse> {
    const response = await fetch(
      `${api.certificateTemplate.getByOrganization(
        organizationId
      )}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch organization templates: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Get active templates only
  async getActive(
    page: number = 1,
    pageSize: number = 10
  ): Promise<CertificateTemplateListResponse> {
    const response = await fetch(
      `${api.certificateTemplate.list}?isActive=true&page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch active templates: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Toggle template active status
  async toggleActive(id: number): Promise<CertificateTemplate> {
    const response = await fetch(
      `${api.certificateTemplate.toggleActive(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle template status: ${response.statusText}`
      );
    }

    return response.json();
  },
};
