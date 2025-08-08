export interface CollaborationViewList {
  collaborationId: number;
  organizationId: number;
  organizationName: string;
  partnerId: number;
  partnerName: string;
  typeId: number;
  typeName: string;
  collaborationName: string;
  startDate: string;
  endDate?: string;
  status?: string;
  budget?: number;
  currency?: string;
}

export interface CollaborationDetailDto extends CollaborationViewList {
  description?: string;
  objectives?: string;
  contractDocumentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerCollaborationCreateDto {
  organizationId: number;
  partnerId: number;
  typeId: number;
  collaborationName: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate?: string;
  status?: string;
  budget?: number;
  currency?: string;
  contractDocumentUrl?: string;
}

export interface PartnerCollaborationUpdateDto {
  collaborationId: number;
  collaborationName: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate?: string;
  status?: string;
  budget?: number;
  currency?: string;
  contractDocumentUrl?: string;
}

export interface CollaborationType {
  typeId: number;
  typeName: string;
  description?: string;
  isActive?: boolean;
}

export interface Partner {
  partnerId: number;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  industry?: string;
}
