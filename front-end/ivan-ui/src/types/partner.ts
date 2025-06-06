export interface Partner {
  id: string;
  name: string;
  description: string;
  type: PartnerType;
  contactInfo: PartnerContact;
  collaborationHistory: Collaboration[];
  donationHistory: Donation[];
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerContact {
  email: string;
  phone: string;
  address: string;
  website?: string;
  contactPerson: string;
  position: string;
}

export interface Collaboration {
  id: string;
  partnerId: string;
  organizationId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: CollaborationStatus;
  resources: Resource[];
}

export interface Donation {
  id: string;
  partnerId: string;
  organizationId?: string;
  amount?: number;
  currency?: string;
  type: DonationType;
  description: string;
  date: string;
  status: DonationStatus;
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  quantity: number;
  value?: number;
  unit: string;
}

export enum PartnerType {
  CORPORATE = "corporate",
  GOVERNMENT = "government",
  NGO = "ngo",
  FOUNDATION = "foundation",
  INDIVIDUAL = "individual",
}

export enum PartnerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum CollaborationStatus {
  PROPOSED = "proposed",
  APPROVED = "approved",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum DonationType {
  MONETARY = "monetary",
  IN_KIND = "in_kind",
  SERVICE = "service",
  EQUIPMENT = "equipment",
}

export enum DonationStatus {
  PLEDGED = "pledged",
  RECEIVED = "received",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

export enum ResourceType {
  EQUIPMENT = "equipment",
  MATERIAL = "material",
  SERVICE = "service",
  VENUE = "venue",
  TRANSPORTATION = "transportation",
}
