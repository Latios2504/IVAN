import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";

interface DeleteCertificateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  templateId: number | null;
  templateName: string;
}

export default function DeleteCertificateTemplateDialog({
  open,
  onOpenChange,
  onSuccess,
  templateId,
  templateName,
}: DeleteCertificateTemplateDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!templateId) return;

    try {
      setDeleting(true);
      await certificateTemplateService.deleteCertificateTemplate(templateId);

      toast.success(`Đã xóa mẫu "${templateName}" thành công!`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Không thể xóa mẫu chứng chỉ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Xác nhận xóa mẫu chứng chỉ
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa mẫu chứng chỉ{" "}
              <span className="font-semibold">"{templateName}"</span>?
            </p>
            <p className="text-sm text-red-600">
              ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến
              mẫu này sẽ bị xóa vĩnh viễn.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa mẫu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
