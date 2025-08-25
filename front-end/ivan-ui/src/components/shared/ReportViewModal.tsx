import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  FileText,
  Calendar,
  User,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { reportService, reportUtils } from '@/services/reportService';
import type { ReportViewModel } from '@/types/report';

interface ReportViewModalProps {
  report: ReportViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  showDownloadButton?: boolean;
  showCopyButton?: boolean;
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({
  report,
  isOpen,
  onClose,
  userRole = 'Organization',
  showDownloadButton = true,
  showCopyButton = true,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);

  // Handle download report
  const handleDownload = async () => {
    if (!report) return;
    
    setDownloading(true);
    try {
      await reportService.downloadReportById(report.reportId);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle copy content to clipboard
  const handleCopyContent = async () => {
    if (!report?.content) return;
    
    setCopying(true);
    try {
      await navigator.clipboard.writeText(report.content);
      toast.success('Report content copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy content. Please try again.');
    } finally {
      setCopying(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Get word count and reading time
  const wordCount = report?.content ? reportUtils.getWordCount(report.content) : 0;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  if (!report) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Report Details
          </DialogTitle>
          <DialogDescription>
            View and manage report information
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Report Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Report ID:</span>
                    <span className="text-sm text-gray-600">#{report.reportId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getReportTypeBadgeVariant(report.reportType)}>
                      {report.reportType} Report
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Generated:</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(report.generatedDate)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Created By:</span>
                    <span className="text-sm text-gray-600">
                      {report.createdBy ? `User #${report.createdBy}` : 'System'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Created At:</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Length:</span>
                    <span className="text-sm text-gray-600">
                      {wordCount} words • ~{readingTime} min read
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Report Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Report Content</h3>
                  {showCopyButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                      disabled={copying}
                      className="flex items-center gap-2"
                    >
                      {copying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copying ? 'Copying...' : 'Copy'}
                    </Button>
                  )}
                </div>
                
                <div className="p-4 border rounded-lg bg-white">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {report.content || 'No content available for this report.'}
                  </div>
                </div>
              </div>

              {/* Report Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                  <div className="text-xs text-blue-700">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.content?.length || 0}</div>
                  <div className="text-xs text-blue-700">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{readingTime}</div>
                  <div className="text-xs text-blue-700">Min Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {report.content?.split('\n').length || 0}
                  </div>
                  <div className="text-xs text-blue-700">Paragraphs</div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Modal Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-gray-500">
            Report #{report.reportId} • {report.reportType} Type
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {showDownloadButton && reportUtils.canDownloadReports(userRole) && (
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewModal;