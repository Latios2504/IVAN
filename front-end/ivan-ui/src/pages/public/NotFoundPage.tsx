import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-4xl font-bold text-foreground">
              404
            </CardTitle>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Không tìm thấy trang
            </h2>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
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
            <div className="pt-4 border-t border-muted">
              <p className="text-sm text-muted-foreground">
                Cần hỗ trợ?{" "}
                <Link
                  to="/contact"
                  className="text-primary hover:underline font-medium"
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
