import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Search, Clock, Building2 } from "lucide-react";
import { CombinedLayout } from "@/components/public/CombinedLayout";
import { EventListItem } from "@/components/public/EventListItem";
import { eventsService } from "@/services/eventsService";
import type {
  EventDto,
  EventFilterDto,
} from "@/types/events";
import type { StatCard } from "@/components/public/StatsSection";

// Import the detail page content components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Target,
  Share2,
  Bookmark,
  ExternalLink,
  Zap,
} from "lucide-react";

// Event status constants - should match backend status IDs
const EVENT_STATUS = {
  DRAFT: 1,
  OPEN: 2,
  FULL: 3,
  CLOSED: 4,
  CANCELLED: 5,
} as const;

const mapEventToListItem = (event: EventDto) => {
  // Determine status based on statusId (more reliable) or fallback to statusName
  let status: "open" | "full" | "closed" = "open";
  
  if (event.statusId) {
    switch (event.statusId) {
      case EVENT_STATUS.OPEN:
        status = "open";
        break;
      case EVENT_STATUS.FULL:
        status = "full";
        break;
      case EVENT_STATUS.CLOSED:
      case EVENT_STATUS.CANCELLED:
        status = "closed";
        break;
      default:
        status = "open";
    }
  } else if (event.statusName) {
    // Fallback to string matching if statusId is not reliable
    const statusLower = event.statusName.toLowerCase();
    if (statusLower.includes('đóng') || statusLower.includes('closed') || statusLower.includes('hủy')) {
      status = "closed";
    } else if (statusLower.includes('đủ') || statusLower.includes('full')) {
      status = "full";
    } else {
      status = "open";
    }
  }
  
  return {
    id: event.eventId.toString(),
    title: event.eventName,
    description: event.shortDescription || event.description || "",
    organization: event.organizationName,
    startDate: event.startDate,
    endDate: event.endDate,
    time: event.startDate ? new Date(event.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "",
    location: event.location,
    detailedAddress: event.detailedAddress,
    province: event.province,
    district: event.district,
    maxVolunteers: event.maxVolunteers,
    minVolunteers: event.minVolunteers,
    volunteersRegistered: event.volunteersRegistered,
    registrationEndDate: event.registrationEndDate,
    registrationStartDate: event.registrationStartDate,
    status: status,
    category: event.categoryName,
    image: event.bannerImageUrl,
    isUrgent: event.isUrgent,
    isFeatured: event.isFeatured,
    requirements: event.requirements,
    benefits: event.benefits,
    contactPerson: event.contactPerson,
    contactPhone: event.contactPhone,
    contactEmail: event.contactEmail,
  };
};

export default function PublicEventsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(id || null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [filters, setFilters] = useState<EventFilterDto>({
    search: "",
    categoryIds: undefined,
    province: "",
    statusIds: undefined,
    page: 1,
    size: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // State for API data
  const [events, setEvents] = useState<EventDto[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Load events whenever filters change
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await eventsService.getEvents(filters);
        setEvents(result.items);
        setPagination({
          page: result.pageNumber,
          totalPages: result.totalPages,
          totalItems: result.totalCount,
        });
        
        // Auto-select first event if none selected
        if (!selectedEventId && result.items.length > 0) {
          const firstEventId = result.items[0].eventId?.toString();
          if (firstEventId) {
            setSelectedEventId(firstEventId);
            navigate(`/events/${firstEventId}`, { replace: true });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [filters]);

  // Load selected event details
  useEffect(() => {
    if (selectedEventId) {
      const loadEventDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await eventsService.getEvent(Number(selectedEventId));
          setSelectedEvent(result);
        } catch (err) {
          setDetailError(
            err instanceof Error ? err.message : "Failed to load event details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadEventDetail();
    }
  }, [selectedEventId]);

  // Map backend data to component props
  const mappedEvents = useMemo(
    () => events.map(mapEventToListItem),
    [events]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    navigate(`/events/${eventId}`);
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev })); // Trigger reload
  };

  const handleDetailRetry = () => {
    if (selectedEventId) {
      const loadEventDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await eventsService.getEvent(Number(selectedEventId));
          setSelectedEvent(result);
        } catch (err) {
          setDetailError(
            err instanceof Error ? err.message : "Failed to load event details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadEventDetail();
    }
  };

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng sự kiện",
      value: pagination.totalItems.toString(),
      subtitle: "Sự kiện đang mở",
      icon: Calendar,
    },
    {
      title: "Tình nguyện viên",
      value: mappedEvents
        .reduce((total: number, event) => total + (event.maxVolunteers || event.minVolunteers || 0), 0)
        .toLocaleString(),
      subtitle: "Cần tuyển",
      icon: Users,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedEvents.map((event) => event.province || event.location).filter(Boolean)
      ).size.toString(),
      subtitle: "Tỉnh/Thành phố",
      icon: MapPin,
    },
  ];

  // Detail content component
  const DetailContent = () => {
    if (!selectedEvent) return null;

    const statusConfig = {
      open: { 
        label: "Đang mở", 
        variant: "default" as const, 
        color: "text-emerald-600 dark:text-emerald-400",
        bgGradient: "from-emerald-500/10 to-green-500/10 dark:from-emerald-400/20 dark:to-green-400/20"
      },
      full: { 
        label: "Đã đủ", 
        variant: "secondary" as const, 
        color: "text-amber-600 dark:text-amber-400",
        bgGradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-400/20 dark:to-orange-400/20"
      },
      closed: { 
        label: "Đã đóng", 
        variant: "destructive" as const, 
        color: "text-rose-600 dark:text-rose-400",
        bgGradient: "from-rose-500/10 to-red-500/10 dark:from-rose-400/20 dark:to-red-400/20"
      },
    };

    // Determine status using the same logic as mapping function
    let eventStatus: "open" | "full" | "closed" = "open";
    
    if (selectedEvent.statusId) {
      switch (selectedEvent.statusId) {
        case EVENT_STATUS.OPEN:
          eventStatus = "open";
          break;
        case EVENT_STATUS.FULL:
          eventStatus = "full";
          break;
        case EVENT_STATUS.CLOSED:
        case EVENT_STATUS.CANCELLED:
          eventStatus = "closed";
          break;
        default:
          eventStatus = "open";
      }
    } else if (selectedEvent.statusName) {
      const statusLower = selectedEvent.statusName.toLowerCase();
      if (statusLower.includes('đóng') || statusLower.includes('closed') || statusLower.includes('hủy')) {
        eventStatus = "closed";
      } else if (statusLower.includes('đủ') || statusLower.includes('full')) {
        eventStatus = "full";
      } else {
        eventStatus = "open";
      }
    }
    const statusInfo = statusConfig[eventStatus];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className={`p-6 rounded-xl bg-gradient-to-br ${statusInfo.bgGradient} border border-border/50`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {selectedEvent.eventName}
                  </h1>
                  <div className="flex items-center gap-2">
                    {selectedEvent.isUrgent && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full animate-pulse">
                        <Zap className="h-3 w-3" />
                        Khẩn cấp
                      </div>
                    )}
                    {selectedEvent.isFeatured && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                        <Heart className="h-3 w-3" />
                        Nổi bật
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 rounded-md bg-blue-500/10 dark:bg-blue-400/20">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-foreground font-medium">{selectedEvent.organizationName}</span>
                </div>
                <Badge variant={statusInfo.variant} className={`${statusInfo.color} font-medium`}>
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
            
            <p className="text-foreground/80 mt-4 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>
        </div>

        {/* Event Images */}
        {(selectedEvent.bannerImageUrl || selectedEvent.galleryImages) && (
          <div className="space-y-4">
            {selectedEvent.bannerImageUrl && (
              <div>
                <h3 className="font-medium mb-2">Hình ảnh sự kiện</h3>
                <img 
                  src={selectedEvent.bannerImageUrl} 
                  alt={selectedEvent.eventName}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {selectedEvent.galleryImages && (
              <div>
                <h3 className="font-medium mb-2">Thư viện ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedEvent.galleryImages.split(',').map((imageUrl, index) => (
                    <img 
                      key={index}
                      src={imageUrl.trim()} 
                      alt={`${selectedEvent.eventName} - ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-semibold text-foreground">Thời gian sự kiện</span>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-foreground">Bắt đầu: {new Date(selectedEvent.startDate).toLocaleDateString('vi-VN')} {new Date(selectedEvent.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {selectedEvent.endDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-foreground">Kết thúc: {new Date(selectedEvent.endDate).toLocaleDateString('vi-VN')} {new Date(selectedEvent.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="font-semibold text-foreground">Địa điểm</span>
              </div>
              <div className="text-sm space-y-1">
                {selectedEvent.detailedAddress && <div className="text-foreground font-medium">{selectedEvent.detailedAddress}</div>}
                {selectedEvent.location && <div className="text-foreground">{selectedEvent.location}</div>}
                {(selectedEvent.district || selectedEvent.province) && (
                  <div className="text-muted-foreground">{selectedEvent.district}{selectedEvent.district && selectedEvent.province && ', '}{selectedEvent.province}</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {(selectedEvent.registrationStartDate || selectedEvent.registrationEndDate) && (
            <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-foreground">Thời gian đăng ký</span>
                </div>
                <div className="text-sm space-y-2">
                  {selectedEvent.registrationStartDate && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-foreground">Mở đăng ký: {new Date(selectedEvent.registrationStartDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  {selectedEvent.registrationEndDate && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-foreground">Hạn đăng ký: {new Date(selectedEvent.registrationEndDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Volunteer Stats */}
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-foreground">Tình nguyện viên</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedEvent.minVolunteers && (
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-foreground">Tối thiểu cần</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{selectedEvent.minVolunteers} người</span>
                </div>
              )}
              {selectedEvent.maxVolunteers && (
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-foreground">Tối đa nhận</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{selectedEvent.maxVolunteers} người</span>
                </div>
              )}
              {selectedEvent.volunteersRegistered !== undefined && selectedEvent.maxVolunteers && (
                <>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="text-foreground">Đã đăng ký</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {selectedEvent.volunteersRegistered}/{selectedEvent.maxVolunteers}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-violet-500"
                        style={{ 
                          width: `${Math.min((selectedEvent.volunteersRegistered / selectedEvent.maxVolunteers) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {Math.round((selectedEvent.volunteersRegistered / selectedEvent.maxVolunteers) * 100)}% đã đăng ký
                      </span>
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        Còn {Math.max(selectedEvent.maxVolunteers - selectedEvent.volunteersRegistered, 0)} vị trí
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        {selectedEvent.categoryName && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Danh mục</span>
              </div>
              <Badge variant="outline" className="mt-2">
                {selectedEvent.categoryName}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {(selectedEvent.requirements || selectedEvent.requiredSkills || selectedEvent.ageRequirement || selectedEvent.genderRequirement) && (
          <Card className="border-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-foreground">Yêu cầu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                {selectedEvent.requirements && (
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Yêu cầu chung:</span>
                    <p className="text-foreground whitespace-pre-wrap mt-2 leading-relaxed">
                      {selectedEvent.requirements}
                    </p>
                  </div>
                )}
                {selectedEvent.requiredSkills && (
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Kỹ năng yêu cầu: </span>
                    <span className="text-foreground">{selectedEvent.requiredSkills}</span>
                  </div>
                )}
                {selectedEvent.ageRequirement && (
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Yêu cầu độ tuổi: </span>
                    <span className="text-foreground">{selectedEvent.ageRequirement}</span>
                  </div>
                )}
                {selectedEvent.genderRequirement && (
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Yêu cầu giới tính: </span>
                    <span className="text-foreground">{selectedEvent.genderRequirement}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {selectedEvent.benefits && (
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="text-foreground">Quyền lợi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedEvent.benefits}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        {(selectedEvent.contactPerson || selectedEvent.contactPhone || selectedEvent.contactEmail) && (
          <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-foreground">Thông tin liên hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {selectedEvent.contactPerson && (
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">Người liên hệ:</span>
                    <span className="text-foreground font-medium">{selectedEvent.contactPerson}</span>
                  </div>
                )}
                {selectedEvent.contactPhone && (
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">Số điện thoại:</span>
                    <span className="text-foreground font-medium">{selectedEvent.contactPhone}</span>
                  </div>
                )}
                {selectedEvent.contactEmail && (
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">Email:</span>
                    <span className="text-foreground font-medium">{selectedEvent.contactEmail}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
            disabled={eventStatus === 'closed' || eventStatus === 'full'}
            onClick={() => {
              if (eventStatus !== 'closed' && eventStatus !== 'full' && selectedEvent) {
                navigate(`/volunteer/events/${selectedEvent.eventId}/register`);
              }
            }}
          >
            <Heart className="h-4 w-4 mr-2" />
            {eventStatus === 'closed' ? 'Đã đóng' : 
             eventStatus === 'full' ? 'Đã đủ người' : 'Đăng ký tham gia'}
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <CombinedLayout
      title="Sự kiện"
      description="Khám phá các sự kiện tình nguyện và cơ hội đóng góp cho cộng đồng"
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm sự kiện..."
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      isEmpty={mappedEvents.length === 0}
      pagination={{
        page: pagination.page,
        size: filters.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      itemName="sự kiện"
      detailLoading={detailLoading}
      detailError={detailError}
      onDetailRetry={handleDetailRetry}
      detailContent={<DetailContent />}
      listItems={mappedEvents.map((event) => (
        <EventListItem
          key={event.id}
          event={event}
          isSelected={event.id === selectedEventId}
          onClick={() => handleEventSelect(event.id)}
        />
      ))}
    />
  );
}