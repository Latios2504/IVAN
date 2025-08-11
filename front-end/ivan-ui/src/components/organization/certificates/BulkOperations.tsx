import { useState } from "react";
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
import {
  CheckCircle,
  X,
  Loader2,
  Users,
  AlertTriangle,
  FileCheck,
  FileX,
} from "lucide-react";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import type { Certificate } from "@/types/certificate";

interface BulkOperationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCertificates: Certificate[];
  onSuccess: () => void;
}

type BulkAction = "approve" | "revoke" | null;

export function BulkOperationsDialog({
  isOpen,
  onClose,
  selectedCertificates,
  onSuccess,
}: BulkOperationsDialogProps) {
  const [currentAction, setCurrentAction] = useState<BulkAction>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleBulkApprove = async () => {
    try {
      setLoading(true);
      setCurrentAction("approve");

      const certificateIds = selectedCertificates.map(
        (cert) => cert.certificateId
      );

      await certificateService.bulkApprove({
        certificateIds,
        reason: notes || "Bulk approval via management interface",
      });

      toast.success(
        `Successfully approved ${certificateIds.length} certificates`
      );
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve certificates";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  const handleBulkRevoke = async () => {
    try {
      setLoading(true);
      setCurrentAction("revoke");

      const certificateIds = selectedCertificates.map(
        (cert) => cert.certificateId
      );

      await certificateService.bulkRevoke({
        certificateIds,
        reason: notes || "Bulk revocation via management interface",
      });

      toast.success(
        `Successfully revoked ${certificateIds.length} certificates`
      );
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to revoke certificates";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  const canApprove = selectedCertificates.every(
    (cert) => cert.status === "pending" || cert.status === "draft"
  );

  const canRevoke = selectedCertificates.every(
    (cert) => cert.status === "issued" || cert.status === "pending"
  );

  const getStatusCounts = () => {
    const counts = selectedCertificates.reduce((acc, cert) => {
      const status = cert.status || "draft";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Bản nháp";
      case "pending":
        return "Chờ phê duyệt";
      case "issued":
        return "Đã cấp";
      case "revoked":
        return "Đã thu hồi";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "outline";
      case "pending":
        return "secondary";
      case "issued":
        return "default";
      case "revoked":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thao tác hàng loạt
          </DialogTitle>
          <DialogDescription>
            Thực hiện thao tác trên {selectedCertificates.length} chứng chỉ đã
            chọn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Certificates Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Danh sách chứng chỉ đã chọn</h3>

            {/* Status Summary */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Badge
                  key={status}
                  variant={getStatusVariant(status) as any}
                  className="text-xs"
                >
                  {getStatusLabel(status)}: {count}
                </Badge>
              ))}
            </div>

            {/* Certificate List */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedCertificates.map((cert) => (
                <div
                  key={cert.certificateId}
                  className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                >
                  <div>
                    <span className="font-medium">{cert.certificateName}</span>
                    <span className="text-gray-500 ml-2">
                      #{cert.certificateNumber}
                    </span>
                  </div>
                  <Badge
                    variant={getStatusVariant(cert.status || "draft") as any}
                    className="text-xs"
                  >
                    {getStatusLabel(cert.status || "draft")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="bulk-notes">Ghi chú</Label>
            <Textarea
              id="bulk-notes"
              placeholder="Nhập ghi chú cho thao tác này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Warnings */}
          {!canApprove && !canRevoke && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Không thể thực hiện thao tác hàng loạt với các chứng chỉ có
                trạng thái khác nhau.
              </span>
            </div>
          )}

          {canApprove && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Các chứng chỉ này có thể được phê duyệt hàng loạt.
              </span>
            </div>
          )}

          {canRevoke && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <FileX className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Các chứng chỉ này có thể được thu hồi hàng loạt.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>

          {canApprove && (
            <Button
              onClick={handleBulkApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && currentAction === "approve" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Phê duyệt hàng loạt
            </Button>
          )}

          {canRevoke && (
            <Button
              onClick={handleBulkRevoke}
              disabled={loading}
              variant="destructive"
            >
              {loading && currentAction === "revoke" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileX className="mr-2 h-4 w-4" />
              )}
              Thu hồi hàng loạt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Checkbox component for selecting certificates
interface CertificateCheckboxProps {
  certificate: Certificate;
  isSelected: boolean;
  onToggle: (certificate: Certificate) => void;
}

export function CertificateCheckbox({
  certificate,
  isSelected,
  onToggle,
}: CertificateCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={`cert-${certificate.certificateId}`}
        checked={isSelected}
        onChange={() => onToggle(certificate)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label
        htmlFor={`cert-${certificate.certificateId}`}
        className="text-sm font-medium text-gray-900 cursor-pointer"
      >
        {certificate.certificateName}
      </label>
    </div>
  );
}

// Hook for managing bulk selection
export function useBulkSelection(certificates: Certificate[]) {
  const [selectedCertificates, setSelectedCertificates] = useState<
    Certificate[]
  >([]);

  const toggleCertificate = (certificate: Certificate) => {
    setSelectedCertificates((prev) => {
      const isSelected = prev.some(
        (c) => c.certificateId === certificate.certificateId
      );
      if (isSelected) {
        return prev.filter(
          (c) => c.certificateId !== certificate.certificateId
        );
      } else {
        return [...prev, certificate];
      }
    });
  };

  const toggleAll = () => {
    if (selectedCertificates.length === certificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates([...certificates]);
    }
  };

  const clearSelection = () => {
    setSelectedCertificates([]);
  };

  const isSelected = (certificate: Certificate) => {
    return selectedCertificates.some(
      (c) => c.certificateId === certificate.certificateId
    );
  };

  const isAllSelected =
    certificates.length > 0 &&
    selectedCertificates.length === certificates.length;
  const isIndeterminate =
    selectedCertificates.length > 0 &&
    selectedCertificates.length < certificates.length;

  return {
    selectedCertificates,
    toggleCertificate,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isIndeterminate,
  };
}
