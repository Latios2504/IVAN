// Notification Service - Matching backend NotificationController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  NotificationDto,
  SendNotificationDto,
  NotificationPreferenceDto,
  NotificationFilterDto,
  NotificationStatsDto,
  NotificationValidationResult,
  NotificationSortBy
} from "../types/notification";
import { DEFAULT_NOTIFICATION_FILTER } from "../types/notification";

// CRUD Operations
export const notificationService = {
  // Get paginated notifications with filtering and sorting
  async getNotifications(
    userId?: number,
    page: number = 1,
    pageSize: number = 10,
    isRead?: boolean,
    sortBy: string = 'SendDate',
    sortDescending: boolean = true
  ): Promise<PagedResultDto<NotificationDto>> {
    const params = new URLSearchParams();
    
    if (userId !== undefined) params.append('userId', userId.toString());
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (isRead !== undefined) params.append('isRead', isRead.toString());
    params.append('sortBy', sortBy);
    params.append('sortDescending', sortDescending.toString());

    const response = await apiClient.get<PagedResultDto<NotificationDto>>(
      `/api/Notification?${params.toString()}`
    );
    return response.data!;
  },

  // Get notification by ID (also marks as read)
  async getNotificationById(notificationId: number): Promise<NotificationDto> {
    const response = await apiClient.get<NotificationDto>(`/api/Notification/${notificationId}`);
    if (!response.data) {
      throw new Error('Notification not found');
    }
    return response.data;
  },

  // Send notification (Admin, Organization, VolunteerCoordinator only)
  async sendNotification(notificationData: SendNotificationDto): Promise<boolean> {
    const response = await apiClient.post<{ success: boolean }>('/api/Notification', notificationData);
    return response.data?.success || false;
  },

  // Configure notification preferences
  async configureNotificationPreferences(preferences: NotificationPreferenceDto): Promise<boolean> {
    const response = await apiClient.put<{ success: boolean }>('/api/Notification/configure', preferences);
    return response.data?.success || false;
  },

  // Get current user's notifications
  async getCurrentUserNotifications(
    page: number = 1,
    pageSize: number = 10,
    isRead?: boolean,
    sortBy: string = 'SendDate',
    sortDescending: boolean = true
  ): Promise<PagedResultDto<NotificationDto>> {
    // This will use the current user's ID from the JWT token
    return this.getNotifications(undefined, page, pageSize, isRead, sortBy, sortDescending);
  },

  // Mark notification as read (by getting it)
  async markAsRead(notificationId: number): Promise<NotificationDto> {
    return this.getNotificationById(notificationId);
  },

  // Get notification statistics (mock implementation)
  async getNotificationStats(userId?: number): Promise<NotificationStatsDto> {
    try {
      const [allNotifications, unreadNotifications] = await Promise.all([
        this.getNotifications(userId, 1, 1),
        this.getNotifications(userId, 1, 1, false)
      ]);

      return {
        totalNotifications: allNotifications.totalCount,
        unreadNotifications: unreadNotifications.totalCount,
        readNotifications: allNotifications.totalCount - unreadNotifications.totalCount,
        recentNotifications: 0 // Would need additional endpoint for this
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        totalNotifications: 0,
        unreadNotifications: 0,
        readNotifications: 0,
        recentNotifications: 0
      };
    }
  },

  // Get filtered notifications with advanced options
  async getFilteredNotifications(filter: NotificationFilterDto): Promise<PagedResultDto<NotificationDto>> {
    const {
      userId,
      page = DEFAULT_NOTIFICATION_FILTER.page!,
      pageSize = DEFAULT_NOTIFICATION_FILTER.pageSize!,
      isRead,
      sortBy = DEFAULT_NOTIFICATION_FILTER.sortBy!,
      sortDescending = DEFAULT_NOTIFICATION_FILTER.sortDescending!
    } = filter;

    return this.getNotifications(userId, page, pageSize, isRead, sortBy, sortDescending);
  }
};

// Validation Functions
export const validateNotificationData = (data: SendNotificationDto): NotificationValidationResult => {
  const errors: string[] = [];

  // Validate userId
  if (!data.userId || data.userId <= 0) {
    errors.push('Valid user ID is required');
  }

  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Notification title is required');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Notification title must not exceed 200 characters');
  }

  // Validate content
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Notification content is required');
  }

  if (data.content && data.content.length > 5000) {
    errors.push('Notification content must not exceed 5,000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateNotificationPreferences = (preferences: NotificationPreferenceDto): NotificationValidationResult => {
  const errors: string[] = [];

  // At least one preference should be enabled
  if (!preferences.receiveEmail && !preferences.receiveWeb) {
    errors.push('At least one notification method must be enabled');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility Functions
export const notificationUtils = {
  // Format notification date for display
  formatNotificationDate: (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return notificationDate.toLocaleDateString();
  },

  // Truncate notification content for preview
  truncateContent: (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  },

  // Get notification priority based on content keywords
  getNotificationPriority: (title: string, content: string): 'high' | 'medium' | 'low' => {
    const highPriorityKeywords = ['urgent', 'important', 'deadline', 'emergency', 'critical'];
    const mediumPriorityKeywords = ['reminder', 'update', 'change', 'notice'];
    
    const text = (title + ' ' + content).toLowerCase();
    
    if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    
    if (mediumPriorityKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  },

  // Check if user can send notifications (role-based)
  canSendNotifications: (userRole?: string): boolean => {
    return userRole === 'Admin' || userRole === 'Organization' || userRole === 'VolunteerCoordinator';
  },

  // Get notification icon based on content
  getNotificationIcon: (title: string, content: string): string => {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('event') || text.includes('sự kiện')) return '📅';
    if (text.includes('certificate') || text.includes('chứng chỉ')) return '🏆';
    if (text.includes('registration') || text.includes('đăng ký')) return '📝';
    if (text.includes('reminder') || text.includes('nhắc nhở')) return '⏰';
    if (text.includes('update') || text.includes('cập nhật')) return '🔄';
    if (text.includes('welcome') || text.includes('chào mừng')) return '👋';
    
    return '📢'; // Default notification icon
  },

  // Sort notifications by different criteria
  sortNotifications: (notifications: NotificationDto[], sortBy: NotificationSortBy, descending: boolean = true): NotificationDto[] => {
    return [...notifications].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'Title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'SendDate':
        default:
          const dateA = new Date(a.sendDate || 0).getTime();
          const dateB = new Date(b.sendDate || 0).getTime();
          comparison = dateA - dateB;
          break;
      }
      
      return descending ? -comparison : comparison;
    });
  },

  // Filter notifications by read status
  filterByReadStatus: (notifications: NotificationDto[], isRead?: boolean): NotificationDto[] => {
    if (isRead === undefined) return notifications;
    return notifications.filter(notification => notification.isRead === isRead);
  },

  // Get unread count
  getUnreadCount: (notifications: NotificationDto[]): number => {
    return notifications.filter(notification => !notification.isRead).length;
  }
};

export default notificationService;