// Certificate Types - Matching backend Certificate DTOs and Models
// Updated to match backend DTOs exactly - DateTime fields handled as strings in frontend
// HoursCompleted as number (decimal from backend converted to number)

// Base Certificate interfaces matching backend DTOs
export interface CertificateViewModel {
  certificateId: number;
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateNumber: string;
  certificateName: string;
  description?: string;
  hoursCompleted?: number; // decimal? in backend -> number? in frontend
  performanceLevel?: string;
  issueDate?: string; // DateTime? in backend -> string? in frontend
  expiryDate?: string; // DateTime? in backend -> string? in frontend
  certificateFileUrl?: string;
  digitalSignature?: string;
  verificationCode: string;
  qrcodeUrl?: string;
  issuedBy?: number;
  status?: string;
  downloadCount?: number;
  lastDownloadDate?: string; // DateTime? in backend -> string? in frontend
  createdAt?: string; // DateTime? in backend -> string? in frontend
}

export interface CertificateInputModel {
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateNumber: string;
  certificateName: string;
  description?: string;
  hoursCompleted?: number; // decimal? in backend -> number? in frontend
  performanceLevel?: string;
  certificateFileUrl?: string;
  digitalSignature?: string;
  verificationCode: string;
  qrcodeUrl?: string;
}

export interface CertificateUpdateModel {
  certificateId: number; // [Required] in backend
  certificateName?: string;
  description?: string;
  performanceLevel?: string;
  expiryDate?: string; // DateTime? in backend -> string? in frontend
  status?: string;
  hoursCompleted?: number; // decimal? in backend -> number? in frontend
}

export interface CertificateFilterModel {
  pageNumber: number; // default 1 in backend
  pageSize: number; // default 10 in backend
  organizationId?: number;
  status?: string;
  volunteerId?: number;
  eventId?: number;
  searchTerm?: string;
  issuedDateFrom?: string; // DateTime? in backend -> string? in frontend
  issuedDateTo?: string; // DateTime? in backend -> string? in frontend
}

// Bulk action models
export interface BulkCertificateActionModel {
  certificateIds: number[];
  reason?: string;
  approvedBy?: number;
}

export interface CertificateApprovalModel {
  certificateId: number; // [Required] in backend, but controller handles null/0 cases
  approvalNotes?: string;
  approvedBy?: number; // Set by backend from JWT, not from frontend
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
