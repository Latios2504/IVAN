// Task Management Types
export interface Task {
  id: string;
  title: string;
  description: string;
  coordinatorName: string;
  eventName: string;
  location: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "overdue" | "cancelled";
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  volunteers: number;
  actualHours: number;
  estimatedHours: number;
  notes?: string;
}

// Partner Collaboration Types
export interface Partner {
  id: string;
  name: string;
  logo?: string;
  type: "corporate" | "ngo" | "education" | "government";
  status: "active" | "pending" | "inactive" | "suspended";
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  establishedDate: string;
  collaborationHistory: number;
  currentProjects: number;
  totalContribution: number;
  rating: number;
  strengths?: string[];
  notes?: string;
}

export interface Collaboration {
  id: string;
  title: string;
  partnerName: string;
  projectName: string;
  status: "planning" | "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  budget: number;
  volunteers: number;
  beneficiaries: number;
  description: string;
  progress: number;
}

// Notification Management Types
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "recruitment" | "event" | "reminder" | "announcement" | "alert";
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "scheduled" | "sent" | "failed";
  targetAudience: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  channels: string[];
  scheduledTime: string | null;
  sentTime?: string;
  createdBy: string;
  tags: string[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables: string[];
  lastUsed: string;
  usageCount: number;
}

// Coordinator Schedule Types
export interface Shift {
  id: string;
  coordinatorName: string;
  eventName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  volunteers: number;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "shift" | "meeting" | "training";
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}
