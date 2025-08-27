import { useEffect, useState } from "react";
import { eventsService } from "@/services/eventsService";
import { feedbackService } from "@/services/feedbackService";
import { coordinatorRequestService } from "@/services/coordinatorRequestService";
import type { RejectEventRequestDto } from "@/types/events";
import type { EventDto } from "@/types/events";
import type { FeedbackListDto, FeedbackListParams } from "@/types/feedback";
import type {
  CoordinatorRequestListItemDto,
  UpdateCoordinatorRequestDto,
} from "@/types/coordinatorRequest";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  CheckCircle,
  Calendar,
  Building2,
  RefreshCw,
  MessageSquare,
  Star,
  Users,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { toast } from "sonner";
import { EventDetailsModal } from "@/components/admin/moderation/EventDetailsModal";
import { ModerationEventsList } from "@/components/admin/moderation/ModerationEventsList";
import { RejectEventDialog } from "@/components/admin/moderation/RejectEventDialog";
import { FeedbackList } from "@/components/admin/moderation/FeedbackList";
import { FeedbackManagementModal } from "@/components/admin/moderation/FeedbackManagementModal";
import { CoordinatorRequestsList } from "@/components/admin/moderation/CoordinatorRequestsList";
import { CoordinatorRequestDetailsModal } from "@/components/admin/moderation/CoordinatorRequestDetailsModal";

interface ModerationStats {
  totalPendingEvents: number;
  eventsThisMonth: number;
  averageProcessingTime: string;
}

interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  feedbacksThisMonth: number;
}

interface CoordinatorRequestStats {
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
}

