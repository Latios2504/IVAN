import React, { useEffect, useState, useCallback } from "react";
import { feedbackService } from "@/services/feedbackService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Star,
  MessageSquare,
  MoreVertical,
  Eye,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { FeedbackListDto, FeedbackByEventParams } from "@/types/feedback";
import type { PagedResultDto } from "@/types/common";

interface FeedbackListProps {
  eventId: number | string;
  filters?: FeedbackFilters;
  onFiltersChange?: (filters: Partial<FeedbackFilters>) => void;
}

interface FeedbackFilters {
  page: number;
  size: number;
  categoryId?: number;
  rating?: number;
}

interface FeedbackCardProps {
  feedback: FeedbackListDto;
  onView: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onView }) => {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Chưa xác định"}</Badge>;
    }
  };

  const renderRatingStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">Chưa đánh giá</span>;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate">
                  {feedback.subject}
                </h4>
                <div className="flex items-center space-x-2 ml-2">
                  {getStatusBadge(feedback.status || "")}
                </div>
              </div>

              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  User ID: {feedback.userId}
                </span>
                {feedback.categoryName && (
                  <Badge variant="outline" className="text-xs">
                    {feedback.categoryName}
                  </Badge>
                )}
              </div>

              <div className="mt-2">
                {renderRatingStars(feedback.rating ?? null)}
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {feedback.content}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

const FeedbackList: React.FC<FeedbackListProps> = ({
  eventId,
  filters = { page: 1, size: 10 },
  onFiltersChange,
}) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const loadFeedbacks = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const params: FeedbackByEventParams = {
        eventId: Number(eventId),
        pageNumber: filters.page,
        pageSize: filters.size,
      };

      const result = await feedbackService.getFeedbacksByEvent(params);

      setFeedbacks(result.items || []);
      setPagination({
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
      });
    } catch (err) {
      console.error("Error loading feedbacks:", err);
      setError(err instanceof Error ? err.message : "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, [eventId, filters.page, filters.size]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleRefresh = () => {
    loadFeedbacks();
  };

  const handlePageChange = (newPage: number) => {
    if (onFiltersChange) {
      onFiltersChange({ page: newPage });
    }
  };

  const handleViewFeedback = (feedback: FeedbackListDto) => {
    // TODO: Implement feedback detail view
    console.log("View feedback:", feedback);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <RefreshCw className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">
            Đang tải danh sách phản hồi...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Có lỗi xảy ra
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Chưa có phản hồi nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Sự kiện này chưa nhận được phản hồi nào từ người tham gia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Danh sách phản hồi
              <Badge variant="outline">{pagination.totalCount} phản hồi</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Feedback list */}
      <div className="space-y-3">
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.feedbackId}
            feedback={feedback}
            onView={() => handleViewFeedback(feedback)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Trang {filters.page} / {pagination.totalPages} (Tổng:{" "}
                {pagination.totalCount} phản hồi)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeedbackList;
