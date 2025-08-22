export interface RegistrationRequestDTO {
  additionalInfo: string;
  motivationLetter: string;
}

export interface RegistrationDTO {
  registrationId: number;
  eventId: number;
  volunteerId: number;
  statusName: string;
  applicationDate?: Date;
  fullName?: string;
  additionalInfo?: string;
  motivationLetter?: string;
}

export interface RegistrationStatusDTO {
  registrationId: number;
  eventId: number;
  volunteerId: number;
  statusName: string;
  statusColor?: string;
}

export interface ApproveRegistrationRequestDTO {
  notes?: string;
}

export interface RejectRegistrationRequestDTO {
  reason: string;
}

export interface EventDTO {
  eventId: number;
  eventName: string;
  description: string;
  shortDescription: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate?: Date;
  registrationEndDate?: Date;
  location: string;
  categoryName: string;
  statusName: string;
}

export interface CheckInRequestDTO {
  notes?: string;
  location?: string;
}

export interface CheckOutRequestDTO {
  notes?: string;
  feedback?: string;
}

export interface AttendanceDTO {
  registrationId: number;
  eventId: number;
  volunteerId: number;
  volunteerName?: string;
  attendanceStatus: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  actualHours?: number;
  statusName: string;
}

export interface RegistrationFilters {
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Status constants
export const REGISTRATION_STATUSES = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  CANCELLED: "Đã hủy",
} as const;

export type RegistrationStatus =
  (typeof REGISTRATION_STATUSES)[keyof typeof REGISTRATION_STATUSES];

// Additional types that might be referenced in EventRegistrationPage
export interface EventSummary {
  eventId: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  statusName?: string;
}

export interface Registration extends RegistrationDTO {
  // Extended registration interface if needed
}

export interface ApproveRegistrationRequest
  extends ApproveRegistrationRequestDTO {
  // Extended approve request interface if needed
}

export interface RejectRegistrationRequest
  extends RejectRegistrationRequestDTO {
  // Extended reject request interface if needed
}

// Type alias for compatibility
export type RegistrationFilterType = RegistrationFilters;
