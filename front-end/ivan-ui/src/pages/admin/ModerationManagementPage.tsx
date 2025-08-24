import React, { useEffect, useState } from 'react';
import { moderationService } from '@/services/ModerationService';
import { feedbackService } from '@/services/feedbackService';
import type {
  ModerationEventListDto,
  ModerationEventDetailDto,
  ModerationEventsParams,
  RejectEventRequestDto,
} from '@/types/moderation';
import type {
  FeedbackListDto,
  FeedbackListParams,
} from '@/types/feedback';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  Eye,
  RefreshCw,
  MessageSquare,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LoadingState } from '@/components/common/LoadingState';
import { EventDetailsModal } from '@/components/admin/moderation/EventDetailsModal';
import { ModerationEventsList } from '@/components/admin/moderation/ModerationEventsList';
import { RejectEventDialog } from '@/components/admin/moderation/RejectEventDialog';
import { FeedbackList } from '@/components/admin/moderation/FeedbackList';
import { FeedbackManagementModal } from '@/components/admin/moderation/FeedbackManagementModal';

interface ModerationStats {
  totalPendingEvents: number;
  eventsThisMonth: number;
  averageProcessingTime: string;
}

interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  feedbacksThisMonth: number;
}

export default function ModerationManagementPage() {
  const { user: currentUser } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('events');

  // Event moderation state
  const [events, setEvents] = useState<ModerationEventListDto[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ModerationEventDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ModerationStats>({
    totalPendingEvents: 0,
    eventsThisMonth: 0,
    averageProcessingTime: '2-3 days',
  });

  // Feedback management state
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListDto | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    totalFeedbacks: 0,
    averageRating: 0,
    feedbacksThisMonth: 0,
  });

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [eventToReject, setEventToReject] = useState<number | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(0);

  // Load events for moderation
  const loadEvents = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const params: ModerationEventsParams = {
        page,
        pageSize,
      };
      
      const response = await moderationService.getEventsForModeration(params);
      setEvents(response.items || []);
      setTotalCount(response.totalCount || 0);
      setCurrentPage(page);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPendingEvents: response.totalCount || 0,
        eventsThisMonth: response.items?.filter(event => {
          const eventDate = new Date(event.submissionDate);
          const now = new Date();
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
        }).length || 0,
      }));
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events for moderation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load event details
  const loadEventDetails = async (eventId: number) => {
    try {
      setIsLoadingDetails(true);
      const details = await moderationService.getEventDetailsForModeration(eventId);
      setSelectedEvent(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error loading event details:', error);
      toast.error('Failed to load event details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle approve event
  const handleApproveEvent = async (eventId: number) => {
    try {
      setIsProcessing(true);
      await moderationService.approveEvent(eventId);
      
      toast.success('Event has been approved successfully.');
      
      // Refresh events list and close modal
      await loadEvents(currentPage);
      setIsDetailsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('Failed to approve event. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject event - open dialog
  const handleRejectEvent = (eventId: number) => {
    setEventToReject(eventId);
    setIsRejectDialogOpen(true);
  };

  // Confirm reject event with reason
  const confirmRejectEvent = async (reason: string) => {
    if (!eventToReject) return;
    
    try {
      setIsProcessing(true);
      const request: RejectEventRequestDto = { reason };
      await moderationService.rejectEvent(eventToReject, request);
      
      toast.success('Event has been rejected successfully.');
      
      // Refresh events list and close modals
      await loadEvents(currentPage);
      setIsRejectDialogOpen(false);
      setIsDetailsModalOpen(false);
      setEventToReject(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast.error('Failed to reject event. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load feedbacks for management
  const loadFeedbacks = async (page: number = 1) => {
    try {
      setIsFeedbackLoading(true);
      const params: FeedbackListParams = {
        pageNumber: page,
        pageSize,
      };
      
      const response = await feedbackService.getAllFeedbacks(params);
      setFeedbacks(response.items || []);
      setFeedbackTotalCount(response.totalCount || 0);
      setFeedbackCurrentPage(page);
      
      // Calculate feedback stats
      const totalRating = response.items?.reduce((sum, feedback) => {
        return sum + (feedback.rating || 0);
      }, 0) || 0;
      const avgRating = response.items?.length ? totalRating / response.items.length : 0;
      
      setFeedbackStats({
        totalFeedbacks: response.totalCount || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        feedbacksThisMonth: response.items?.length || 0, // Simplified for now
      });
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast.error('Failed to load feedbacks.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  // Handle view feedback details
  const handleViewFeedbackDetails = (feedback: FeedbackListDto) => {
    setSelectedFeedback(feedback);
    setIsFeedbackModalOpen(true);
  };

  // Handle feedback update
  const handleFeedbackUpdate = () => {
    loadFeedbacks(feedbackCurrentPage);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (activeTab === 'events') {
      loadEvents(currentPage);
    } else {
      loadFeedbacks(feedbackCurrentPage);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'feedbacks' && feedbacks.length === 0) {
      loadFeedbacks();
    }
  };

  // Initial load
  useEffect(() => {
    loadEvents();
  }, []);

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Moderation</h1>
          <p className="text-muted-foreground mt-2">
            Manage events and feedback submissions
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Event Moderation
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Feedback Management
          </TabsTrigger>
        </TabsList>

        {/* Event Moderation Tab */}
        <TabsContent value="events" className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPendingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Events submitted this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProcessingTime}</div>
            <p className="text-xs text-muted-foreground">
              Average review time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <ModerationEventsList
        events={events}
        onViewDetails={loadEventDetails}
        isLoading={isLoading}
      />

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => loadEvents(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(totalCount / pageSize)}
              </span>
              <Button
                variant="outline"
                onClick={() => loadEvents(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize) || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Feedback Management Tab */}
        <TabsContent value="feedbacks" className="space-y-6">
          {/* Feedback Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackStats.totalFeedbacks}</div>
                <p className="text-xs text-muted-foreground">
                  All feedback received
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackStats.averageRating}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 5 stars
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Feedback</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackStats.feedbacksThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  This period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feedback List */}
          <FeedbackList
            feedbacks={feedbacks}
            onViewDetails={handleViewFeedbackDetails}
            isLoading={isFeedbackLoading}
          />

          {/* Feedback Pagination */}
          {feedbackTotalCount > pageSize && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => loadFeedbacks(feedbackCurrentPage - 1)}
                disabled={feedbackCurrentPage <= 1 || isFeedbackLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {feedbackCurrentPage} of {Math.ceil(feedbackTotalCount / pageSize)}
              </span>
              <Button
                variant="outline"
                onClick={() => loadFeedbacks(feedbackCurrentPage + 1)}
                disabled={feedbackCurrentPage >= Math.ceil(feedbackTotalCount / pageSize) || isFeedbackLoading}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        onApprove={handleApproveEvent}
        onReject={handleRejectEvent}
        isLoading={isProcessing || isLoadingDetails}
      />

      {/* Reject Event Dialog */}
      <RejectEventDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setEventToReject(null);
        }}
        onConfirm={confirmRejectEvent}
        eventName={selectedEvent?.eventName}
        isLoading={isProcessing}
      />

      {/* Feedback Management Modal */}
      <FeedbackManagementModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        feedback={selectedFeedback}
        onUpdate={handleFeedbackUpdate}
      />
    </div>
  );
}