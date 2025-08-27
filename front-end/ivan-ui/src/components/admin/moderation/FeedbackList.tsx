import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Star, MessageSquare, User, Calendar } from 'lucide-react';
import type { FeedbackListDto } from '@/types/feedback';

interface FeedbackListProps {
  feedbacks: FeedbackListDto[];
  onViewDetails: (feedback: FeedbackListDto) => void;
  isLoading?: boolean;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onViewDetails,
  isLoading = false,
}) => {
  // Render rating stars
  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return <span className="text-muted-foreground text-sm">Chưa đánh giá</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
      </div>
    );
  };

  // Truncate content for display
  const truncateContent = (content: string, maxLength: number = 50) => {
    if (!content) return 'Không có nội dung';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quản lý phản hồi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy phản hồi</h3>
            <p className="text-muted-foreground">
              Hiện tại không có phản hồi nào.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Quản lý phản hồi ({feedbacks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Chủ đề</TableHead>
                <TableHead className="w-[100px]">Đánh giá</TableHead>
                <TableHead className="w-[300px]">Nội dung</TableHead>
                <TableHead className="w-[80px]">Sự kiện</TableHead>
                <TableHead className="w-[80px]">Người dùng</TableHead>
                <TableHead className="w-[100px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.feedbackId} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{feedback.subject}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>ID: {feedback.feedbackId}</span>
                        {feedback.isAnonymous && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            Ẩn danh
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  

                  
                  <TableCell>
                    {renderRating(feedback.rating)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="max-w-[280px]">
                      <p className="text-sm text-muted-foreground break-words overflow-hidden">
                        {truncateContent(feedback.content, 80)}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {feedback.eventId}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {feedback.userId}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(feedback)}
                      className="flex items-center gap-1 text-xs h-8"
                    >
                      <Eye className="h-3 w-3" />
                      Quản lý
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;