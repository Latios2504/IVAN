import { useEffect, useState, useCallback, useMemo } from "react";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import RegistrationDetailModal from "./RegistrationDetailModal";
import ApproveRegistrationModal from "./ApproveRegistrationModal";
import { RejectRegistrationModal } from "./RejectRegistrationModal";
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import type {
  RegistrationDTO,
  RegistrationFilters,
  ApproveRegistrationRequestDTO,
  RejectRegistrationRequestDTO,
} from "@/types/eventRegistration";

interface RegistrationListProps {
  eventId: number | string;
  filters?: RegistrationFilters;
  onFiltersChange?: (filters: Partial<RegistrationFilters>) => void;
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

// Helper function to render user avatar and name
const renderUserInfo = (registration: RegistrationDTO) => (
  <div className="flex items-center space-x-3">
    <Avatar className="h-8 w-8">
      <AvatarImage src="" alt={registration.fullName || "User"} />
      <AvatarFallback className="text-xs">
        {registration.fullName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium text-sm">
        {registration.fullName || "Unknown User"}
      </div>
    </div>
  </div>
);

export default function RegistrationList({
  eventId,
  filters,
  onFiltersChange,
}: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<RegistrationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 0,
    totalItems: 0,
  });

  // Modal states
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationDTO | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const numericEventId =
    typeof eventId === "string" ? parseInt(eventId) : eventId;

  const currentFilters: RegistrationFilters = useMemo(
    () => ({
      status: filters?.status,
      sortBy: filters?.sortBy || "applicationDate",
      sortDirection: filters?.sortDirection || "desc",
      page: filters?.page || pagination.page,
      size: filters?.size || pagination.size,
    }),
    [filters, pagination.page, pagination.size]
  );

  const loadRegistrations = useCallback(async () => {
    if (!numericEventId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await eventRegistrationService.getEventRegistrations(
        numericEventId,
        currentFilters.status,
        currentFilters.page,
        currentFilters.size
      );

      setRegistrations(result.items || []);
      // Only update pagination metadata, not page/size that would trigger a loop
      setPagination((prev) => ({
        ...prev,
        totalPages: result.totalPages || 0,
        totalItems: result.totalCount || 0,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [
    numericEventId,
    currentFilters.status,
    currentFilters.page,
    currentFilters.size,
  ]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Sync pagination with filters
  useEffect(() => {
    if (filters?.page !== undefined && filters.page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: filters.page || 1 }));
    }
    if (filters?.size !== undefined && filters.size !== pagination.size) {
      setPagination((prev) => ({ ...prev, size: filters.size || 10 }));
    }
  }, [filters?.page, filters?.size, pagination.page, pagination.size]);

  const handleApprove = async (
    registrationId: number,
    request: ApproveRegistrationRequestDTO
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.approveRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations();
    } catch (err) {
      console.error("Failed to approve registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (
    registrationId: number,
    request: RejectRegistrationRequestDTO
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.rejectRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations();
    } catch (err) {
      console.error("Failed to reject registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    if (onFiltersChange) {
      onFiltersChange({ page });
    }
  };

  const handleViewDetails = async (registration: RegistrationDTO) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const handleShowApprovalDialog = async (registration: RegistrationDTO) => {
    setSelectedRegistration(registration);
    setShowApproveModal(true);
  };

  const handleShowRejectionDialog = async (registration: RegistrationDTO) => {
    setSelectedRegistration(registration);
    setShowRejectModal(true);
  };

  const handleApproveSubmit = async (
    registrationId: number,
    request: ApproveRegistrationRequestDTO
  ) => {
    try {
      await handleApprove(registrationId, request);
      setShowApproveModal(false);
      setSelectedRegistration(null);
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleRejectSubmit = async (request: RejectRegistrationRequestDTO) => {
    if (!selectedRegistration) return;

    try {
      await handleReject(selectedRegistration.registrationId, request);
      setShowRejectModal(false);
      setSelectedRegistration(null);
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<RegistrationDTO>[] = useMemo(
    () => [
      {
        key: "user",
        header: "Volunteer",
        render: (_, registration) => renderUserInfo(registration),
      },
      {
        key: "statusName",
        header: "Status",
        render: (value) => (
          <Badge variant={getStatusBadgeVariant(value || "pending")}>
            {value || "Pending"}
          </Badge>
        ),
      },
      {
        key: "applicationDate",
        header: "Application Date",
        render: (value) => (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {value ? new Date(value).toLocaleDateString() : "N/A"}
          </div>
        ),
      },
      {
        key: "approvedDate",
        header: "Approved Date",
        render: (value) =>
          value ? new Date(value).toLocaleDateString() : "--",
      },
    ],
    []
  );

  // Define table actions
  const actions: TableAction<RegistrationDTO>[] = useMemo(
    () => [
      {
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleViewDetails,
        variant: "outline",
        tooltip: "View registration details",
      },
      {
        label: "Approve",
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: handleShowApprovalDialog,
        variant: "default",
        visible: (registration) =>
          registration.statusName?.toLowerCase() === "pending",
        tooltip: "Approve this registration",
      },
      {
        label: "Reject",
        icon: <XCircle className="h-4 w-4" />,
        onClick: handleShowRejectionDialog,
        variant: "destructive",
        visible: (registration) =>
          registration.statusName?.toLowerCase() === "pending",
        tooltip: "Reject this registration",
      },
    ],
    []
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Error loading registrations"
            description={error}
            show={true}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Registrations</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{pagination.totalItems} total</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRegistrations}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={registrations}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="No volunteer registrations found for this event."
            showPagination={true}
            pagination={{
              currentPage: pagination.page,
              totalPages: pagination.totalPages,
              pageSize: pagination.size,
              totalItems: pagination.totalItems,
              onPageChange: handlePageChange,
            }}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedRegistration && (
        <>
          <RegistrationDetailModal
            registration={selectedRegistration}
            open={showDetailModal}
            onOpenChange={setShowDetailModal}
          />

          <ApproveRegistrationModal
            open={showApproveModal}
            onOpenChange={setShowApproveModal}
            registration={selectedRegistration}
            onApprove={handleApproveSubmit}
            loading={actionLoading}
          />

          <RejectRegistrationModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            registration={selectedRegistration}
            onReject={handleRejectSubmit}
            isLoading={actionLoading}
          />
        </>
      )}
    </div>
  );
}
