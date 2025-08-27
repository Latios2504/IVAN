import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MessageSquare,
  Star,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Calendar,
} from 'lucide-react';
import type { FeedbackListDto, FeedbackUpdateDto } from '@/types/feedback';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';

interface FeedbackManagementModalProps {
  feedback: FeedbackListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
}

export const FeedbackManagementModal: React.FC<FeedbackManagementModalProps> = ({
  feedback,
  isOpen,
  onClose,
  onUpdate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Reset editing state when feedback changes
  useEffect(() => {
    if (feedback) {
      setEditedContent(feedback.content);
      setIsEditing(false);
    }
  }, [feedback]);

  if (!feedback) return null;

  // Render rating stars
  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return <span className="text-muted-foreground">Chưa đánh giá</span>;
    
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

  // Handle update feedback
  const handleUpdateFeedback = async () => {
    if (!feedback || editedContent.trim() === feedback.content.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const updateDto: FeedbackUpdateDto = {
        idFeedback: feedback.feedbackId,
        content: editedContent.trim(),
      };
      
      await feedbackService.updateFeedback(updateDto);
      toast.success('Cập nhật phản hồi thành công.');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Không thể cập nhật phản hồi. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete feedback
  const handleDeleteFeedback = async () => {
    if (!feedback) return;

    try {
      setIsDeleting(true);
      await feedbackService.deleteFeedback(feedback.feedbackId);
      toast.success('Xóa phản hồi thành công.');
      setShowDeleteDialog(false);
      onClose();
      onUpdate();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Không thể xóa phản hồi. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedContent(feedback.content);
    setIsEditing(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Quản lý phản hồi
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Header Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Chủ đề</Label>
                  <p className="mt-1 text-base font-medium text-gray-900">{feedback.subject}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Đánh giá</Label>
                    <div className="mt-1 flex items-center gap-1">
                      {renderRating(feedback.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-600">({feedback.rating}/5)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Trạng thái</Label>
                <div className="mt-1">
                  <Badge 
                    variant={feedback.status === 'approved' ? 'default' : 'secondary'}
                  >
                    {feedback.status || 'Chờ duyệt'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Ẩn danh</Label>
                <div className="mt-1">
                  <Badge variant={feedback.isAnonymous ? 'secondary' : 'outline'}>
                    {feedback.isAnonymous ? 'Có' : 'Không'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reference Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-700">ID Sự kiện</Label>
                  <p className="text-sm text-gray-900">{feedback.eventId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-700">ID Người dùng</Label>
                  <p className="text-sm text-gray-900">{feedback.userId}</p>
                </div>
              </div>
            </div>

            <Separator />
            
            {/* Content Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Nội dung phản hồi</Label>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[150px] resize-none"
                    placeholder="Nhập nội dung phản hồi..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdateFeedback}
                      disabled={isUpdating || !editedContent.trim()}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border max-h-[200px] overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed break-words">
                    {feedback.content || 'No content provided'}
                  </p>
                </div>
              )}
            </div>

            <Separator />
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Xóa phản hồi
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
              <br /><br />
              <strong>Chủ đề:</strong> {feedback.subject}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFeedback}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeedbackManagementModal;