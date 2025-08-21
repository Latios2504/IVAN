import { PartnerAnalyticsDashboard } from "@/components/partner/PartnerAnalyticsDashboard";

export default function PartnerDashboard() {

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center p-6 bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">Bảng điều khiển Đối tác</h1>
          <p className="bg-gradient-to-r from-emerald-700 to-cyan-700 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent font-medium">
            Phân tích và thống kê đối tác
          </p>
        </div>
      </div>

      <PartnerAnalyticsDashboard />
    </div>
  );
}
