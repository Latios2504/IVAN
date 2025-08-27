import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, StarHalf, User, UserX, Calendar } from "lucide-react";
import type { FeedbackListDto } from "@/types/feedback";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface FeedbackDetailModalProps {
  feedback: FeedbackListDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  isOpen,
  onClose,
}) => {
  if (!feedback) return null;

  const renderRatingStars = (rating?: number | null) => {
    if (!rating) {
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <span className="text-sm">Chưa đánh giá</span>
        </div>
      );
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Không xác định";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return "Không xác định";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Chi tiết phản hồi</span>
            {feedback.isAnonymous && (
              <Badge variant="outline" className="text-xs">
                <UserX className="h-3 w-3 mr-1" />
                Ẩn danh
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tiêu đề */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feedback.subject}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {feedback.isAnonymous ? (
                        <>
                          <UserX className="h-4 w-4" />
                          <span>Ẩn danh</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          <span>ID: {feedback.userId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Đánh giá */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Đánh giá</span>
              </div>
              {renderRatingStars(feedback.rating)}
            </CardContent>
          </Card>

          <Separator />

          {/* Nội dung */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium mb-3">Nội dung phản hồi</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {feedback.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailModal;
