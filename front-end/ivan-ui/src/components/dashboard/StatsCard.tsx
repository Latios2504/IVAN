import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30 hover:shadow-3xl hover:shadow-violet-300/40 dark:hover:shadow-violet-800/40 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {(description || trend) && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {trend ? (
              <span
                className={
                  trend.isPositive !== false ? "text-green-600" : "text-red-600"
                }
              >
                {trend.value}
              </span>
            ) : (
              description
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
