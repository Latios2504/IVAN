import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  TrendingUp,
  Calendar,
  Users,
  Building,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import type { ReportViewModel } from '@/types/report';

interface ReportStats {
  totalReports: number;
  eventReports: number;
  organizationReports: number;
  systemReports: number;
  recentReports: number;
  thisMonthReports: number;
  averageWordsPerReport: number;
  mostActiveDay: string;
}

interface ReportStatsCardProps {
  reports: ReportViewModel[];
  loading?: boolean;
  className?: string;
  showDetailedStats?: boolean;
}

export const ReportStatsCard: React.FC<ReportStatsCardProps> = ({
  reports,
  loading = false,
  className = '',
  showDetailedStats = true,
}) => {
  // Calculate statistics from reports
  const calculateStats = (): ReportStats => {
    if (!reports || reports.length === 0) {
      return {
        totalReports: 0,
        eventReports: 0,
        organizationReports: 0,
        systemReports: 0,
        recentReports: 0,
        thisMonthReports: 0,
        averageWordsPerReport: 0,
        mostActiveDay: 'N/A',
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count reports by type
    const eventReports = reports.filter(r => r.reportType?.toLowerCase() === 'event').length;
    const organizationReports = reports.filter(r => r.reportType?.toLowerCase() === 'organization').length;
    const systemReports = reports.filter(r => r.reportType?.toLowerCase() === 'system').length;

    // Count recent reports (last 7 days)
    const recentReports = reports.filter(r => {
      const createdDate = r.createdAt ? new Date(r.createdAt) : null;
      return createdDate && createdDate >= sevenDaysAgo;
    }).length;

    // Count this month's reports
    const thisMonthReports = reports.filter(r => {
      const createdDate = r.createdAt ? new Date(r.createdAt) : null;
      return createdDate && createdDate >= startOfMonth;
    }).length;

    // Calculate average words per report
    const totalWords = reports.reduce((sum, report) => {
      const wordCount = report.content ? report.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return sum + wordCount;
    }, 0);
    const averageWordsPerReport = reports.length > 0 ? Math.round(totalWords / reports.length) : 0;

    // Find most active day of the week
    const dayCount: { [key: string]: number } = {};
    reports.forEach(report => {
      if (report.createdAt) {
        const day = new Date(report.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });
    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => 
      dayCount[a] > dayCount[b] ? a : b, 'N/A'
    );

    return {
      totalReports: reports.length,
      eventReports,
      organizationReports,
      systemReports,
      recentReports,
      thisMonthReports,
      averageWordsPerReport,
      mostActiveDay,
    };
  };

  const stats = calculateStats();

  // Get percentage for report types
  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Statistics
          </CardTitle>
          <CardDescription>Loading report statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Report Statistics
        </CardTitle>
        <CardDescription>
          Overview of report generation and distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Reports */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
            <div className="text-sm text-blue-700">Total Reports</div>
          </div>

          {/* Recent Reports */}
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.recentReports}</div>
            <div className="text-sm text-green-700">Last 7 Days</div>
          </div>

          {/* This Month */}
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.thisMonthReports}</div>
            <div className="text-sm text-purple-700">This Month</div>
          </div>

          {/* Average Words */}
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.averageWordsPerReport}</div>
            <div className="text-sm text-orange-700">Avg Words</div>
          </div>
        </div>

        {showDetailedStats && (
          <>
            {/* Report Types Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Report Types Distribution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Event Reports */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Event Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{stats.eventReports}</Badge>
                    <span className="text-xs text-gray-500">
                      {getPercentage(stats.eventReports, stats.totalReports)}%
                    </span>
                  </div>
                </div>

                {/* Organization Reports */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Organization Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.organizationReports}</Badge>
                    <span className="text-xs text-gray-500">
                      {getPercentage(stats.organizationReports, stats.totalReports)}%
                    </span>
                  </div>
                </div>

                {/* System Reports */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">System Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{stats.systemReports}</Badge>
                    <span className="text-xs text-gray-500">
                      {getPercentage(stats.systemReports, stats.totalReports)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Most Active Day</div>
                <div className="font-semibold text-gray-900">{stats.mostActiveDay}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
                <div className="font-semibold text-green-600">
                  {stats.recentReports > 0 ? '+' : ''}{stats.recentReports} this week
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {stats.totalReports === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 text-sm">
              Start creating reports to see statistics and insights here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportStatsCard;