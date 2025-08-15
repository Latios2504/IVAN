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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thao tác hàng loạt
          </DialogTitle>
          <DialogDescription>
            Thực hiện thao tác cho {selectedTemplates.length} mẫu đã chọn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Templates */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Mẫu đã chọn ({selectedTemplates.length})
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedTemplates.map((template) => (
                <div
                  key={template.templateId}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                >
                  <span className="flex-1 truncate">
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
            <h4 className="text-sm font-medium">Chọn thao tác</h4>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value as BulkAction)}
            >
              <SelectTrigger>
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
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className={`h-4 w-4 ${currentConfig.color}`} />}
                <span className="font-medium text-sm">
                  {currentConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Hủy
          </Button>
          <Button
            onClick={handleExecute}
            disabled={
              !selectedAction || processing || effectiveTemplates.length === 0
            }
            className={currentConfig?.buttonColor}
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
