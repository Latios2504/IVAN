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
  UserX,
} from "lucide-react";
import type { FeedbackListDto, FeedbackByEventParams } from "@/types/feedback";
import { useAuth } from "@/hooks/useAuth";
import FeedbackDetailModal from "./FeedbackDetailModal";

interface FeedbackListProps {
  eventId: number | string;
  filters?: FeedbackFilters;
  onFiltersChange?: (filters: Partial<FeedbackFilters>) => void;
}

interface FeedbackFilters {
  page: number;
  size: number;
  rating?: number;
  search?: string;
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
  const { hasRole } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackListDto[]>([]);

  // Load all feedbacks from API (without filters)
  const loadAllFeedbacks = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      // Get all feedbacks with a large page size to get everything
      const params: FeedbackByEventParams = {
        eventId: Number(eventId),
        pageNumber: 1,
        pageSize: 1000, // Large page size to get all feedbacks
      };

      const result = await feedbackService.getFeedbacksByEvent(params);
      setAllFeedbacks(result.items || []);
    } catch (err) {
      console.error("Error loading feedbacks:", err);
      setError(err instanceof Error ? err.message : "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Apply client-side filtering and pagination
  const loadFeedbacks = useCallback(() => {
    let filteredFeedbacks = [...allFeedbacks];

    // Apply rating filter
    if (filters.rating) {
      filteredFeedbacks = filteredFeedbacks.filter(
        (feedback) => feedback.rating === filters.rating
      );
    }

    // Apply search filter (search in subject and content)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFeedbacks = filteredFeedbacks.filter(
        (feedback) =>
          feedback.subject.toLowerCase().includes(searchTerm) ||
          feedback.content.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const totalCount = filteredFeedbacks.length;
    const totalPages = Math.ceil(totalCount / filters.size);
    const startIndex = (filters.page - 1) * filters.size;
    const endIndex = startIndex + filters.size;
    const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

    // Update state
    setFeedbacks(paginatedFeedbacks);
    setPagination({
      totalCount,
      totalPages,
      hasPreviousPage: filters.page > 1,
      hasNextPage: filters.page < totalPages,
    });
  }, [allFeedbacks, filters.rating, filters.search, filters.page, filters.size]);

  // Load all feedbacks when component mounts or eventId changes
  useEffect(() => {
    loadAllFeedbacks();
  }, [loadAllFeedbacks]);

  // Apply filters when allFeedbacks or filters change
  useEffect(() => {
    if (allFeedbacks.length > 0) {
      loadFeedbacks();
    }
  }, [loadFeedbacks, allFeedbacks]);

  const handleRefresh = () => {
    loadAllFeedbacks();
  };

  const handlePageChange = (newPage: number) => {
    if (onFiltersChange) {
      onFiltersChange({ page: newPage });
    }
  };

  const handleViewFeedback = (feedback: FeedbackListDto) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
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
            {/* Chỉ hiển thị ID cho admin, organization không cần thấy ID */}
            {hasRole('admin') && <span>ID: {item.feedbackId}</span>}
            {item.isAnonymous && (
              <Badge variant="outline" className="text-xs px-1 py-0 bg-gray-100 dark:bg-gray-800">
                <UserX className="h-3 w-3 mr-1" />
                Ẩn danh
              </Badge>
            )}
          </div>
        </div>
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
      key: "userId",
      header: "Người dùng",
      className: "w-[120px]",
      render: (value, item) => {
        // Chỉ admin mới được xem userId thật của người ẩn danh
        if (item.isAnonymous && !hasRole('admin')) {
          return (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserX className="h-3 w-3" />
              <span className="italic">Ẩn danh</span>
            </div>
          );
        }
        
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{hasRole('admin') ? `ID: ${value}` : value}</span>
          </div>
        );
      },
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

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FeedbackList;
