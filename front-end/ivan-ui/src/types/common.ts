// API Response types matching backend specifications
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

// Legacy pagination interface for backward compatibility
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface LocationData {
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FileUpload {
  file: File;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadProgress?: number;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website?: string;
}

// Loading states
export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// Common status types
export enum CommonStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
  CANCELLED = "cancelled",
}

// Vietnamese specific types
export interface VietnameseLocation {
  province: string;
  district: string;
  ward: string;
  address: string;
}

export const VIETNAMESE_PROVINCES = [
  "Hà Nội",
  "Hồ Chí Minh",
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
] as const;
