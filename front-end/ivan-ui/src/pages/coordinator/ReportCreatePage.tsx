import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { reportService, reportUtils } from '@/services/reportService';
import type { ReportViewModel } from '@/types/report';
import { ReportCreateComponent } from '@/components/coordinator/report-management/ReportCreateComponent';
import { ReportViewModal } from '@/components/shared/ReportViewModal';

interface ReportCreatePageProps {
  userRole?: string;
  coordinatorId?: number;
}

export const ReportCreatePage: React.FC<ReportCreatePageProps> = ({
  userRole = 'VolunteerCoordinator',
  coordinatorId,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [recentReports, setRecentReports] = useState<ReportViewModel[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [createdReport, setCreatedReport] = useState<ReportViewModel | null>(null);
  const [showCreatedReportModal, setShowCreatedReportModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);

  // Load recent reports created by this coordinator
  const loadRecentReports = async () => {
    setLoadingRecent(true);
    try {
      // Load recent event reports (assuming coordinator mainly creates event reports)
      const eventReports = await reportService.getEventReports(1, 5); // Show last 5 reports
      
      // Filter reports created by this coordinator (if coordinatorId is available)
      let filteredReports = eventReports.items;
      if (coordinatorId) {
        filteredReports = eventReports.items.filter(
          report => report.createdBy === coordinatorId
        );
      }
      
      // Sort by creation date (newest first)
      filteredReports.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRecentReports(filteredReports.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent reports:', error);
      // Don't show error toast for this as it's not critical
    } finally {
      setLoadingRecent(false);
    }
  };

  // Handle successful report creation
  const handleReportCreated = (report: ReportViewModel) => {
    setCreatedReport(report);
    setShowCreatedReportModal(true);
    setShowCreateForm(false);
    
    // Refresh recent reports
    loadRecentReports();
    
    toast.success('Report created successfully!');
  };

  // Handle cancel creation
  const handleCancelCreation = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle create another report
  const handleCreateAnother = () => {
    setCreatedReport(null);
    setShowCreatedReportModal(false);
    setShowCreateForm(true);
  };

  // Handle view created report
  const handleViewCreatedReport = (report: ReportViewModel) => {
    setCreatedReport(report);
    setShowCreatedReportModal(true);
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get report type badge variant
  const getReportTypeBadgeVariant = (reportType: string) => {
    switch (reportType?.toLowerCase()) {
      case 'event':
        return 'default';
      case 'organization':
        return 'secondary';
      case 'system':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Load recent reports on component mount
  useEffect(() => {
    loadRecentReports();
  }, [coordinatorId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Event Report</h1>
            <p className="text-gray-600 mt-1">
              Generate comprehensive reports for completed or ongoing events
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{recentReports.length}</div>
            <div className="text-xs text-gray-500">Recent Reports</div>
          </div>
        </div>
      </div>

      {/* Pre-selected Event Info */}
      {eventId && (
        <Alert className="border-blue-200 bg-blue-50">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Creating report for Event ID: {eventId}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Report Creation Form */}
        <div className="lg:col-span-2">
          {showCreateForm ? (
            <ReportCreateComponent
              userRole={userRole}
              coordinatorId={coordinatorId}
              onReportCreated={handleReportCreated}
              onCancel={handleCancelCreation}
            />
          ) : (
            /* Success State */
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Report Created Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Your event report has been generated and saved.
                  </p>
                </div>
                
                {createdReport && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Report #{createdReport.reportId}</span>
                      <Badge variant={getReportTypeBadgeVariant(createdReport.reportType)}>
                        {createdReport.reportType}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Created: {formatDate(createdReport.createdAt)}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => createdReport && handleViewCreatedReport(createdReport)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button onClick={handleCreateAnother}>
                    Create Another Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Recent Reports & Tips */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRecent ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div
                      key={report.reportId}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewCreatedReport(report)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          Report #{report.reportId}
                        </span>
                        <Badge
                          variant={getReportTypeBadgeVariant(report.reportType)}
                          className="text-xs"
                        >
                          {report.reportType}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(report.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent reports</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips & Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Report Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p>Include detailed event summary and key outcomes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p>Mention participant feedback and engagement levels</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p>Document any challenges faced and solutions implemented</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p>Provide recommendations for future events</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p>Keep content between 100-10,000 characters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/coordinator/reports')}
              >
                <FileText className="h-4 w-4 mr-2" />
                View All Reports
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/coordinator/events')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report View Modal */}
      <ReportViewModal
        report={createdReport}
        isOpen={showCreatedReportModal}
        onClose={() => {
          setShowCreatedReportModal(false);
          setCreatedReport(null);
        }}
        userRole={userRole}
        showDownloadButton={true}
        showCopyButton={true}
      />
    </div>
  );
};

export default ReportCreatePage;