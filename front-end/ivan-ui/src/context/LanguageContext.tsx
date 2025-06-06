import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Simple translation object - in a real app this would be more sophisticated
const translations = {
  vi: {
    // Common
    "common.loading": "Đang tải...",
    "common.error": "Có lỗi xảy ra",
    "common.success": "Thành công",
    "common.cancel": "Hủy",
    "common.save": "Lưu",
    "common.edit": "Chỉnh sửa",
    "common.delete": "Xóa",
    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.all": "Tất cả",

    // Navigation
    "nav.home": "Trang chủ",
    "nav.events": "Sự kiện",
    "nav.organizations": "Tổ chức",
    "nav.volunteers": "Tình nguyện viên",
    "nav.profile": "Hồ sơ",
    "nav.dashboard": "Bảng điều khiển",
    "nav.partners": "Đối tác",
    "nav.reports": "Báo cáo",
    "nav.support": "Hỗ trợ",

    // Auth
    "auth.login": "Đăng nhập",
    "auth.register": "Đăng ký",
    "auth.logout": "Đăng xuất",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.fullName": "Họ và tên",
    "auth.role": "Vai trò",

    // Roles
    "role.volunteer": "Tình nguyện viên",
    "role.organization": "Tổ chức",
    "role.admin": "Quản trị viên",
    "role.coordinator": "Điều phối viên",

    // Events
    "event.title": "Tiêu đề sự kiện",
    "event.description": "Mô tả",
    "event.location": "Địa điểm",
    "event.date": "Ngày",
    "event.status": "Trạng thái",
    "event.category": "Danh mục",
    "event.volunteers": "Tình nguyện viên",
    "event.coordinator": "Điều phối viên",

    // Profile
    "profile.firstName": "Tên",
    "profile.lastName": "Họ",
    "profile.phone": "Số điện thoại",
    "profile.address": "Địa chỉ",
    "profile.skills": "Kỹ năng",
    "profile.experience": "Kinh nghiệm",
    "profile.bio": "Giới thiệu",

    // Notifications
    "notification.new": "Thông báo mới",
    "notification.markRead": "Đánh dấu đã đọc",
    "notification.clear": "Xóa tất cả",
  },
  en: {
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",

    // Navigation
    "nav.home": "Home",
    "nav.events": "Events",
    "nav.organizations": "Organizations",
    "nav.volunteers": "Volunteers",
    "nav.profile": "Profile",
    "nav.dashboard": "Dashboard",
    "nav.partners": "Partners",
    "nav.reports": "Reports",
    "nav.support": "Support",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.role": "Role",

    // Roles
    "role.volunteer": "Volunteer",
    "role.organization": "Organization",
    "role.admin": "Administrator",
    "role.coordinator": "Coordinator",

    // Events
    "event.title": "Event Title",
    "event.description": "Description",
    "event.location": "Location",
    "event.date": "Date",
    "event.status": "Status",
    "event.category": "Category",
    "event.volunteers": "Volunteers",
    "event.coordinator": "Coordinator",

    // Profile
    "profile.firstName": "First Name",
    "profile.lastName": "Last Name",
    "profile.phone": "Phone Number",
    "profile.address": "Address",
    "profile.skills": "Skills",
    "profile.experience": "Experience",
    "profile.bio": "Bio",

    // Notifications
    "notification.new": "New Notification",
    "notification.markRead": "Mark as read",
    "notification.clear": "Clear all",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = "vi",
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
