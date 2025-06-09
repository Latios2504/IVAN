import { useState } from "react";
import {
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Search,
  FileText,
  Award,
  Users,
  CalendarPlus,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type {
  Event,
  OrganizationVolunteer,
  Certificate,
  EventFormData,
  VolunteerApplicationUpdateData,
  CertificateFormData,
  EventStatus,
  VolunteerApplicationStatus,
} from "@/types/organization";
import { UserRole } from "@/types/auth";
import type { OrganizationProfile } from "@/types/profile";

// Mock data (can be moved to a separate file later)
const mockEventsData: Event[] = [
  {
    id: "event_001",
    title: "Chương trình giáo dục trẻ em vùng cao",
    description:
      "Tổ chức hoạt động giáo dục và tặng quà cho trẻ em vùng cao tại các điểm trường khó khăn ở Hà Giang.",
    category: "Giáo dục",
    date: "2025-07-20",
    time: "08:00 - 17:00",
    location: "Hà Giang",
    status: "upcoming",
    volunteers: { registered: 25, confirmed: 20, max: 30, needed: 10 },
    coordinator: "Nguyễn Văn An",
    organizationId: "org_001",
    registrationDeadline: "2025-07-10",
    tasks: ["Dạy học", "Tổ chức trò chơi", "Phát quà"],
    requirements: ["Có kinh nghiệm giảng dạy", "Yêu trẻ em"],
    createdDate: "2025-06-01",
  },
  {
    id: "event_002",
    title: "Dọn dẹp bãi biển Hạ Long",
    description:
      "Chung tay làm sạch bãi biển, thu gom rác thải nhựa để bảo vệ môi trường biển.",
    category: "Môi trường",
    date: "2025-08-05",
    time: "07:00 - 11:00",
    location: "Bãi Cháy, Hạ Long, Quảng Ninh",
    status: "planning",
    volunteers: { registered: 15, confirmed: 10, max: 50, needed: 40 },
    organizationId: "org_001",
    createdDate: "2025-06-10",
  },
  {
    id: "event_003",
    title: "Hỗ trợ người già neo đơn",
    description:
      "Thăm hỏi, tặng quà và giúp đỡ công việc nhà cho các cụ già neo đơn tại địa phương.",
    category: "Cộng đồng",
    date: "2025-06-15", // Past event
    time: "09:00 - 16:00",
    location: "Quận Hai Bà Trưng, Hà Nội",
    status: "completed",
    volunteers: { registered: 30, confirmed: 30, max: 30, needed: 0 },
    coordinator: "Trần Thị Bình",
    organizationId: "org_001",
    createdDate: "2025-05-01",
  },
];

const mockVolunteersData: OrganizationVolunteer[] = [
  {
    id: "vol_001",
    userId: "user_101",
    fullName: "Lê Minh Khôi",
    email: "minhkhoi.le@example.com",
    phoneNumber: "0901234567",
    applicationDate: "2025-06-05",
    status: "pending",
    assignedEventId: "event_001",
    assignedEventTitle: "Chương trình giáo dục trẻ em vùng cao",
    skills: ["Giảng dạy", "Giao tiếp"],
    motivationLetter: "Tôi rất mong muốn được đóng góp cho cộng đồng...",
  },
  {
    id: "vol_002",
    userId: "user_102",
    fullName: "Phạm Thuỳ Dương",
    email: "thuyduong.pham@example.com",
    phoneNumber: "0987654321",
    applicationDate: "2025-06-10",
    status: "approved",
    assignedEventId: "event_003",
    assignedEventTitle: "Hỗ trợ người già neo đơn",
    skills: ["Chăm sóc người già", "Nấu ăn"],
  },
  {
    id: "vol_003",
    userId: "user_103",
    fullName: "Hoàng Quốc Việt",
    email: "quocviet.hoang@example.com",
    applicationDate: "2025-06-12",
    status: "rejected",
    notes: "Không phù hợp với yêu cầu sự kiện hiện tại.",
  },
];

const mockCertificatesData: Certificate[] = [
  {
    id: "cert_001",
    volunteerId: "user_102",
    volunteerName: "Phạm Thuỳ Dương",
    eventId: "event_003",
    eventName: "Hỗ trợ người già neo đơn",
    issueDate: "2025-06-20",
    description:
      "Hoàn thành xuất sắc 30 giờ tình nguyện trong sự kiện hỗ trợ người già neo đơn.",
    issuedBy: "Tổ chức Tình Nguyện X",
    certificateUrl: "#", // Placeholder
  },
];

const EVENT_STATUS_OPTIONS: {
  value: EventStatus;
  label: string;
}[] = [
  { value: "upcoming", label: "Sắp diễn ra" },
  { value: "planning", label: "Đang lên kế hoạch" },
  { value: "in_progress", label: "Đang diễn ra" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const VOLUNTEER_APPLICATION_STATUS_OPTIONS: {
  value: VolunteerApplicationStatus;
  label: string;
}[] = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "waitlisted", label: "Danh sách chờ" },
];

const EVENT_CATEGORIES = [
  "Giáo dục",
  "Y tế",
  "Môi trường",
  "Cộng đồng",
  "Thể thao",
  "Nghệ thuật",
  "Khác",
];

export default function OrganizationManagementPage() {
  const { user } = useAuth();
  const organizationName =
    user?.role === UserRole.ORGANIZATION &&
    user.profile &&
    "organizationName" in user.profile
      ? (user.profile as OrganizationProfile).organizationName
      : "Tổ chức IVAN";

  const [events, setEvents] = useState<Event[]>(
    mockEventsData.map((event) => ({
      ...event,
      organizationId: user?.organizationId?.toString() || "org_001",
    }))
  );
  const [volunteers, setVolunteers] =
    useState<OrganizationVolunteer[]>(mockVolunteersData);
  const [certificates, setCertificates] =
    useState<Certificate[]>(mockCertificatesData);

  const [searchTermEvents, setSearchTermEvents] = useState("");
  const [searchTermVolunteers, setSearchTermVolunteers] = useState("");
  const [searchTermCertificates, setSearchTermCertificates] = useState("");

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState<EventFormData | null>(
    null
  );

  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] =
    useState<OrganizationVolunteer | null>(null);
  const [volunteerFormData, setVolunteerFormData] =
    useState<VolunteerApplicationUpdateData | null>(null);

  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] =
    useState<Certificate | null>(null);
  const [certificateFormData, setCertificateFormData] =
    useState<CertificateFormData | null>(null);

  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "view"
  );

  // Filtered data
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTermEvents.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTermEvents.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTermEvents.toLowerCase())
  );

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.fullName
        .toLowerCase()
        .includes(searchTermVolunteers.toLowerCase()) ||
      volunteer.email
        .toLowerCase()
        .includes(searchTermVolunteers.toLowerCase()) ||
      (volunteer.assignedEventTitle &&
        volunteer.assignedEventTitle
          .toLowerCase()
          .includes(searchTermVolunteers.toLowerCase()))
  );

  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.volunteerName
        .toLowerCase()
        .includes(searchTermCertificates.toLowerCase()) ||
      certificate.eventName
        .toLowerCase()
        .includes(searchTermCertificates.toLowerCase())
  );

  // Event Dialog Handlers
  const handleOpenEventDialog = (
    mode: "create" | "edit" | "view",
    event?: Event
  ) => {
    setDialogMode(mode);
    setCurrentEvent(event || null);
    if (mode === "create") {
      setEventFormData({
        title: "",
        description: "",
        category: EVENT_CATEGORIES[0],
        date: "",
        time: "",
        location: "",
        status: "planning",
        maxVolunteers: 10,
        registrationDeadline: "",
        tasks: "",
        requirements: "",
      });
    } else if (event) {
      setEventFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        status: event.status,
        maxVolunteers: event.volunteers.max,
        registrationDeadline: event.registrationDeadline || "",
        tasks: event.tasks?.join(", ") || "",
        requirements: event.requirements?.join(", ") || "",
      });
    }
    setIsEventDialogOpen(true);
  };

  const handleEventFormChange = (
    field: keyof EventFormData,
    value: string | number | EventStatus
  ) => {
    setEventFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSaveEvent = () => {
    if (!eventFormData) return;
    // TODO: Add validation
    const newEventData: Partial<Event> = {
      ...eventFormData,
      tasks: eventFormData.tasks
        ?.split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      requirements: eventFormData.requirements
        ?.split(",")
        .map((r) => r.trim())
        .filter((r) => r),
      volunteers: {
        // Basic structure, might need more details from form
        registered: currentEvent?.volunteers.registered || 0,
        confirmed: currentEvent?.volunteers.confirmed || 0,
        max: Number(eventFormData.maxVolunteers),
        // Calculate needed based on new max and current confirmed
        needed: Math.max(
          0,
          Number(eventFormData.maxVolunteers) -
            (currentEvent?.volunteers.confirmed || 0)
        ),
      },
      organizationId: user?.organizationId?.toString() || "org_001",
    };

    if (dialogMode === "create") {
      setEvents((prev) => [
        ...prev,
        {
          ...newEventData,
          id: `event_${Date.now()}`,
          createdDate: new Date().toISOString().split("T")[0],
        } as Event,
      ]);
    } else if (currentEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id ? ({ ...e, ...newEventData } as Event) : e
        )
      );
    }
    setIsEventDialogOpen(false);
    setCurrentEvent(null);
    setEventFormData(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Add confirmation dialog here if needed
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Volunteer Dialog Handlers
  const handleOpenVolunteerDialog = (
    mode: "view" | "edit",
    volunteer: OrganizationVolunteer
  ) => {
    setDialogMode(mode);
    setCurrentVolunteer(volunteer);
    if (mode === "edit") {
      setVolunteerFormData({
        status: volunteer.status,
        notes: volunteer.notes || "",
        assignedEventId: volunteer.assignedEventId || "",
      });
    } else {
      setVolunteerFormData(null); // Clear form data for view mode
    }
    setIsVolunteerDialogOpen(true);
  };

  const handleVolunteerFormChange = (
    field: keyof VolunteerApplicationUpdateData,
    value: string
  ) => {
    setVolunteerFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSaveVolunteerUpdate = () => {
    if (!volunteerFormData || !currentVolunteer) return;
    // TODO: Add validation
    const updatedVolunteer = {
      ...currentVolunteer,
      ...volunteerFormData,
      assignedEventTitle: volunteerFormData.assignedEventId
        ? events.find((e) => e.id === volunteerFormData.assignedEventId)?.title
        : undefined,
    };
    setVolunteers((prev) =>
      prev.map((v) => (v.id === currentVolunteer.id ? updatedVolunteer : v))
    );
    setIsVolunteerDialogOpen(false);
    setCurrentVolunteer(null);
    setVolunteerFormData(null);
  };

  // Certificate Dialog Handlers
  const handleOpenCertificateDialog = (
    mode: "create" | "view",
    certificate?: Certificate,
    volunteer?: OrganizationVolunteer
  ) => {
    setDialogMode(mode);
    setCurrentCertificate(certificate || null);
    if (mode === "create" && volunteer) {
      // Pre-fill for new certificate based on selected volunteer and their completed events
      const completedEvent = events.find(
        (e) => e.id === volunteer.assignedEventId && e.status === "completed"
      );
      setCertificateFormData({
        volunteerId: volunteer.userId,
        eventId: completedEvent?.id || "",
        description: completedEvent
          ? `Hoàn thành xuất sắc sự kiện "${completedEvent.title}"`
          : "",
      });
    } else if (certificate) {
      setCertificateFormData({
        // For viewing existing certificate
        volunteerId: certificate.volunteerId,
        eventId: certificate.eventId,
        description: certificate.description || "",
      });
    } else {
      setCertificateFormData({ volunteerId: "", eventId: "", description: "" }); // Default for create if no volunteer context
    }
    setIsCertificateDialogOpen(true);
  };

  const handleCertificateFormChange = (
    field: keyof CertificateFormData,
    value: string
  ) => {
    setCertificateFormData((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleSaveCertificate = () => {
    if (!certificateFormData) return;
    // TODO: Add validation
    const volunteer = volunteers.find(
      (v) => v.userId === certificateFormData.volunteerId
    );
    const event = events.find((e) => e.id === certificateFormData.eventId);

    if (!volunteer || !event) {
      // TODO: Show error to user
      console.error(
        "Tình nguyện viên hoặc Sự kiện không tìm thấy để cấp chứng chỉ"
      );
      return;
    }

    if (event.status !== "completed") {
      // TODO: Show error to user
      console.error("Chỉ có thể cấp chứng chỉ cho các sự kiện đã hoàn thành.");
      return;
    }

    if (dialogMode === "create") {
      const newCertificate: Certificate = {
        id: `cert_${Date.now()}`,
        volunteerId: volunteer.userId,
        volunteerName: volunteer.fullName,
        eventId: event.id,
        eventName: event.title,
        issueDate: new Date().toISOString().split("T")[0],
        description: certificateFormData.description,
        issuedBy: organizationName, // Use derived organizationName
        certificateUrl: "#", // Placeholder
      };
      setCertificates((prev) => [...prev, newCertificate]);
    }
    // Editing certificates might not be common, usually delete and re-issue.
    // If editing is needed, implement similar to event/volunteer.
    setIsCertificateDialogOpen(false);
    setCurrentCertificate(null);
    setCertificateFormData(null);
  };

  const handleDeleteCertificate = (certificateId: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== certificateId));
  };

  const getEventStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="default" className="bg-blue-500 text-white">
            Sắp diễn ra
          </Badge>
        );
      case "planning":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            Đang kế hoạch
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Đã hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVolunteerStatusBadge = (status: VolunteerApplicationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-700"
          >
            Chờ duyệt
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            Đã duyệt
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Đã từ chối</Badge>;
      case "waitlisted":
        return (
          <Badge variant="secondary" className="text-gray-600">
            Danh sách chờ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Tổ chức
        </h1>
        <p className="text-gray-600">
          {organizationName} - Điều hành hoạt động, quản lý tình nguyện viên và
          cấp chứng chỉ.
        </p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="events">
            <CalendarPlus className="mr-2 h-4 w-4" /> Quản lý Sự kiện
          </TabsTrigger>
          <TabsTrigger value="volunteers">
            <Users className="mr-2 h-4 w-4" /> Quản lý Tình nguyện viên
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award className="mr-2 h-4 w-4" /> Quản lý Chứng chỉ
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách Sự kiện</CardTitle>
                <Button onClick={() => handleOpenEventDialog("create")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tạo Sự kiện mới
                </Button>
              </div>
              <CardDescription>
                Xem, tạo mới, chỉnh sửa và xóa các sự kiện của tổ chức.
              </CardDescription>
              <div className="mt-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sự kiện (tên, địa điểm, danh mục...)"
                    value={searchTermEvents}
                    onChange={(e) => setSearchTermEvents(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {getEventStatusBadge(event.status)}
                      </div>
                      <CardDescription>
                        {event.category} - {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-1">
                        Ngày: {event.date} ({event.time})
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Hạn ĐK: {event.registrationDeadline || "N/A"}
                      </p>
                      <p className="text-sm line-clamp-3 mb-3">
                        {event.description}
                      </p>
                      <div className="text-sm">
                        <p>
                          TNV: {event.volunteers.confirmed}/
                          {event.volunteers.max} (ĐK:{" "}
                          {event.volunteers.registered})
                        </p>
                        {event.volunteers.needed !== undefined &&
                          event.volunteers.needed > 0 && (
                            <p className="text-orange-600">
                              Cần thêm: {event.volunteers.needed} TNV
                            </p>
                          )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 p-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEventDialog("view", event)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEventDialog("edit", event)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Xóa
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Không tìm thấy sự kiện nào.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Tình nguyện viên</CardTitle>
              <CardDescription>
                Quản lý đơn ứng tuyển, xem thông tin và phân công tình nguyện
                viên.
              </CardDescription>
              <div className="mt-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm TNV (tên, email, sự kiện...)"
                    value={searchTermVolunteers}
                    onChange={(e) => setSearchTermVolunteers(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVolunteers.map((volunteer) => (
                  <Card
                    key={volunteer.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {volunteer.fullName} ({volunteer.email})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ngày nộp đơn: {volunteer.applicationDate}
                        {volunteer.assignedEventTitle &&
                          ` - Sự kiện: ${volunteer.assignedEventTitle}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getVolunteerStatusBadge(volunteer.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenVolunteerDialog("view", volunteer)
                        }
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenVolunteerDialog("edit", volunteer)
                        }
                      >
                        <UserCheck className="mr-1 h-4 w-4" />
                        Duyệt
                      </Button>
                      {volunteer.status === "approved" &&
                        events.find(
                          (e) =>
                            e.id === volunteer.assignedEventId &&
                            e.status === "completed"
                        ) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-100 hover:bg-green-200 text-green-700"
                            onClick={() =>
                              handleOpenCertificateDialog(
                                "create",
                                undefined,
                                volunteer
                              )
                            }
                          >
                            <Award className="mr-1 h-4 w-4" /> Cấp chứng chỉ
                          </Button>
                        )}
                    </div>
                  </Card>
                ))}
              </div>
              {filteredVolunteers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Không có tình nguyện viên nào.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách Chứng chỉ đã cấp</CardTitle>
                {/* <Button onClick={() => handleOpenCertificateDialog("create")}> // Might not be needed if always created from volunteer tab
                  <PlusCircle className="mr-2 h-4 w-4" /> Cấp Chứng chỉ mới
                </Button> */}
              </div>
              <CardDescription>
                Xem lại và quản lý các chứng chỉ đã được cấp cho tình nguyện
                viên.
              </CardDescription>
              <div className="mt-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm chứng chỉ (tên TNV, sự kiện...)"
                    value={searchTermCertificates}
                    onChange={(e) => setSearchTermCertificates(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCertificates.map((cert) => (
                  <Card
                    key={cert.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        Chứng chỉ cho: {cert.volunteerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sự kiện: {cert.eventName} - Ngày cấp: {cert.issueDate}
                      </p>
                      <p className="text-sm">{cert.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenCertificateDialog("view", cert)
                        }
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Xem
                      </Button>
                      {/* <Button variant="outline" size="sm" onClick={() => {}}><Edit className="mr-1 h-4 w-4" />Sửa</Button> // Edit might be complex */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCertificate(cert.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Xóa
                      </Button>
                      {cert.certificateUrl && cert.certificateUrl !== "#" && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="link" size="sm">
                            <FileText className="mr-1 h-4 w-4" />
                            Tải về
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              {filteredCertificates.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có chứng chỉ nào được cấp.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Tạo Sự kiện mới"
                : dialogMode === "edit"
                ? "Chỉnh sửa Sự kiện"
                : "Chi tiết Sự kiện"}
            </DialogTitle>
            {dialogMode !== "view" && (
              <DialogDescription>
                Điền thông tin chi tiết cho sự kiện.
              </DialogDescription>
            )}
          </DialogHeader>
          {eventFormData && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Tiêu đề
                </Label>
                <Input
                  id="title"
                  value={eventFormData.title}
                  onChange={(e) =>
                    handleEventFormChange("title", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={eventFormData.description}
                  onChange={(e) =>
                    handleEventFormChange("description", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Danh mục
                </Label>
                <Select
                  value={eventFormData.category}
                  onValueChange={(value) =>
                    handleEventFormChange("category", value)
                  }
                  disabled={dialogMode === "view"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Ngày diễn ra
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={eventFormData.date}
                  onChange={(e) =>
                    handleEventFormChange("date", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Thời gian
                </Label>
                <Input
                  id="time"
                  placeholder="VD: 08:00 - 17:00"
                  value={eventFormData.time}
                  onChange={(e) =>
                    handleEventFormChange("time", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Địa điểm
                </Label>
                <Input
                  id="location"
                  value={eventFormData.location}
                  onChange={(e) =>
                    handleEventFormChange("location", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={eventFormData.status}
                  onValueChange={(value) =>
                    handleEventFormChange("status", value as EventStatus)
                  }
                  disabled={dialogMode === "view"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxVolunteers" className="text-right">
                  Số TNV tối đa
                </Label>
                <Input
                  id="maxVolunteers"
                  type="number"
                  value={eventFormData.maxVolunteers}
                  onChange={(e) =>
                    handleEventFormChange(
                      "maxVolunteers",
                      parseInt(e.target.value)
                    )
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registrationDeadline" className="text-right">
                  Hạn đăng ký
                </Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={eventFormData.registrationDeadline}
                  onChange={(e) =>
                    handleEventFormChange(
                      "registrationDeadline",
                      e.target.value
                    )
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tasks" className="text-right">
                  Công việc (phẩy ,)
                </Label>
                <Textarea
                  id="tasks"
                  placeholder="VD: Dạy học, Phát quà, Hỗ trợ..."
                  value={eventFormData.tasks}
                  onChange={(e) =>
                    handleEventFormChange("tasks", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requirements" className="text-right">
                  Yêu cầu (phẩy ,)
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="VD: Có kinh nghiệm, Yêu trẻ..."
                  value={eventFormData.requirements}
                  onChange={(e) =>
                    handleEventFormChange("requirements", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              {dialogMode === "view" && currentEvent && (
                <>
                  <hr className="col-span-4 my-2" />
                  <p className="col-span-4 text-sm font-semibold">
                    Thông tin thêm:
                  </p>
                  <p className="col-span-1 text-right text-sm">
                    Điều phối viên:
                  </p>
                  <p className="col-span-3 text-sm">
                    {currentEvent.coordinator || "Chưa có"}
                  </p>
                  <p className="col-span-1 text-right text-sm">Ngày tạo:</p>
                  <p className="col-span-3 text-sm">
                    {currentEvent.createdDate}
                  </p>
                  <p className="col-span-1 text-right text-sm">TNV đã ĐK:</p>
                  <p className="col-span-3 text-sm">
                    {currentEvent.volunteers.registered}
                  </p>
                  <p className="col-span-1 text-right text-sm">TNV xác nhận:</p>
                  <p className="col-span-3 text-sm">
                    {currentEvent.volunteers.confirmed}
                  </p>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
            {dialogMode !== "view" && (
              <Button onClick={handleSaveEvent}>
                {dialogMode === "create" ? "Tạo Sự kiện" : "Lưu thay đổi"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volunteer Dialog */}
      <Dialog
        open={isVolunteerDialogOpen}
        onOpenChange={setIsVolunteerDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit"
                ? "Xét duyệt Tình nguyện viên"
                : "Thông tin Tình nguyện viên"}
            </DialogTitle>
            {currentVolunteer && (
              <DialogDescription>
                Ứng viên: {currentVolunteer.fullName}
              </DialogDescription>
            )}
          </DialogHeader>
          {currentVolunteer && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <p>
                <span className="font-semibold">Họ tên:</span>{" "}
                {currentVolunteer.fullName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {currentVolunteer.email}
              </p>
              <p>
                <span className="font-semibold">SĐT:</span>{" "}
                {currentVolunteer.phoneNumber || "Chưa cung cấp"}
              </p>
              <p>
                <span className="font-semibold">Ngày nộp đơn:</span>{" "}
                {currentVolunteer.applicationDate}
              </p>
              {currentVolunteer.assignedEventTitle && (
                <p>
                  <span className="font-semibold">Sự kiện ứng tuyển:</span>{" "}
                  {currentVolunteer.assignedEventTitle}
                </p>
              )}
              {currentVolunteer.skills &&
                currentVolunteer.skills.length > 0 && (
                  <p>
                    <span className="font-semibold">Kỹ năng:</span>{" "}
                    {currentVolunteer.skills.join(", ")}
                  </p>
                )}
              {currentVolunteer.motivationLetter && (
                <p>
                  <span className="font-semibold">Thư động lực:</span>{" "}
                  {currentVolunteer.motivationLetter}
                </p>
              )}

              <hr className="my-2" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="volunteerStatus" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={volunteerFormData?.status || currentVolunteer.status}
                  onValueChange={(value) =>
                    handleVolunteerFormChange(
                      "status",
                      value as VolunteerApplicationStatus
                    )
                  }
                  disabled={dialogMode === "view"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOLUNTEER_APPLICATION_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {dialogMode === "edit" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignedEventId" className="text-right">
                      Phân công SK
                    </Label>
                    <Select
                      value={
                        volunteerFormData?.assignedEventId ||
                        currentVolunteer.assignedEventId ||
                        ""
                      }
                      onValueChange={(value) =>
                        handleVolunteerFormChange("assignedEventId", value)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn sự kiện để phân công" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Không phân công</SelectItem>
                        {events
                          .filter(
                            (e) =>
                              e.status === "upcoming" || e.status === "planning"
                          )
                          .map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Ghi chú
                    </Label>
                    <Textarea
                      id="notes"
                      value={
                        volunteerFormData?.notes || currentVolunteer.notes || ""
                      }
                      onChange={(e) =>
                        handleVolunteerFormChange("notes", e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
              {dialogMode === "view" && currentVolunteer.notes && (
                <p>
                  <span className="font-semibold">Ghi chú:</span>{" "}
                  {currentVolunteer.notes}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
            {dialogMode === "edit" && (
              <Button onClick={handleSaveVolunteerUpdate}>Lưu thay đổi</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog
        open={isCertificateDialogOpen}
        onOpenChange={setIsCertificateDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Cấp Chứng chỉ mới"
                : "Chi tiết Chứng chỉ"}
            </DialogTitle>
            {dialogMode !== "view" && certificateFormData && (
              <DialogDescription>
                Cấp chứng chỉ cho tình nguyện viên.
              </DialogDescription>
            )}
          </DialogHeader>
          {certificateFormData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="volunteerNameCert" className="text-right">
                  TNV nhận
                </Label>
                <Select
                  value={certificateFormData.volunteerId}
                  onValueChange={(value) =>
                    handleCertificateFormChange("volunteerId", value)
                  }
                  disabled={dialogMode !== "create"} // Only allow selection on create
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn tình nguyện viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers
                      .filter((v) => v.status === "approved")
                      .map((vol) => (
                        <SelectItem key={vol.userId} value={vol.userId}>
                          {vol.fullName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventNameCert" className="text-right">
                  Sự kiện
                </Label>
                <Select
                  value={certificateFormData.eventId}
                  onValueChange={(value) =>
                    handleCertificateFormChange("eventId", value)
                  }
                  disabled={dialogMode !== "create"} // Only allow selection on create
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn sự kiện đã hoàn thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {events
                      .filter(
                        (e) =>
                          e.status === "completed" &&
                          certificateFormData.volunteerId &&
                          volunteers.find(
                            (v) => v.userId === certificateFormData.volunteerId
                          )?.assignedEventId === e.id
                      )
                      .map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    {events
                      .filter(
                        (e) =>
                          e.status === "completed" &&
                          (!certificateFormData.volunteerId ||
                            volunteers.find(
                              (v) =>
                                v.userId === certificateFormData.volunteerId
                            )?.assignedEventId !== e.id)
                      )
                      .map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} (Chung)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="certDescription" className="text-right">
                  Nội dung
                </Label>
                <Textarea
                  id="certDescription"
                  value={certificateFormData.description}
                  onChange={(e) =>
                    handleCertificateFormChange("description", e.target.value)
                  }
                  className="col-span-3"
                  disabled={dialogMode === "view"}
                />
              </div>
              {dialogMode === "view" && currentCertificate && (
                <>
                  <p>
                    <span className="font-semibold">Ngày cấp:</span>{" "}
                    {currentCertificate.issueDate}
                  </p>
                  <p>
                    <span className="font-semibold">Cấp bởi:</span>{" "}
                    {currentCertificate.issuedBy}
                  </p>
                  {currentCertificate.certificateUrl &&
                    currentCertificate.certificateUrl !== "#" && (
                      <a
                        href={currentCertificate.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline col-span-4"
                      >
                        Xem/Tải chứng chỉ (giả lập)
                      </a>
                    )}
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
            {dialogMode === "create" && (
              <Button onClick={handleSaveCertificate}>Cấp Chứng chỉ</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
