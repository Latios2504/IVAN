// Certificate Management Types
export interface Certificate {
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

export interface CertificateTemplate {
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

// Request DTOs
export interface CreateCertificateRequest {
  volunteerId: number;
  eventId: number;
  templateId: number;
  certificateNumber: string;
  certificateName: string;
  description?: string;
  performanceLevel?: string;
  certificateFileUrl?: string;
  digitalSignature?: string;
  verificationCode: string;
  qrcodeUrl?: string;
}

export interface UpdateCertificateRequest {
  certificateId: number;
  certificateName?: string;
  description?: string;
  performanceLevel?: string;
  expiryDate?: string;
  status?: string;
  hoursCompleted?: number;
}

export interface CreateCertificateTemplateRequest {
  templateName: string;
  description?: string;
  templateType?: string;
  templateDesign?: string;
  requiredFields?: string;
  organizationId?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface CertificateFilterRequest {
  pageNumber?: number;
  pageSize?: number;
  organizationId?: number;
  status?: string;
  volunteerId?: number;
  eventId?: number;
  searchTerm?: string;
  issuedDateFrom?: string;
  issuedDateTo?: string;
}

// Bulk Operations
export interface BulkCertificateActionRequest {
  certificateIds: number[];
  reason?: string;
  approvedBy?: number;
}

export interface CertificateApprovalRequest {
  certificateId: number;
  approvalNotes?: string;
  approvedBy?: number;
}

export interface CertificateRejectionRequest {
  certificateId: number;
  rejectionReason: string;
  rejectedBy?: number;
}

// Response DTOs
export interface CertificateListResponse {
  items: Certificate[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CertificateTemplateListResponse {
  items: CertificateTemplate[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Certificate Status Enum
export enum CertificateStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  ISSUED = "issued",
  REJECTED = "rejected",
  REVOKED = "revoked",
  EXPIRED = "expired",
}

// Template Type Enum
export enum CertificateTemplateType {
  ACHIEVEMENT = "achievement",
  PARTICIPATION = "participation",
  COMPLETION = "completion",
  TRAINING = "training",
  CUSTOM = "custom",
}

// Performance Level Enum
export enum PerformanceLevel {
  EXCELLENT = "excellent",
  GOOD = "good",
  SATISFACTORY = "satisfactory",
  NEEDS_IMPROVEMENT = "needs_improvement",
}

// Certificate Analytics
export interface CertificateAnalytics {
  totalCertificates: number;
  issuedCertificates: number;
  pendingCertificates: number;
  revokedCertificates: number;
  totalDownloads: number;
  certificatesByStatus: Record<string, number>;
  certificatesByMonth: Record<string, number>;
  topVolunteers: Array<{
    volunteerId: number;
    volunteerName: string;
    certificateCount: number;
  }>;
}

// Validation Schemas (using Zod-like structure for reference)
export interface CertificateValidationErrors {
  certificateName?: string[];
  certificateNumber?: string[];
  volunteerId?: string[];
  eventId?: string[];
  templateId?: string[];
  verificationCode?: string[];
  general?: string[];
}

// UI State Types
export interface CertificateUIState {
  selectedCertificates: number[];
  isLoading: boolean;
  error: string | null;
  filters: CertificateFilterRequest;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Form State Types
export interface CertificateFormState {
  isSubmitting: boolean;
  errors: CertificateValidationErrors;
  isDirty: boolean;
}

// Certificate Template Request Types
export interface UpdateCertificateTemplateRequest {
  templateName?: string;
  templateContent?: string;
  isActive?: boolean;
  fields?: CertificateTemplateField[];
  sampleData?: Record<string, any>;
  designSettings?: CertificateDesignSettings;
  notes?: string;
}

export interface CertificateTemplateField {
  fieldName: string;
  fieldType: "text" | "number" | "date" | "boolean";
  isRequired: boolean;
  placeholder?: string;
  validation?: string;
}

export interface CertificateDesignSettings {
  pageSize?: string;
  orientation?: "portrait" | "landscape";
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fonts?: {
    primary: string;
    secondary: string;
  };
  colors?: {
    primary: string;
    secondary: string;
    text: string;
  };
}
