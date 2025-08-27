// Certificate Types - Matching backend Certificate DTOs and Models
// Updated to match backend DTOs exactly - DateTime fields handled as strings in frontend
// HoursCompleted kept as number (decimal from backend will be converted)

// Base Certificate interfaces matching backend DTOs
export interface CertificateViewModel {
  certificateId: number;
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateNumber: string;
  certificateName: string;
  description?: string;
  hoursCompleted?: number;
  performanceLevel?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateFileUrl?: string;
  digitalSignature?: string;
  verificationCode: string;
  qrcodeUrl?: string;
  issuedBy?: number;
  status?: string;
  downloadCount?: number;
  lastDownloadDate?: string;
  createdAt?: string;
}

export interface CertificateInputModel {
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateNumber: string;
  certificateName: string;
  description?: string;
  hoursCompleted?: number;
  performanceLevel?: string;
  certificateFileUrl?: string;
  digitalSignature?: string;
  verificationCode: string;
  qrcodeUrl?: string;
}

export interface CertificateUpdateModel {
  certificateId: number;
  certificateName?: string;
  description?: string;
  performanceLevel?: string;
  expiryDate?: string;
  status?: string;
  hoursCompleted?: number;
}

export interface CertificateFilterModel {
  pageNumber: number;
  pageSize: number;
  organizationId?: number;
  status?: string;
  volunteerId?: number;
  eventId?: number;
  searchTerm?: string;
  issuedDateFrom?: string;
  issuedDateTo?: string;
}

// Bulk action models
export interface BulkCertificateActionModel {
  certificateIds: number[];
  reason?: string;
  approvedBy?: number;
}

export interface CertificateApprovalModel {
  certificateId: number;
  approvalNotes?: string;
  approvedBy?: number;
}

export interface CertificateRejectionModel {
  certificateId: number;
  rejectionReason: string;
  rejectedBy?: number;
}

// Certificate Template interfaces
export interface CertificateTemplateViewModel {
  templateId: number;
  templateName: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  organizationId?: number;
  isDefault?: boolean;
  isActive?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateTemplateInputModel {
  templateName: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface CertificateTemplateUpdateModel {
  templateId: number;
  templateName: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  organizationId?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface CertificateTemplateFilterModel {
  pageNumber: number;
  pageSize: number;
  organizationId?: number;
  searchTerm?: string;
}

// Create request interfaces for frontend forms
export interface CreateCertificateRequest {
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateName: string;
  description?: string;
  hoursCompleted?: number;
  performanceLevel?: string;
  expiryDate?: string;
}

export interface CreateCertificateTemplateRequest {
  templateName: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateCertificateTemplateRequest {
  templateName?: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

// Response interfaces for specific operations
export interface CertificateDownloadResponse {
  fileContent: Blob;
  fileName: string;
}

// Status enums for type safety
export enum CertificateStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  REVOKED = "Revoked",
}

export enum TemplateType {
  PARTICIPATION = "Participation",
  ACHIEVEMENT = "Achievement",
  COMPLETION = "Completion",
  RECOGNITION = "Recognition",
}
