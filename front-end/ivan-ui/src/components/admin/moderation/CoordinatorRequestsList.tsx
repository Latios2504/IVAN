import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/common/LoadingState";
import {
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { coordinatorRequestService } from "@/services/coordinatorRequestService";
import type { CoordinatorRequestListItemDto } from "@/types/coordinatorRequest";

interface CoordinatorRequestsListProps {
  requests: CoordinatorRequestListItemDto[];
  onViewDetails: (request: CoordinatorRequestListItemDto) => void;
  isLoading: boolean;
}

export const CoordinatorRequestsList: React.FC<CoordinatorRequestsListProps> = ({
  requests,
  onViewDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  if (requests.length === 0) {
    return (
      <Card className="card-hover rounded-2xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Không có yêu cầu điều phối viên</h3>
            <p className="text-muted-foreground">
              Không tìm thấy yêu cầu điều phối viên nào để xem xét.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const formatDate = (dateString: string) => {
    return coordinatorRequestService.formatRequestDate(dateString);
  };

  return (
    <Card className="card-hover rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Yêu cầu điều phối viên
        </CardTitle>
        <CardDescription>
          Xem xét và quản lý các yêu cầu tạo điều phối viên từ các tổ chức
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Email ứng viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.requestId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Org #{request.organizationId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{request.candidateEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(request.submittedAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(request)}
                      className="flex items-center gap-2 rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
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