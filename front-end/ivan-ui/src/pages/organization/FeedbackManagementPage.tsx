import React, { useEffect, useState } from 'react';
import { feedbackService } from '@/services/feedbackService';
import type {
  FeedbackListDto,
  FeedbackListParams,
  FeedbackByEventParams,
} from '@/types/feedback';
import { useAuth } from '@/hooks/useAuth';
import {
  MessageSquare,
  Star,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingState } from '@/components/common/LoadingState';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  feedbacksThisMonth: number;
}

export default function FeedbackManagementPage() {
  const { user: currentUser } = useAuth();

  // State management
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedbacks: 0,
    averageRating: 0,
    feedbacksThisMonth: 0,
  });

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'event'>('all');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Load feedbacks
  const loadFeedbacks = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let response;

      if (filterType === 'event' && selectedEventId) {
        const params: FeedbackByEventParams = {
          eventId: selectedEventId,
          pageNumber: page,
          pageSize,
        };
        response = await feedbackService.getFeedbacksByEvent(params);
      } else {
        const params: FeedbackListParams = {
          pageNumber: page,
          pageSize,
        };
        response = await feedbackService.getAllFeedbacks(params);
      }

      setFeedbacks(response.items || []);
      setTotalCount(response.totalCount || 0);
      setCurrentPage(page);

      // Calculate stats
      const totalRating = response.items?.reduce((sum, feedback) => {
        return sum + (feedback.rating || 0);
      }, 0) || 0;
      const avgRating = response.items?.length ? totalRating / response.items.length : 0;

      setStats({
        totalFeedbacks: response.totalCount || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        feedbacksThisMonth: response.items?.length || 0, // Simplified for now
      });
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast.error('Failed to load feedbacks.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view feedback details
  const handleViewDetails = (feedback: FeedbackListDto) => {
    setSelectedFeedback(feedback);
    setIsDetailsModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadFeedbacks(currentPage);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilterType(value as 'all' | 'event');
    if (value === 'all') {
      setSelectedEventId(null);
    }
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render rating stars
  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return <span className="text-muted-foreground">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  // Initial load
  useEffect(() => {
    loadFeedbacks();
  }, [filterType, selectedEventId]);

  // Check if user has access
  if (!currentUser || currentUser.role !== 'organization') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-destructive mx-auto mb-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage feedback from your events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedback</SelectItem>
              <SelectItem value="event">By Event</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
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
            <div className="text-2xl font-bold">{stats.averageRating}</div>
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
            <div className="text-2xl font-bold">{stats.feedbacksThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState loading={isLoading} />
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Feedback Found</h3>
              <p className="text-muted-foreground">
                No feedback has been submitted yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.feedbackId}>
                    <TableCell className="font-medium">
                      {feedback.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {feedback.categoryName || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderRating(feedback.rating)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={feedback.status === 'approved' ? 'default' : 'secondary'}
                      >
                        {feedback.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{feedback.eventId}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(feedback)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => loadFeedbacks(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => loadFeedbacks(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalCount / pageSize) || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Feedback Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="font-medium">{selectedFeedback.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{selectedFeedback.categoryName || 'General'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <div className="mt-1">
                    {renderRating(selectedFeedback.rating)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge 
                      variant={selectedFeedback.status === 'approved' ? 'default' : 'secondary'}
                    >
                      {selectedFeedback.status || 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                  <p>{selectedFeedback.eventId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p>{selectedFeedback.userId}</p>
                </div>
              </div>

              <Separator />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Content</label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedFeedback.content}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}