import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  User,
  Users,
  XCircle,
  FileText,
  Briefcase,
} from "lucide-react";
import { coordinatorRequestService } from "@/services/coordinatorRequestService";
import type { CoordinatorRequestListItemDto } from "@/types/coordinatorRequest";

interface CoordinatorRequestDetailsModalProps {
  request: CoordinatorRequestListItemDto | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string, note?: string) => void;
  onReject: (requestId: string, note: string) => void;
  isLoading: boolean;
}

export const CoordinatorRequestDetailsModal: React.FC<
  CoordinatorRequestDetailsModalProps
> = ({ request, isOpen, onClose, onApprove, onReject, isLoading }) => {
  const [note, setNote] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleClose = () => {
    setNote("");
    setAction(null);
    onClose();
  };

  const handleApprove = () => {
    if (request) {
      onApprove(request.requestId, note.trim() || undefined);
    }
  };

  const handleReject = () => {
    if (request && note.trim()) {
      onReject(request.requestId, note.trim());
    }
  };

  const getStatusBadge = (status: string) => {
    const color = coordinatorRequestService.getStatusColor(status);
    const displayText = coordinatorRequestService.getStatusDisplayText(status);
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (color) {
      case "yellow":
        variant = "outline";
        break;
      case "green":
        variant = "default";
        break;
      case "red":
        variant = "destructive";
        break;
      default:
        variant = "secondary";
    }

    return (
      <Badge variant={variant} className="capitalize">
        {displayText}
      </Badge>
    );
  };

  const canTakeAction = request && coordinatorRequestService.canUpdateRequest(request.status);

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chi tiết yêu cầu điều phối viên
          </DialogTitle>
          <DialogDescription>
            Xem xét yêu cầu tạo điều phối viên và thực hiện hành động phù hợp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                ID Yêu cầu
              </Label>
              <p className="font-mono text-sm">{request.requestId}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Trạng thái
              </Label>
              <div>{getStatusBadge(request.status)}</div>
            </div>
          </div>

          <Separator />

          {/* Organization & Candidate Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tổ chức & Ứng viên
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  ID Tổ chức
                </Label>
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  #{request.organizationId}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email ứng viên
                </Label>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {request.candidateEmail}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Submission Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Chi tiết gửi yêu cầu
            </h3>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Thời gian gửi
              </Label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {coordinatorRequestService.formatRequestDate(request.submittedAt)}
              </p>
            </div>
          </div>

          {/* Action Section */}
          {canTakeAction && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hành động quản trị</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú (Tùy chọn cho Phê duyệt, Bắt buộc cho Từ chối)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Thêm ghi chú về quyết định của bạn..."
                    className="min-h-[100px] bg-background border-border rounded-xl"
                    maxLength={1000}
                  />
                  <div className="text-sm text-muted-foreground text-right">
                    {note.length}/1000 ký tự
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="rounded-xl">
            Đóng
          </Button>
          
          {canTakeAction && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading || !note.trim()}
                className="flex items-center gap-2 rounded-xl"
              >
                <XCircle className="h-4 w-4" />
                {isLoading ? "Đang từ chối..." : "Từ chối"}
              </Button>
              
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                {isLoading ? "Đang phê duyệt..." : "Phê duyệt"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};