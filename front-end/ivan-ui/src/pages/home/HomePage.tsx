import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Chào mừng đến với <span className="text-primary">IVAN</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hệ thống quản lý tình nguyện viên hiện đại - Kết nối tình nguyện
              viên và tổ chức để tạo ra những tác động tích cực cho cộng đồng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg">
                <Link to="/register">Tham gia ngay</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Khám phá cộng đồng của chúng tôi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tìm hiểu về các tình nguyện viên và tổ chức đang tham gia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tình nguyện viên
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Khám phá danh sách các tình nguyện viên tài năng với nhiều kỹ
                năng đa dạng, sẵn sàng đóng góp cho cộng đồng.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/volunteers">Xem danh sách tình nguyện viên</Link>
              </Button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tổ chức
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Tìm hiểu về các tổ chức phi lợi nhuận và doanh nghiệp xã hội
                đang tạo ra những thay đổi tích cực.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/organizations">Xem danh sách tổ chức</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary/5 dark:bg-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sẵn sàng tham gia?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Đăng ký ngay để trở thành một phần của cộng đồng tình nguyện viên
            hoặc tạo các hoạt động ý nghĩa cho tổ chức của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Đăng ký làm tình nguyện viên</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Đăng ký cho tổ chức</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
