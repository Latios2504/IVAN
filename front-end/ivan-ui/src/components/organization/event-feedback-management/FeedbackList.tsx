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
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600 text-white border-emerald-400 dark:border-emerald-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-600 dark:to-amber-600 text-white border-yellow-400 dark:border-yellow-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600 text-white border-red-400 dark:border-red-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline" className="bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">{status || "Chưa xác định"}</Badge>;
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
    <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
      <CardContent className="p-4 bg-gradient-to-br from-transparent via-white/20 to-blue-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-lg">
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
                <h4 className="font-medium text-sm truncate bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  {feedback.subject}
                </h4>
                <div className="flex items-center space-x-2 ml-2">
                  {getStatusBadge(feedback.status || "")}
                </div>
              </div>

              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  User ID: {feedback.userId}
                </span>
                {feedback.categoryName && (
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600">
                    {feedback.categoryName}
                  </Badge>
                )}
              </div>

              <div className="mt-2">
                {renderRatingStars(feedback.rating ?? null)}
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {feedback.content}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-300">
                <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-600/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
              <DropdownMenuItem onClick={onView} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-200">
                <Eye className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">Xem chi tiết</span>
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
      <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800/80 dark:via-blue-900/20 dark:to-indigo-900/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <RefreshCw className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Đang tải danh sách phản hồi...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-50/80 via-rose-50/60 to-pink-50/80 dark:from-red-900/20 dark:via-rose-900/15 dark:to-pink-900/20 border-red-200/30 dark:border-red-700/30 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Có lỗi xảy ra
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <div className="mt-6">
            <Button onClick={handleRefresh} className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-red-400 dark:border-red-500">
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
      <Card className="bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-blue-50/80 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-gray-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Chưa có phản hồi nào
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sự kiện này chưa nhận được phản hồi nào từ người tham gia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-slate-900/30 dark:via-blue-900/10 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200/20 dark:border-slate-700/20 backdrop-blur-sm">
      {/* Header with stats */}
      <Card className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">Danh sách phản hồi</span>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600">{pagination.totalCount} phản hồi</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600">
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
        <Card className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Trang {filters.page} / {pagination.totalPages} (Tổng:{" "}
                {pagination.totalCount} phản hồi)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(filters.page - 1)}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(filters.page + 1)}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
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
