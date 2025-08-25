import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  RefreshCw,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { reportService } from '@/services/reportService';
import type {
  ReportViewModel,
} from '@/types/report';
import { ReportListComponent } from '@/components/organization/report-management/ReportListComponent';
import { ReportViewModal } from '@/components/shared/ReportViewModal';
import { ReportStatsCard } from '@/components/shared/ReportStatsCard';

interface ReportListPageProps {
  userRole?: string;
  organizationId?: number;
}

export const ReportListPage: React.FC<ReportListPageProps> = ({
  userRole = 'Organization',
  organizationId,
}) => {
  const [reports, setReports] = useState<ReportViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportViewModel | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Load all reports for organization
  const loadReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load different types of reports
      const [eventReports, orgReports, systemReports] = await Promise.all([
        reportService.getEventReports(1, 100), // Load all reports for organization view
        reportService.getOrganizationReports(1, 100),
        reportService.getSystemReports(1, 100),
      ]);

      // Combine all reports
      const allReports: ReportViewModel[] = [
        ...eventReports.items,
        ...orgReports.items,
        ...systemReports.items,
      ];

      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Failed to load reports. Please try again.');
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };



  // Handle report view
  const handleViewReport = (report: ReportViewModel) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  // Handle report download
  const handleDownloadReport = async (report: ReportViewModel) => {
    try {
      await reportService.downloadReportById(report.reportId);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };



  // Load reports on component mount
  useEffect(() => {
    loadReports();
  }, [organizationId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600 mt-1">
            View and manage organization reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
          <Button
            onClick={loadReports}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Card */}
      {showStats && (
        <ReportStatsCard
          reports={reports}
          loading={loading}
          showDetailedStats={true}
        />
      )}



      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reports List */}
      <ReportListComponent
        userRole={userRole}
        organizationId={organizationId}
        onViewReport={handleViewReport}
      />

      {/* Report View Modal */}
      <ReportViewModal
        report={selectedReport}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedReport(null);
        }}
        userRole={userRole}
        showDownloadButton={true}
        showCopyButton={true}
      />
    </div>
  );
};

export default ReportListPage;