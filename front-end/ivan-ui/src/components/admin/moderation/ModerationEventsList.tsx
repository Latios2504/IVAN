import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Calendar, Building2, MapPin, Users, Tag } from 'lucide-react';
import type { EventDto } from '@/types/events';

interface ModerationEventsListProps {
  events: EventDto[];
  onViewDetails: (eventId: number) => void;
  isLoading?: boolean;
}

export const ModerationEventsList: React.FC<ModerationEventsListProps> = ({
  events,
  onViewDetails,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sự kiện chờ kiểm duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sự kiện chờ kiểm duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có sự kiện nào chờ kiểm duyệt.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sự kiện chờ kiểm duyệt
          <Badge variant="secondary" className="ml-2">
            {events.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID Sự kiện</TableHead>
                <TableHead>Tên sự kiện</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Tối đa TNV</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell className="font-medium">
                    <Badge variant="outline">#{event.eventId}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{event.eventName}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.organizationName || 'Không có'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.categoryName || 'Không có'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.location || 'Không có'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(event.startDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.endDate && formatDate(event.endDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.maxVolunteers || 'Không có'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={event.statusName === 'Pending Approval' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {event.statusName || 'Không rõ'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(event.eventId)}
                      className="flex items-center gap-2"
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

export default ModerationEventsList;