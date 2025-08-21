import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateTemplateViewModel } from "@/types/certificate";

interface BulkActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  selectedTemplates: CertificateTemplateViewModel[];
}

type BulkAction = "activate" | "deactivate" | "delete";

export default function BulkActionsModal({
  open,
  onOpenChange,
  onSuccess,
  selectedTemplates,
}: BulkActionsModalProps) {
  const [processing, setProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BulkAction | "">("");

  const handleExecute = async () => {
    if (!selectedAction || selectedTemplates.length === 0) return;

    try {
      setProcessing(true);
      const templateIds = selectedTemplates.map((t) => t.templateId);

      switch (selectedAction) {
        case "activate":
          // Use individual activate calls
          await Promise.all(
            templateIds.map((id) =>
              certificateTemplateService.activateTemplate(id)
            )
          );
          toast.success(`Đã kích hoạt ${templateIds.length} mẫu thành công!`);
          break;
        case "deactivate":
          // Use individual deactivate calls
          await Promise.all(
            templateIds.map((id) =>
              certificateTemplateService.deactivateTemplate(id)
            )
          );
          toast.success(`Đã tạm dừng ${templateIds.length} mẫu thành công!`);
          break;
        case "delete":
          // Use individual delete calls
          await Promise.all(
            templateIds.map((id) =>
              certificateTemplateService.deleteCertificateTemplate(id)
            )
          );
          toast.success(`Đã xóa ${templateIds.length} mẫu thành công!`);
          break;
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Không thể thực hiện thao tác hàng loạt");
    } finally {
      setProcessing(false);
    }
  };

  const actionConfig = {
    activate: {
      label: "Kích hoạt mẫu",
      description: "Kích hoạt tất cả mẫu đã chọn để có thể sử dụng",
      icon: CheckCircle,
      color: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    deactivate: {
      label: "Tạm dừng mẫu",
      description: "Tạm dừng tất cả mẫu đã chọn để không thể sử dụng",
      icon: XCircle,
      color: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
    },
    delete: {
      label: "Xóa mẫu",
      description: "Xóa vĩnh viễn tất cả mẫu đã chọn (không thể hoàn tác)",
      icon: Trash2,
      color: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
  };

  const currentConfig = selectedAction ? actionConfig[selectedAction] : null;
  const Icon = currentConfig?.icon;

  // Filter out default templates for delete action
  const canDelete = selectedTemplates.filter((t) => !t.isDefault);
  const effectiveTemplates =
    selectedAction === "delete" ? canDelete : selectedTemplates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-xl">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 -m-6 mb-4 p-6 rounded-t-lg border-b border-blue-200 dark:border-blue-700">
          <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold">
            <Users className="h-5 w-5 text-blue-600" />
            Thao tác hàng loạt
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Thực hiện thao tác cho {selectedTemplates.length} mẫu đã chọn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Templates */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mẫu đã chọn ({selectedTemplates.length})
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {selectedTemplates.map((template) => (
                <div
                  key={template.templateId}
                  className="flex items-center gap-2 p-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded text-sm border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <span className="flex-1 truncate text-gray-800 dark:text-gray-200">
                    {template.templateName}
                  </span>
                  {template.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Hệ thống
                    </Badge>
                  )}
                  {!template.isActive && (
                    <Badge variant="destructive" className="text-xs">
                      Tạm dừng
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chọn thao tác</h4>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value as BulkAction)}
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Chọn thao tác cần thực hiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Kích hoạt mẫu
                  </div>
                </SelectItem>
                <SelectItem value="deactivate">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-orange-600" />
                    Tạm dừng mẫu
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Xóa mẫu
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Description */}
          {currentConfig && (
            <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className={`h-4 w-4 ${currentConfig.color}`} />}
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                  {currentConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentConfig.description}
              </p>

              {selectedAction === "delete" &&
                selectedTemplates.length !== canDelete.length && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="text-yellow-800">
                      ⚠️ Chỉ có thể xóa {canDelete.length}/
                      {selectedTemplates.length} mẫu (không thể xóa mẫu hệ
                      thống)
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
            className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Hủy
          </Button>
          <Button
            onClick={handleExecute}
            disabled={
              !selectedAction || processing || effectiveTemplates.length === 0
            }
            className={`${currentConfig?.buttonColor} shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            Thực hiện ({effectiveTemplates.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
