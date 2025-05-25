import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-primary">IVAN</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Hệ thống quản lý hiện đại với giao diện thân thiện và dễ sử dụng
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
