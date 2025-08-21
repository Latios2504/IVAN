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
      <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20 border border-red-200 dark:border-red-800 shadow-xl">
        <AlertDialogHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 -m-6 mb-4 p-6 rounded-t-lg border-b border-red-200 dark:border-red-700">
          <AlertDialogTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Xác nhận xóa mẫu chứng chỉ
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-gray-600 dark:text-gray-300">
            <p>
              Bạn có chắc chắn muốn xóa mẫu chứng chỉ{" "}
              <span className="font-semibold">"{templateName}"</span>?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
              ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến
              mẫu này sẽ bị xóa vĩnh viễn.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 pt-4 border-t border-red-200 dark:border-red-700">
          <AlertDialogCancel disabled={deleting} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-red-600"
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
