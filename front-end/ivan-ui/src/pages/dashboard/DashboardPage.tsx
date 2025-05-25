import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
        <p className="text-muted-foreground">
          Chào mừng bạn đến với trang dashboard!
        </p>
      </div>
    </div>
  );
}
