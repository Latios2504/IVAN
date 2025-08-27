import { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { feedbackService } from "@/services/feedbackService";
import type { FeedbackListDto, FeedbackCreateDto } from "@/types/feedback";

interface FeedbackSectionProps {
  eventId: number;
  eventName: string;
}

export function FeedbackSection({ eventId, eventName }: FeedbackSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  // Create feedback form state
  const [newFeedback, setNewFeedback] = useState<Partial<FeedbackCreateDto>>({
    eventId,
    subject: "",
    content: "",
    rating: 5,
    isAnonymous: false,
    isPublic: true,
    categoryId: 1, // Default category
  });

  // Load feedbacks
  const loadFeedbacks = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await feedbackService.getFeedbacksByEvent({
        eventId,
        pageNumber: page,
        pageSize,
      });

      setFeedbacks(result.items);
      setCurrentPage(result.pageNumber);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalCount);
    } catch (error) {
      toast.error("Không thể tải danh sách phản hồi");
      console.error("Error loading feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load feedbacks on component mount and when eventId changes
  useEffect(() => {
    loadFeedbacks(1);
    setCurrentPage(1);
  }, [eventId]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadFeedbacks(page);
    }
  };

  // Handle create feedback
  const handleCreateFeedback = async () => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để gửi phản hồi");
      return;
    }

    if (!newFeedback.subject?.trim() || !newFeedback.content?.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.createFeedback(newFeedback as FeedbackCreateDto);
      toast.success("Gửi phản hồi thành công!");

      // Reset form
      setNewFeedback({
        eventId,
        subject: "",
        content: "",
        rating: 5,
        isAnonymous: false,
        isPublic: true,
        categoryId: 1,
      });
      setShowCreateForm(false);

      // Reload feedbacks
      loadFeedbacks(1);
    } catch (error) {
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại.");
      console.error("Error creating feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="text-foreground">Phản hồi về sự kiện</span>
              <p className="text-sm text-muted-foreground font-normal">
                {totalItems} phản hồi
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant={showCreateForm ? "outline" : "default"}
              size="sm"
            >
              {showCreateForm ? "Hủy" : "Viết phản hồi"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create Feedback Form */}
        {showCreateForm && isAuthenticated && (
          <Card className="bg-white/50 dark:bg-black/20">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tiêu đề</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Nhập tiêu đề phản hồi..."
                  value={newFeedback.subject || ""}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nội dung</label>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn về sự kiện này..."
                  value={newFeedback.content || ""}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, content: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá</label>
                  <Select
                    value={newFeedback.rating?.toString()}
                    onValueChange={(value) =>
                      setNewFeedback({
                        ...newFeedback,
                        rating: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-1">
                            {renderStars(rating)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newFeedback.isAnonymous || false}
                    onChange={(e) =>
                      setNewFeedback({
                        ...newFeedback,
                        isAnonymous: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    Ẩn danh
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateFeedback}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có phản hồi nào cho sự kiện này</p>
            {isAuthenticated && (
              <p className="text-sm mt-2">
                Hãy là người đầu tiên chia sẻ trải nghiệm!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card
                key={feedback.feedbackId}
                className="bg-white/50 dark:bg-black/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {feedback.isAnonymous
                          ? "Người dùng ẩn danh"
                          : `User ${feedback.userId}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(
                          feedback.createdAt ||
                            feedback.updatedAt ||
                            new Date().toISOString()
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium mb-1">{feedback.subject}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(feedback.rating || 0)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({feedback.rating || 0}/5)
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {feedback.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} ({totalItems} phản hồi)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;

                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
