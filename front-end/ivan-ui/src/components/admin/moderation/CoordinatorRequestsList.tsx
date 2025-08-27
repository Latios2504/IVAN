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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Coordinator Requests</h3>
            <p className="text-muted-foreground">
              No coordinator requests found for review.
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Coordinator Requests
        </CardTitle>
        <CardDescription>
          Review and manage coordinator creation requests from organizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Candidate Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
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