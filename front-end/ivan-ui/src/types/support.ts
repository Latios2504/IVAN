// Support Request Management Types for IVAN

export interface SupportCategory {
  categoryId: number;
  categoryName: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  expectedResponseTime?: number; // in hours
  isActive?: boolean;
  createdAt?: string;
}

export interface SupportRequest {
  requestId: number;
  userId: number;
  categoryId: number;
  subject: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Cancelled';
  assignedTo?: number;
  assignedDate?: string;
  resolution?: string;
  resolvedBy?: number;
  resolvedDate?: string;
  satisfactionRating?: number; // 1-5
  satisfactionFeedback?: string;
  attachmentUrls?: string; // JSON array
  createdAt?: string;
  updatedAt?: string;
  
  // Navigation properties
  category?: SupportCategory;
  user?: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
  };
  assignedToUser?: {
    userId: number;
    email: string;
    fullName: string;
  };
  resolvedByUser?: {
    userId: number;
    email: string;
    fullName: string;
  };
  comments?: SupportRequestComment[];
}

export interface SupportRequestComment {
  commentId: number;
  requestId: number;
  userId: number;
  comment: string;
  isInternal?: boolean;
  attachmentUrls?: string; // JSON array
  createdAt?: string;
  
  // Navigation properties
  user?: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface CreateSupportRequestData {
  categoryId: number;
  subject: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High';
  attachmentUrls?: string[];
}

export interface UpdateSupportRequestData {
  subject?: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Cancelled';
  assignedTo?: number;
  resolution?: string;
  attachmentUrls?: string[];
}

export interface AddCommentData {
  comment: string;
  isInternal?: boolean;
  attachmentUrls?: string[];
}

export interface SupportRequestFilters {
  status?: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  userId?: string;
  searchTerm?: string;
  dateRange?: string;
}

export interface SupportRequestStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResolutionTime?: number; // in hours
  satisfactionScore?: number; // average rating
}
