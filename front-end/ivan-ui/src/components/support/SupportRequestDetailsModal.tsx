import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { 
  SupportRequest, 
  SupportCategory, 
  UpdateSupportRequestData,
  AddCommentData,
  SupportRequestComment 
} from "@/types/support";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  User, 
  MessageSquare, 
  Star,
  Edit,
  Save,
  X,
  Send,
  Paperclip
} from "lucide-react";

interface SupportRequestDetailsModalProps {
  request: SupportRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedRequest: SupportRequest) => void;
  canUpdate: boolean;
  categories: SupportCategory[];
}

export const SupportRequestDetailsModal = ({
  request,
  open,
  onOpenChange,
  onUpdate,
  canUpdate,
  categories
}: SupportRequestDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<UpdateSupportRequestData>({
    subject: request.subject,
    description: request.description,
    priority: request.priority,
    status: request.status,
    resolution: request.resolution
  });
  
  const [newComment, setNewComment] = useState<AddCommentData>({
    comment: '',
    isInternal: false
  });
  const [addingComment, setAddingComment] = useState(false);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Handle update request
  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedRequest: SupportRequest = {
        ...request,
        subject: editData.subject || request.subject,
        description: editData.description || request.description,
        priority: editData.priority || request.priority,
        status: editData.status || request.status,
        resolution: editData.resolution || request.resolution,
        updatedAt: new Date().toISOString()
      };
      
      onUpdate(updatedRequest);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating support request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.comment.trim()) return;
    
    try {
      setAddingComment(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment: SupportRequestComment = {
        commentId: Date.now(),
        requestId: request.requestId,
        userId: 1, // Current user ID - should come from auth context
        comment: newComment.comment,
        isInternal: newComment.isInternal,
        createdAt: new Date().toISOString(),
        user: {
          userId: 1,
          email: "admin@ivan.com",
          fullName: "Admin",
          role: "admin"
        }
      };
      
      const updatedRequest: SupportRequest = {
        ...request,
        comments: [...(request.comments || []), comment],
        updatedAt: new Date().toISOString()
      };
      
      onUpdate(updatedRequest);
      setNewComment({ comment: '', isInternal: false });
      
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setAddingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status || 'Open')}
                <span>Yêu cầu hỗ trợ #{request.requestId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusBadgeColor(request.status || 'Open')}>
                  {request.status === 'Open' ? 'Mở' :
                   request.status === 'In Progress' ? 'Đang xử lý' :
                   request.status === 'Resolved' ? 'Đã giải quyết' :
                   request.status === 'Closed' ? 'Đã đóng' : request.status}
                </Badge>
                <Badge className={getPriorityBadgeColor(request.priority || 'Medium')}>
                  {request.priority === 'High' ? 'Cao' :
                   request.priority === 'Medium' ? 'Trung bình' :
                   request.priority === 'Low' ? 'Thấp' : request.priority}
                </Badge>
              </div>
            </div>
            
            {canUpdate && (
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Skeleton className="w-4 h-4" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Lưu
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Tạo bởi {request.user?.fullName} • {formatDate(request.createdAt || '')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-1">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin yêu cầu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject */}
                <div>
                  <Label>Chủ đề</Label>
                  {isEditing ? (
                    <Input
                      value={editData.subject}
                      onChange={(e) => setEditData(prev => ({ ...prev, subject: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{request.subject}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label>Danh mục</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge variant="outline">{request.category?.categoryName}</Badge>
                    {request.category?.description && (
                      <span className="text-sm text-gray-500">- {request.category.description}</span>
                    )}
                  </div>
                </div>

                {/* Priority */}
                {isEditing ? (
                  <div>
                    <Label>Mức độ ưu tiên</Label>
                    <Select
                      value={editData.priority}
                      onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                        setEditData(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Thấp</SelectItem>
                        <SelectItem value="Medium">Trung bình</SelectItem>
                        <SelectItem value="High">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {/* Status - only for editing */}
                {isEditing && (
                  <div>
                    <Label>Trạng thái</Label>
                    <Select
                      value={editData.status}
                      onValueChange={(value: 'Open' | 'In Progress' | 'Resolved' | 'Closed') => 
                        setEditData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Mở</SelectItem>
                        <SelectItem value="In Progress">Đang xử lý</SelectItem>
                        <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="Closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <Label>Mô tả chi tiết</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                    </div>
                  )}
                </div>

                {/* Resolution - only show if resolved */}
                {(request.status === 'Resolved' || isEditing) && (
                  <div>
                    <Label>Giải pháp</Label>
                    {isEditing ? (
                      <Textarea
                        value={editData.resolution || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, resolution: e.target.value }))}
                        rows={3}
                        className="mt-1"
                        placeholder="Mô tả giải pháp đã áp dụng..."
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-900 whitespace-pre-wrap">
                          {request.resolution || 'Chưa có giải pháp'}
                        </p>
                        {request.resolvedBy && request.resolvedDate && (
                          <div className="mt-2 text-sm text-green-700">
                            <p>Giải quyết bởi: {request.resolvedByUser?.fullName}</p>
                            <p>Thời gian: {formatDate(request.resolvedDate)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Satisfaction Rating */}
                {request.satisfactionRating && (
                  <div>
                    <Label>Đánh giá hài lòng</Label>
                    <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      {renderStars(request.satisfactionRating)}
                      {request.satisfactionFeedback && (
                        <p className="mt-2 text-yellow-900 text-sm">
                          "{request.satisfactionFeedback}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Bình luận ({request.comments?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Existing Comments */}
                {request.comments && request.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {request.comments.map((comment) => (
                      <div key={comment.commentId} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.user?.fullName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt || '')}
                            </span>
                            {comment.isInternal && (
                              <Badge variant="outline" className="text-xs">
                                Nội bộ
                              </Badge>
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có bình luận nào
                  </p>
                )}

                <Separator className="my-4" />

                {/* Add Comment */}
                <div className="space-y-3">
                  <Label>Thêm bình luận</Label>
                  <Textarea
                    value={newComment.comment}
                    onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Nhập bình luận của bạn..."
                    rows={3}
                  />
                  
                  {canUpdate && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={newComment.isInternal}
                        onChange={(e) => setNewComment(prev => ({ ...prev, isInternal: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="internal" className="text-sm text-gray-600">
                        Bình luận nội bộ (chỉ admin và staff nhìn thấy)
                      </label>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.comment.trim() || addingComment}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addingComment ? (
                      <Skeleton className="w-4 h-4" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Gửi bình luận
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
