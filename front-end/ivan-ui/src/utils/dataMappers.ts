import type {
  PublicOrganization,
  PublicEvent,
  PublicPartner,
} from "../types/publicContent";

// Organization Card mapping
export interface OrganizationCardData {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  website?: string;
  avatar?: string;
  isVerified: boolean;
  rating?: number;
  ratingCount?: number;
  totalEvents?: number;
  totalVolunteers?: number;
  focusAreas?: string[];
}

export const mapPublicOrganizationToCard = (
  org: PublicOrganization
): OrganizationCardData => ({
  id: org.organizationId.toString(),
  name: org.organizationName,
  description: org.description || "",
  type: org.typeName,
  location: org.province || "",
  website: org.website,
  avatar: org.logoUrl,
  isVerified: org.isVerified,
  rating: org.rating,
  ratingCount: org.ratingCount,
  totalEvents: org.totalEvents,
  totalVolunteers: org.totalVolunteers,
  focusAreas: [org.typeName],
});

// Event Card mapping
export interface EventCardData {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  status: "open" | "full" | "closed";
  category: string;
  image?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
}

export const mapPublicEventToCard = (event: PublicEvent): EventCardData => {
  // Convert ISO date to readable format
  const startDate = new Date(event.startDate);
  const dateStr = startDate.toISOString().split("T")[0];
  const timeStr = startDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Determine status based on current volunteers vs max volunteers
  let status: "open" | "full" | "closed" = "open";
  if (
    event.statusName.toLowerCase().includes("close") ||
    event.statusName.toLowerCase().includes("đóng")
  ) {
    status = "closed";
  } else if (
    event.maxVolunteers &&
    event.currentVolunteers >= event.maxVolunteers
  ) {
    status = "full";
  }

  return {
    id: event.eventId.toString(),
    title: event.eventName,
    description: event.shortDescription || event.description || "",
    organization: event.organizationName,
    date: dateStr,
    time: timeStr,
    location: event.province || event.location || "",
    volunteersNeeded: event.maxVolunteers || event.minVolunteers,
    volunteersRegistered: event.currentVolunteers,
    status,
    category: event.categoryName,
    image: event.bannerImageUrl,
    isUrgent: event.isUrgent,
    isFeatured: event.isFeatured,
    viewCount: event.viewCount,
  };
};

// Partner Card mapping
export interface PartnerCardData {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
  logo?: string;
  isVerified: boolean;
  rating?: number;
  ratingCount?: number;
  totalCollaborations?: number;
  partnershipType?: string;
}

export const mapPublicPartnerToCard = (
  partner: PublicPartner
): PartnerCardData => ({
  id: partner.partnerId.toString(),
  name: partner.companyName,
  description: partner.description || "",
  industry: partner.industryName,
  location: partner.province || partner.address || "",
  website: partner.website,
  logo: partner.logoUrl,
  isVerified: partner.isVerified,
  rating: partner.rating,
  ratingCount: partner.ratingCount,
  totalCollaborations: partner.totalCollaborations,
  partnershipType: partner.industryName,
});

// Filter option mapping helpers
export const createFilterOption = (value: string | number, label: string) => ({
  value: value.toString(),
  label,
});

// Convert organization types to filter options
export const mapOrganizationTypesToFilters = (
  types: Array<{ id: number; name: string }>
) => [
  { value: "all", label: "Tất cả lĩnh vực" },
  ...types.map((type) => createFilterOption(type.id, type.name)),
];

// Convert event categories to filter options
export const mapEventCategoriesToFilters = (
  categories: Array<{ id: number; name: string }>
) => [
  { value: "all", label: "Tất cả" },
  ...categories.map((category) =>
    createFilterOption(category.id, category.name)
  ),
];

// Convert partner industries to filter options
export const mapPartnerIndustriesToFilters = (
  industries: Array<{ id: number; name: string }>
) => [
  { value: "all", label: "Tất cả" },
  ...industries.map((industry) =>
    createFilterOption(industry.id, industry.name)
  ),
];

// Location filter helpers
export const vietnamProvinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export const createLocationFilters = () => [
  { value: "all", label: "Tất cả địa điểm" },
  ...vietnamProvinces.map((province) => createFilterOption(province, province)),
];
