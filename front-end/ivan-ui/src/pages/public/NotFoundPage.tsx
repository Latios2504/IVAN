import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/40 dark:via-pink-950/40 dark:to-fuchsia-950/40 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="bg-gradient-to-br from-white/90 via-rose-50/50 to-pink-50/50 dark:from-slate-900/90 dark:via-rose-950/50 dark:to-pink-950/50 backdrop-blur-sm border-2 border-dashed border-rose-300/50 dark:border-rose-700/50 shadow-2xl shadow-rose-200/30 dark:shadow-rose-900/30">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-rose-200/50 dark:border-rose-800/50">
              <Search className="w-12 h-12 text-rose-500 dark:text-rose-400" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              404
            </CardTitle>
            <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300">
              Không tìm thấy trang
            </h2>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
              chuyển.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </button>
              </Button>
            </div>
            <div className="pt-4 border-t border-rose-200/50 dark:border-rose-800/50">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cần hỗ trợ?{" "}
                <Link
                  to="/contact"
                  className="text-rose-600 dark:text-rose-400 hover:underline font-medium hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                >
                  Liên hệ với chúng tôi
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
