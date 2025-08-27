import React, { useEffect, useState, useCallback } from "react";
import { feedbackService } from "@/services/feedbackService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type TableColumn, type TableAction } from "@/components/common/DataTable";
import {
  Star,
  MessageSquare,
  Eye,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { FeedbackListDto, FeedbackByEventParams } from "@/types/feedback";

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

// Helper functions for DataTable
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã duyệt
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chờ duyệt
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Từ chối
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status || "Chưa xác định"}
        </Badge>
      );
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

const truncateContent = (content: string, maxLength: number = 60) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
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

  // Define columns for DataTable
  const columns: TableColumn<FeedbackListDto>[] = [
    {
      key: "subject",
      header: "Tiêu đề",
      className: "w-[200px]",
      render: (value, item) => (
        <div className="space-y-1">
          <p className="font-semibold text-sm">{value}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>ID: {item.feedbackId}</span>
            {item.isAnonymous && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                Ẩn danh
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Danh mục",
      className: "w-[120px]",
      render: (value) => (
        <Badge variant="secondary" className="text-xs">
          {value || "Chung"}
        </Badge>
      ),
    },
    {
      key: "rating",
      header: "Đánh giá",
      className: "w-[120px]",
      render: (value) => renderRatingStars(value),
    },
    {
      key: "content",
      header: "Nội dung",
      className: "w-[300px]",
      render: (value) => (
        <div className="max-w-[280px]">
          <p className="text-sm text-muted-foreground break-words overflow-hidden">
            {truncateContent(value, 80)}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "w-[120px]",
      render: (value) => getStatusBadge(value || ""),
    },
    {
      key: "userId",
      header: "Người dùng",
      className: "w-[100px]",
      render: (value) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {value}
        </div>
      ),
    },
  ];

  // Define actions for DataTable
  const actions: TableAction<FeedbackListDto>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="h-3 w-3" />,
      onClick: handleViewFeedback,
      variant: "outline",
      size: "sm",
    },
  ];

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-50/80 via-rose-50/60 to-pink-50/80 dark:from-red-900/20 dark:via-rose-900/15 dark:to-pink-900/20 border-red-200/30 dark:border-red-700/30 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Có lỗi xảy ra
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
          <div className="mt-6">
            <Button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-red-400 dark:border-red-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
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
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Danh sách phản hồi</span>
              <Badge variant="outline">
                {pagination.totalCount} phản hồi
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* DataTable */}
      <DataTable
        data={feedbacks}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="Sự kiện này chưa nhận được phản hồi nào từ người tham gia."
        showPagination={true}
        pagination={{
          currentPage: filters.page,
          totalPages: pagination.totalPages,
          pageSize: filters.size,
          totalItems: pagination.totalCount,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default FeedbackList;