export default function ModerationManagementPage() {
  const { user: currentUser } = useAuth();

  // Trạng thái tab
  const [activeTab, setActiveTab] = useState("events");

  // Trạng thái kiểm duyệt sự kiện
  const [events, setEvents] = useState<EventDto[]>([]);

  // Trạng thái yêu cầu điều phối viên
  const [coordinatorRequests, setCoordinatorRequests] = useState<
    CoordinatorRequestListItemDto[]
  >([]);
  const [selectedCoordinatorRequest, setSelectedCoordinatorRequest] =
    useState<CoordinatorRequestListItemDto | null>(null);
  const [isCoordinatorRequestModalOpen, setIsCoordinatorRequestModalOpen] =
    useState(false);
  const [isProcessingCoordinatorRequest, setIsProcessingCoordinatorRequest] =
    useState(false);
  const [coordinatorRequestStats, setCoordinatorRequestStats] =
    useState<CoordinatorRequestStats>({
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      totalRequests: 0,
    });
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ModerationStats>({
    totalPendingEvents: 0,
    eventsThisMonth: 0,
    averageProcessingTime: "2-3 days",
  });

  // Trạng thái quản lý phản hồi
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackListDto | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    totalFeedbacks: 0,
    averageRating: 0,
    feedbacksThisMonth: 0,
  });

  // Trạng thái modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [eventToReject, setEventToReject] = useState<number | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(0);

  // Tải sự kiện để kiểm duyệt
  const loadEvents = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        size: pageSize,
        sortBy: "createdAt",
        sortDirection: "desc" as const,
        statusIds: [1], // Chỉ hiển thị sự kiện đang chờ phê duyệt
      };

      const response = await eventsService.getEvents(params);
      setEvents(response.items || []);
      setTotalCount(response.totalCount || 0);
      setCurrentPage(page);

      // Cập nhật thống kê
      setStats((prev) => ({
        ...prev,
        totalPendingEvents: response.totalCount || 0,
        eventsThisMonth:
          response.items?.filter((event) => {
            const eventDate = new Date(event.createdAt || event.startDate);
            const now = new Date();
            return (
              eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear()
            );
          }).length || 0,
      }));
    } catch (error) {
      console.error("Lỗi khi tải sự kiện:", error);
      toast.error("Không thể tải sự kiện để kiểm duyệt.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tải chi tiết sự kiện
  const loadEventDetails = async (eventId: number) => {
    try {
      setIsLoadingDetails(true);
      const details = await eventsService.getEvent(eventId);
      setSelectedEvent(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sự kiện:", error);
      toast.error("Không thể tải chi tiết sự kiện.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Xử lý phê duyệt sự kiện
  const handleApproveEvent = async (eventId: number) => {
    try {
      setIsProcessing(true);
      await eventsService.approveEvent(eventId);

      toast.success("Sự kiện đã được phê duyệt thành công.");

      // Làm mới danh sách sự kiện và đóng modal
      await loadEvents(currentPage);
      setIsDetailsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Lỗi khi phê duyệt sự kiện:", error);
      toast.error("Không thể phê duyệt sự kiện. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý từ chối sự kiện - mở dialog
  const handleRejectEvent = (eventId: number) => {
    setEventToReject(eventId);
    setIsRejectDialogOpen(true);
  };

  // Xác nhận từ chối sự kiện với lý do
  const confirmRejectEvent = async (reason: string) => {
    if (!eventToReject) return;

    try {
      setIsProcessing(true);
      const request: RejectEventRequestDto = { reason };
      await eventsService.rejectEvent(eventToReject, request);

      toast.success("Sự kiện đã được từ chối thành công.");

      // Làm mới danh sách sự kiện và đóng modal
      await loadEvents(currentPage);
      setIsRejectDialogOpen(false);
      setIsDetailsModalOpen(false);
      setEventToReject(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Lỗi khi từ chối sự kiện:", error);
      toast.error("Không thể từ chối sự kiện. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Tải phản hồi để quản lý
  const loadFeedbacks = async (page: number = 1) => {
    try {
      setIsFeedbackLoading(true);
      const params: FeedbackListParams = {
        pageNumber: page,
        pageSize,
      };

      const response = await feedbackService.getAllFeedbacks(params);
      setFeedbacks(response.items || []);
      setFeedbackTotalCount(response.totalCount || 0);
      setFeedbackCurrentPage(page);

      // Tính toán thống kê phản hồi
      const totalRating =
        response.items?.reduce((sum, feedback) => {
          return sum + (feedback.rating || 0);
        }, 0) || 0;
      const avgRating = response.items?.length
        ? totalRating / response.items.length
        : 0;

      setFeedbackStats({
        totalFeedbacks: response.totalCount || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        feedbacksThisMonth: response.items?.length || 0, // Đơn giản hóa tạm thời
      });
    } catch (error) {
      console.error("Lỗi khi tải phản hồi:", error);
      toast.error("Không thể tải phản hồi.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  // Xử lý xem chi tiết phản hồi
  const handleViewFeedbackDetails = (feedback: FeedbackListDto) => {
    setSelectedFeedback(feedback);
    setIsFeedbackModalOpen(true);
  };

  // Xử lý cập nhật phản hồi
  const handleFeedbackUpdate = () => {
    loadFeedbacks(feedbackCurrentPage);
  };

  // Tải yêu cầu điều phối viên
  const loadCoordinatorRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await coordinatorRequestService.getCoordinatorRequests();
      setCoordinatorRequests(requests);

      // Tính toán thống kê
      const stats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === "pending").length,
        approvedRequests: requests.filter((r) => r.status === "approved")
          .length,
        rejectedRequests: requests.filter((r) => r.status === "rejected")
          .length,
      };
      setCoordinatorRequestStats(stats);
    } catch (error) {
      console.error("Lỗi khi tải yêu cầu điều phối viên:", error);
      toast.error("Không thể tải yêu cầu điều phối viên.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xem chi tiết yêu cầu điều phối viên
  const handleViewCoordinatorRequestDetails = (
    request: CoordinatorRequestListItemDto
  ) => {
    setSelectedCoordinatorRequest(request);
    setIsCoordinatorRequestModalOpen(true);
  };

  // Xử lý phê duyệt yêu cầu điều phối viên
  const handleApproveCoordinatorRequest = async (
    requestId: string,
    note?: string
  ) => {
    try {
      setIsProcessingCoordinatorRequest(true);
      const updateData: UpdateCoordinatorRequestDto = {
        action: "approve",
        note: note || undefined,
      };

      await coordinatorRequestService.updateCoordinatorRequest(
        Number(requestId),
        updateData
      );
      toast.success("Yêu cầu điều phối viên đã được phê duyệt thành công.");

      // Làm mới danh sách và đóng modal
      await loadCoordinatorRequests();
      setIsCoordinatorRequestModalOpen(false);
      setSelectedCoordinatorRequest(null);
    } catch (error) {
      console.error("Lỗi khi phê duyệt yêu cầu điều phối viên:", error);
      toast.error(
        "Không thể phê duyệt yêu cầu điều phối viên. Vui lòng thử lại."
      );
    } finally {
      setIsProcessingCoordinatorRequest(false);
    }
  };

  // Xử lý từ chối yêu cầu điều phối viên
  const handleRejectCoordinatorRequest = async (
    requestId: string,
    note: string
  ) => {
    try {
      setIsProcessingCoordinatorRequest(true);
      const updateData: UpdateCoordinatorRequestDto = {
        action: "reject",
        note,
      };

      await coordinatorRequestService.updateCoordinatorRequest(
        Number(requestId),
        updateData
      );
      toast.success("Yêu cầu điều phối viên đã được từ chối.");

      // Làm mới danh sách và đóng modal
      await loadCoordinatorRequests();
      setIsCoordinatorRequestModalOpen(false);
      setSelectedCoordinatorRequest(null);
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu điều phối viên:", error);
      toast.error(
        "Không thể từ chối yêu cầu điều phối viên. Vui lòng thử lại."
      );
    } finally {
      setIsProcessingCoordinatorRequest(false);
    }
  };

  // Xử lý làm mới
  const handleRefresh = () => {
    if (activeTab === "events") {
      loadEvents(currentPage);
    } else if (activeTab === "feedbacks") {
      loadFeedbacks(feedbackCurrentPage);
    } else if (activeTab === "coordinator-requests") {
      loadCoordinatorRequests();
    }
  };

  // Xử lý thay đổi tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "feedbacks" && feedbacks.length === 0) {
      loadFeedbacks();
    } else if (
      value === "coordinator-requests" &&
      coordinatorRequests.length === 0
    ) {
      loadCoordinatorRequests();
    }
  };

  // Tải ban đầu
  useEffect(() => {
    loadEvents();
  }, []);

  // Kiểm tra xem người dùng có phải admin không
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Truy cập bị từ chối
              </h2>
              <p className="text-muted-foreground">
                Bạn không có quyền truy cập trang này.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Kiểm duyệt quản trị
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý sự kiện, phản hồi và yêu cầu điều phối viên
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Các tab */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Kiểm duyệt sự kiện
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Quản lý phản hồi
          </TabsTrigger>
          <TabsTrigger
            value="coordinator-requests"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Yêu cầu điều phối viên
          </TabsTrigger>
        </TabsList>

        {/* Tab kiểm duyệt sự kiện */}
        <TabsContent value="events" className="space-y-6">
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Sự kiện chờ duyệt"
              value={stats.totalPendingEvents}
              description="Sự kiện đang chờ xem xét"
              icon={Calendar}
            />
            <StatsCard
              title="Tháng này"
              value={stats.eventsThisMonth}
              description="Sự kiện được gửi trong tháng này"
              icon={Building2}
            />
            <StatsCard
              title="Thời gian xử lý TB"
              value={stats.averageProcessingTime}
              description="Thời gian xem xét trung bình"
              icon={CheckCircle}
            />
          </div>

          {/* Danh sách sự kiện */}
          <ModerationEventsList
            events={events}
            onViewDetails={loadEventDetails}
            isLoading={isLoading}
          />

          {/* Phân trang */}
          {totalCount > pageSize && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => loadEvents(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {Math.ceil(totalCount / pageSize)}
              </span>
              <Button
                variant="outline"
                onClick={() => loadEvents(currentPage + 1)}
                disabled={
                  currentPage >= Math.ceil(totalCount / pageSize) || isLoading
                }
              >
                Sau
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab quản lý phản hồi */}
        <TabsContent value="feedbacks" className="space-y-6">
          {/* Thẻ thống kê phản hồi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Tổng phản hồi"
              value={feedbackStats.totalFeedbacks}
              description="Tất cả phản hồi đã nhận"
              icon={MessageSquare}
            />
            <StatsCard
              title="Đánh giá trung bình"
              value={feedbackStats.averageRating}
              description="Trên thang điểm 5 sao"
              icon={Star}
            />
            <StatsCard
              title="Phản hồi gần đây"
              value={feedbackStats.feedbacksThisMonth}
              description="Trong kỳ này"
              icon={Calendar}
            />
          </div>

          {/* Danh sách phản hồi */}
          <FeedbackList
            feedbacks={feedbacks}
            onViewDetails={handleViewFeedbackDetails}
            isLoading={isFeedbackLoading}
          />

          {/* Phân trang phản hồi */}
          {feedbackTotalCount > pageSize && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => loadFeedbacks(feedbackCurrentPage - 1)}
                disabled={feedbackCurrentPage <= 1 || isFeedbackLoading}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {feedbackCurrentPage} /{" "}
                {Math.ceil(feedbackTotalCount / pageSize)}
              </span>
              <Button
                variant="outline"
                onClick={() => loadFeedbacks(feedbackCurrentPage + 1)}
                disabled={
                  feedbackCurrentPage >=
                    Math.ceil(feedbackTotalCount / pageSize) ||
                  isFeedbackLoading
                }
              >
                Sau
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab yêu cầu điều phối viên */}
        <TabsContent value="coordinator-requests" className="space-y-6">
          {/* Thẻ thống kê yêu cầu điều phối viên */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Tổng yêu cầu"
              value={coordinatorRequestStats.totalRequests}
              description="Tất cả yêu cầu điều phối viên"
              icon={Users}
            />
            <StatsCard
              title="Chờ duyệt"
              value={coordinatorRequestStats.pendingRequests}
              description="Đang chờ xem xét"
              icon={AlertCircle}
            />
            <StatsCard
              title="Đã phê duyệt"
              value={coordinatorRequestStats.approvedRequests}
              description="Đã được phê duyệt thành công"
              icon={UserCheck}
            />
            <StatsCard
              title="Đã từ chối"
              value={coordinatorRequestStats.rejectedRequests}
              description="Yêu cầu bị từ chối"
              icon={AlertCircle}
            />
          </div>

          {/* Danh sách yêu cầu điều phối viên */}
          <CoordinatorRequestsList
            requests={coordinatorRequests}
            onViewDetails={handleViewCoordinatorRequestDetails}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Modal chi tiết sự kiện */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        onApprove={handleApproveEvent}
        onReject={handleRejectEvent}
        isLoading={isProcessing || isLoadingDetails}
      />

      {/* Dialog từ chối sự kiện */}
      <RejectEventDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setEventToReject(null);
        }}
        onConfirm={confirmRejectEvent}
        eventName={selectedEvent?.eventName}
        isLoading={isProcessing}
      />

      {/* Modal quản lý phản hồi */}
      <FeedbackManagementModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        feedback={selectedFeedback}
        onUpdate={handleFeedbackUpdate}
      />

      {/* Modal chi tiết yêu cầu điều phối viên */}
      <CoordinatorRequestDetailsModal
        request={selectedCoordinatorRequest}
        isOpen={isCoordinatorRequestModalOpen}
        onClose={() => {
          setIsCoordinatorRequestModalOpen(false);
          setSelectedCoordinatorRequest(null);
        }}
        onApprove={handleApproveCoordinatorRequest}
        onReject={handleRejectCoordinatorRequest}
        isLoading={isProcessingCoordinatorRequest}
      />
    </div>
  );
}
