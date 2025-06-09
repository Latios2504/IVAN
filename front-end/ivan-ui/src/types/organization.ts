export type EventStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "planning"
  | "cancelled";
export type VolunteerApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "waitlisted";

export interface EventVolunteerInfo {
  registered: number;
  confirmed: number;
  max: number;
  needed?: number; // Number of volunteers still needed
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Giáo dục", "Y tế", "Môi trường", "Cộng đồng"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm - HH:mm
  location: string;
  status: EventStatus;
  volunteers: EventVolunteerInfo;
  coordinator?: string; // Name or ID of the coordinator
  organizationId: string; // ID of the organization hosting the event
  imageUrl?: string;
  registrationDeadline?: string; // YYYY-MM-DD
  tasks?: string[]; // List of tasks for volunteers
  requirements?: string[]; // Requirements for volunteers
  createdDate: string; // YYYY-MM-DD
  updatedAt?: string; // YYYY-MM-DD
}

export interface OrganizationVolunteer {
  id: string;
  userId: string; // Reference to the main User ID
  fullName: string;
  email: string;
  phoneNumber?: string;
  applicationDate: string; // YYYY-MM-DD
  status: VolunteerApplicationStatus;
  assignedEventId?: string;
  assignedEventTitle?: string;
  skills?: string[];
  motivationLetter?: string; // For applications
  notes?: string; // Internal notes by organization
}

export interface Certificate {
  id: string;
  volunteerId: string;
  volunteerName: string;
  eventId: string;
  eventName: string;
  issueDate: string; // YYYY-MM-DD
  description?: string; // e.g., "Hoàn thành xuất sắc 20 giờ tình nguyện"
  certificateUrl?: string; // Link to the PDF or image (simulated)
  issuedBy: string; // Organization name or ID
}

// Form data types for dialogs
export interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: EventStatus;
  maxVolunteers: number;
  registrationDeadline?: string;
  tasks?: string; // Comma-separated or to be parsed
  requirements?: string; // Comma-separated or to be parsed
}

export interface VolunteerApplicationUpdateData {
  status: VolunteerApplicationStatus;
  notes?: string;
  assignedEventId?: string;
}

export interface CertificateFormData {
  volunteerId: string;
  eventId: string;
  description?: string;
}
