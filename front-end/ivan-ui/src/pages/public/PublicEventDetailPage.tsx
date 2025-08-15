import { useParams, Link, useNavigate } from "react-router-dom";
import { eventsService } from "@/services/eventsService";
import { feedbackService } from "@/services/feedbackService";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { PublicDetailPageLayout } from "@/components/public/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { EventDto } from "@/types/events";
import type { FeedbackCreateDto } from "@/types/feedback";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  Building2,
  Heart,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Target,
  Eye,
  UserPlus,
  MessageSquare,
} from "lucide-react";

export default function PublicEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feedback form state
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackCreateDto>({
    eventId: 0,
    categoryId: 1,
    subject: "",
    content: "",
    rating: 5,
    isAnonymous: false,
    isPublic: true,
    attachmentUrls: null,
  });

  // Predefined feedback categories based on database data
  const feedbackCategories = [
    {
      id: 1,
      name: "Tổ chức sự kiện",
      description: "Phản hồi về cách tổ chức và điều phối sự kiện",
    },
    {
      id: 2,
      name: "Nội dung chương trình",
      description: "Đánh giá về nội dung và chất lượng chương trình",
    },
    {
      id: 3,
      name: "Cơ sở vật chất",
      description: "Phản hồi về địa điểm, thiết bị, tiện ích",
    },
    {
      id: 4,
      name: "Đội ngũ tổ chức",
      description: "Đánh giá về thái độ và năng lực của BTC",
    },
    {
      id: 5,
      name: "Truyền thông",
      description: "Phản hồi về hoạt động truyền thông, quảng bá",
    },
    {
      id: 6,
      name: "Đăng ký tham gia",
      description: "Phản hồi về quy trình đăng ký và xác nhận",
    },
    {
      id: 7,
      name: "Khác",
      description: "Các phản hồi khác không thuộc danh mục trên",
    },
  ];

  useEffect(() => {
    if (id) {
      const loadEvent = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await eventsService.getEvent(Number(id));
          setEvent(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load event");
        } finally {
          setLoading(false);
        }
      };

      loadEvent();
    }
  }, [id]);

  const handleRetry = () => {
    if (id) {
      const loadEvent = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await eventsService.getEvent(Number(id));
          setEvent(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load event");
        } finally {
          setLoading(false);
        }
      };

      loadEvent();
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sự kiện", href: "/events" },
    { label: event?.eventName || "Loading...", isActive: true },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "active":
      case "đang hoạt động":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "pending":
      case "chờ duyệt":
        return (
          <Badge className="bg-yellow-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "completed":
      case "hoàn thành":
        return (
          <Badge className="bg-blue-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "cancelled":
      case "hủy bỏ":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Hủy bỏ
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white">
            <Info className="w-3 h-3 mr-1" />
            {statusName}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (isUrgent: boolean) => {
    if (isUrgent) {
      return (
        <Badge className="bg-red-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Khẩn cấp
        </Badge>
      );
    }
    return null;
  };

  // Check if event is completed
  const isEventCompleted = (event: EventDto) => {
    if (!event.statusName) return false;
    const status = event.statusName.toLowerCase();
    return status === "completed" || status === "hoàn thành";
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async () => {
    if (!event || !isAuthenticated || !user) {
      toast.error("Bạn cần đăng nhập để gửi phản hồi");
      return;
    }

    if (!feedbackForm.subject.trim() || !feedbackForm.content.trim()) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung phản hồi");
      return;
    }

    setFeedbackLoading(true);
    try {
      const feedbackData: FeedbackCreateDto = {
        ...feedbackForm,
        eventId: Number(id),
      };

      await feedbackService.createFeedback(feedbackData);
      toast.success("Gửi phản hồi thành công! Cảm ơn bạn đã đóng góp ý kiến.");

      // Reset form and close dialog
      setFeedbackForm({
        eventId: 0,
        categoryId: 1,
        subject: "",
        content: "",
        rating: 5,
        isAnonymous: false,
        isPublic: true,
        attachmentUrls: null,
      });
      setFeedbackDialogOpen(false);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi phản hồi"
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicDetailPageLayout
        title="Đang tải..."
        description="Đang tải thông tin sự kiện..."
        breadcrumbs={breadcrumbs}
        loading={true}
        error={null}
        data={null}
      >
        <div />
      </PublicDetailPageLayout>
    );
  }

  if (error) {
    return (
      <PublicDetailPageLayout
        title="Lỗi"
        description="Không thể tải thông tin sự kiện"
        breadcrumbs={breadcrumbs}
        loading={false}
        error={error}
        data={null}
        onRetry={handleRetry}
      >
        <div />
      </PublicDetailPageLayout>
    );
  }

  if (!event) {
    return (
      <PublicDetailPageLayout
        title="Không tìm thấy"
        description="Sự kiện không tồn tại hoặc đã bị xóa"
        breadcrumbs={breadcrumbs}
        loading={false}
        error={null}
        data={null}
      >
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy sự kiện
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Sự kiện bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <div className="mt-6">
            <Link to="/events">
              <Button>Quay lại danh sách sự kiện</Button>
            </Link>
          </div>
        </div>
      </PublicDetailPageLayout>
    );
  }

  return (
    <PublicDetailPageLayout
      title={event.eventName}
      description={event.description}
      breadcrumbs={breadcrumbs}
      loading={false}
      error={null}
      data={event}
    >
      <div className="space-y-6">
        {/* Event Header Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{event.eventName}</CardTitle>
                {event.shortDescription && (
                  <p className="text-lg text-muted-foreground">
                    {event.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {getStatusBadge(event.statusName || "")}
                  {getPriorityBadge(event.isUrgent || false)}
                  {event.categoryName && (
                    <Badge variant="outline">{event.categoryName}</Badge>
                  )}
                  {event.isFeatured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Nổi bật
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>0 lượt xem</span>
                </div>
                {event.isUrgent && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>Khẩn cấp</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Ngày bắt đầu</p>
                  <p className="text-sm text-gray-600">
                    {event.startDate
                      ? formatDate(event.startDate)
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Ngày kết thúc</p>
                  <p className="text-sm text-gray-600">
                    {event.endDate
                      ? formatDate(event.endDate)
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Thời gian</p>
                  <p className="text-sm text-gray-600">
                    {event.startDate
                      ? formatTime(event.startDate)
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Địa điểm</p>
                  <p className="text-sm text-gray-600">
                    {event.location ||
                      [event.detailedAddress, event.district, event.province]
                        .filter(Boolean)
                        .join(", ") ||
                      "Chưa xác định"}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Period */}
            {(event.registrationStartDate || event.registrationEndDate) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Thời gian đăng ký
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {event.registrationStartDate && (
                    <div>
                      <span className="text-blue-700">Bắt đầu: </span>
                      <span className="text-blue-900">
                        {formatDate(event.registrationStartDate)}
                      </span>
                    </div>
                  )}
                  {event.registrationEndDate && (
                    <div>
                      <span className="text-blue-700">Kết thúc: </span>
                      <span className="text-blue-900">
                        {formatDate(event.registrationEndDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Organization Info */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Tổ chức</p>
                  <p className="text-purple-700 font-semibold">
                    {event.organizationName || "Chưa xác định"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Thông tin tình nguyện viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {event.maxVolunteers || 0}
                </p>
                <p className="text-sm text-gray-600">Cần tuyển tối đa</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {event.minVolunteers || 0}
                </p>
                <p className="text-sm text-gray-600">Cần tuyển tối thiểu</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <User className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-sm text-gray-600">Đã đăng ký</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {(event.maxVolunteers || 0) - 0}
                </p>
                <p className="text-sm text-gray-600">Còn lại</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList
            className={`grid w-full ${
              isEventCompleted(event)
                ? event.galleryImages
                  ? "grid-cols-6"
                  : "grid-cols-5"
                : event.galleryImages
                ? "grid-cols-5"
                : "grid-cols-4"
            }`}
          >
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
            <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
            {event.galleryImages && (
              <TabsTrigger value="gallery">Hình ảnh</TabsTrigger>
            )}
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
            {isEventCompleted(event) && (
              <TabsTrigger value="feedback">Phản hồi</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mô tả sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: event.description || "Không có mô tả chi tiết.",
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yêu cầu tham gia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Yêu cầu kỹ năng:</h4>
                    <p className="text-gray-600">
                      {event.requiredSkills ||
                        "Không có yêu cầu kỹ năng đặc biệt"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Độ tuổi:</h4>
                    <p className="text-gray-600">
                      {event.ageRequirement || "Không giới hạn độ tuổi"}
                    </p>
                  </div>
                  {event.genderRequirement && (
                    <div>
                      <h4 className="font-medium mb-2">Giới tính:</h4>
                      <p className="text-gray-600">{event.genderRequirement}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-2">Yêu cầu khác:</h4>
                    <p className="text-gray-600">
                      {event.requirements || "Không có yêu cầu đặc biệt"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quyền lợi và lợi ích</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      event.benefits || "Không có thông tin về quyền lợi.",
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          {event.galleryImages && (
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.galleryImages
                      .split(",")
                      .filter((img) => img.trim())
                      .map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.trim()}
                            alt={`${event.eventName} - Hình ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Tổ chức:</h4>
                    <p className="text-gray-600">{event.organizationName}</p>
                  </div>
                  {event.contactPerson && (
                    <div>
                      <h4 className="font-medium mb-2">Người liên hệ:</h4>
                      <p className="text-gray-600">{event.contactPerson}</p>
                    </div>
                  )}
                  {event.contactEmail && (
                    <div>
                      <h4 className="font-medium mb-2">Email:</h4>
                      <p className="text-gray-600">{event.contactEmail}</p>
                    </div>
                  )}
                  {event.contactPhone && (
                    <div>
                      <h4 className="font-medium mb-2">Số điện thoại:</h4>
                      <p className="text-gray-600">{event.contactPhone}</p>
                    </div>
                  )}
                  {!event.contactPerson &&
                    !event.contactEmail &&
                    !event.contactPhone && (
                      <div>
                        <p className="text-gray-600">
                          Liên hệ trực tiếp với tổ chức qua trang chủ
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {isEventCompleted(event) && (
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Phản hồi về sự kiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-8 bg-green-50 rounded-lg">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Sự kiện đã hoàn thành
                      </h3>
                      <p className="text-green-700 mb-4">
                        Sự kiện "{event.eventName}" đã kết thúc thành công. Cảm
                        ơn bạn đã tham gia!
                      </p>
                      {isAuthenticated ? (
                        <Dialog
                          open={feedbackDialogOpen}
                          onOpenChange={setFeedbackDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Gửi phản hồi về sự kiện
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Gửi phản hồi về sự kiện</DialogTitle>
                              <DialogDescription>
                                Chia sẻ trải nghiệm và góp ý của bạn về sự kiện
                                "{event.eventName}"
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Category Selection */}
                              <div className="space-y-2">
                                <Label htmlFor="category">Loại phản hồi</Label>
                                <Select
                                  value={feedbackForm.categoryId.toString()}
                                  onValueChange={(value) =>
                                    setFeedbackForm({
                                      ...feedbackForm,
                                      categoryId: parseInt(value),
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại phản hồi" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {feedbackCategories.map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Subject */}
                              <div className="space-y-2">
                                <Label htmlFor="subject">
                                  Tiêu đề phản hồi
                                </Label>
                                <Input
                                  id="subject"
                                  value={feedbackForm.subject}
                                  onChange={(e) =>
                                    setFeedbackForm({
                                      ...feedbackForm,
                                      subject: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập tiêu đề cho phản hồi của bạn"
                                />
                              </div>

                              {/* Content */}
                              <div className="space-y-2">
                                <Label htmlFor="content">
                                  Nội dung phản hồi
                                </Label>
                                <Textarea
                                  id="content"
                                  value={feedbackForm.content}
                                  onChange={(e) =>
                                    setFeedbackForm({
                                      ...feedbackForm,
                                      content: e.target.value,
                                    })
                                  }
                                  placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
                                  rows={4}
                                />
                              </div>

                              {/* Rating */}
                              <div className="space-y-2">
                                <Label htmlFor="rating">
                                  Đánh giá sự kiện (1-5 sao)
                                </Label>
                                <Select
                                  value={feedbackForm.rating?.toString() || "5"}
                                  onValueChange={(value) =>
                                    setFeedbackForm({
                                      ...feedbackForm,
                                      rating: parseInt(value),
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn số sao" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <SelectItem
                                        key={star}
                                        value={star.toString()}
                                      >
                                        <div className="flex items-center">
                                          {Array.from({ length: star }).map(
                                            (_, i) => (
                                              <Star
                                                key={i}
                                                className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1"
                                              />
                                            )
                                          )}
                                          <span className="ml-2">
                                            {star} sao
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Privacy Options */}
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="anonymous"
                                    checked={feedbackForm.isAnonymous || false}
                                    onCheckedChange={(checked) =>
                                      setFeedbackForm({
                                        ...feedbackForm,
                                        isAnonymous: !!checked,
                                      })
                                    }
                                  />
                                  <Label
                                    htmlFor="anonymous"
                                    className="text-sm"
                                  >
                                    Gửi phản hồi ẩn danh
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="public"
                                    checked={feedbackForm.isPublic || false}
                                    onCheckedChange={(checked) =>
                                      setFeedbackForm({
                                        ...feedbackForm,
                                        isPublic: !!checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor="public" className="text-sm">
                                    Cho phép hiển thị công khai
                                  </Label>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setFeedbackDialogOpen(false)}
                                  disabled={feedbackLoading}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  onClick={handleFeedbackSubmit}
                                  disabled={feedbackLoading}
                                >
                                  {feedbackLoading
                                    ? "Đang gửi..."
                                    : "Gửi phản hồi"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <p className="text-green-600">
                          <Link to="/login" className="underline">
                            Đăng nhập
                          </Link>{" "}
                          để gửi phản hồi về sự kiện
                        </p>
                      )}
                    </div>

                    {/* Placeholder for existing feedback display */}
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>
                        Phần hiển thị phản hồi từ người tham gia sẽ được thêm
                        vào sau
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {/* Show registration button only for volunteers and if event is not completed */}
          {isAuthenticated &&
            user?.role === "volunteer" &&
            !isEventCompleted(event) && (
              <Button
                size="lg"
                className="px-8"
                onClick={() => navigate(`/volunteer/events/${id}/register`)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký tham gia
              </Button>
            )}

          {/* Show feedback button only for completed events */}
          {isEventCompleted(event) && (
            <Button
              size="lg"
              className="px-8"
              onClick={() => {
                // Scroll to feedback tab and activate it
                const feedbackTab = document.querySelector(
                  '[value="feedback"]'
                ) as HTMLElement;
                feedbackTab?.click();
                setTimeout(() => {
                  document
                    .querySelector('[value="feedback"]')
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Xem phản hồi
            </Button>
          )}

          <Button variant="outline" size="lg">
            Chia sẻ
          </Button>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
}
