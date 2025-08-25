import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loader2, Download, Eye, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { reportService, reportUtils } from '@/services/reportService';
import type {
  ReportViewModel,
  ReportFilterModel,
  ReportType,
} from '@/types/report';
import { REPORT_TYPES, REPORT_TYPE_OPTIONS } from '@/types/report';
import type { PagedResultDto } from '@/types/common';

interface ReportListComponentProps {
  userRole?: string;
  organizationId?: number;
  onViewReport?: (report: ReportViewModel) => void;
}

export const ReportListComponent: React.FC<ReportListComponentProps> = ({
  userRole = 'Organization',
  organizationId,
  onViewReport,
}) => {
  const [reports, setReports] = useState<PagedResultDto<ReportViewModel>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<ReportFilterModel>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
  });
  const [selectedReportType, setSelectedReportType] = useState<ReportType | 'all'>('all');

  // Load reports based on user role and filters
  const loadReports = async () => {
    setLoading(true);
    try {
      let result: PagedResultDto<ReportViewModel>;

      if (selectedReportType === 'all') {
        // Load all report types that user has access to
        const [eventReports, orgReports, systemReports] = await Promise.allSettled([
          userRole === 'Admin' || userRole === 'VolunteerCoordinator'
            ? reportService.getEventReports(filters.pageNumber, filters.pageSize)
            : Promise.resolve({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false }),
          userRole === 'Admin' || userRole === 'Organization'
            ? reportService.getOrganizationReports(filters.pageNumber, filters.pageSize)
            : Promise.resolve({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false }),
          userRole === 'Admin'
            ? reportService.getSystemReports(filters.pageNumber, filters.pageSize)
            : Promise.resolve({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false }),
        ]);

        // Combine results
        const allItems: ReportViewModel[] = [];
        let totalCount = 0;

        if (eventReports.status === 'fulfilled') {
          allItems.push(...eventReports.value.items);
          totalCount += eventReports.value.totalCount;
        }
        if (orgReports.status === 'fulfilled') {
          allItems.push(...orgReports.value.items);
          totalCount += orgReports.value.totalCount;
        }
        if (systemReports.status === 'fulfilled') {
          allItems.push(...systemReports.value.items);
          totalCount += systemReports.value.totalCount;
        }

        // Filter by search term if provided
        const filteredItems = filters.searchTerm
          ? allItems.filter(item =>
              item.content.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
              item.reportType.toLowerCase().includes(filters.searchTerm!.toLowerCase())
            )
          : allItems;

        // Sort by creation date (newest first)
        filteredItems.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        result = {
          items: filteredItems,
          totalCount: filteredItems.length,
          pageNumber: filters.pageNumber,
          pageSize: filters.pageSize,
          totalPages: Math.ceil(filteredItems.length / filters.pageSize),
          hasPreviousPage: filters.pageNumber > 1,
          hasNextPage: filters.pageNumber < Math.ceil(filteredItems.length / filters.pageSize),
        };
      } else {
        // Load specific report type
        switch (selectedReportType) {
          case REPORT_TYPES.EVENT:
            result = await reportService.getEventReports(filters.pageNumber, filters.pageSize);
            break;
          case REPORT_TYPES.ORGANIZATION:
            result = await reportService.getOrganizationReports(filters.pageNumber, filters.pageSize);
            break;
          case REPORT_TYPES.SYSTEM:
            result = await reportService.getSystemReports(filters.pageNumber, filters.pageSize);
            break;
          default:
            result = {
              items: [],
              totalCount: 0,
              pageNumber: 1,
              pageSize: 10,
              totalPages: 0,
              hasPreviousPage: false,
              hasNextPage: false,
            };
        }
      }

      setReports(result);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // Handle report download
  const handleDownloadReport = async (report: ReportViewModel) => {
    if (!reportUtils.canDownloadReports(userRole)) {
      toast.error('You do not have permission to download reports');
      return;
    }

    setDownloadingIds(prev => new Set(prev).add(report.reportId));
    try {
      let blob: Blob;

      switch (report.reportType) {
        case REPORT_TYPES.EVENT:
          blob = await reportService.downloadEventReport(report.reportId);
          break;
        case REPORT_TYPES.ORGANIZATION:
          blob = await reportService.downloadOrganizationReport(report.reportId);
          break;
        case REPORT_TYPES.SYSTEM:
          blob = await reportService.downloadSystemReport(report.reportId);
          break;
        default:
          blob = await reportService.downloadReportById(report.reportId);
      }

      reportUtils.downloadReportFile(blob, report.reportType as ReportType, report.reportId);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(report.reportId);
        return newSet;
      });
    }
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm,
      pageNumber: 1, // Reset to first page when searching
    }));
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setFilters(prev => ({ ...prev, pageNumber }));
  };

  // Handle report type filter change
  const handleReportTypeChange = (reportType: ReportType | 'all') => {
    setSelectedReportType(reportType);
    setFilters(prev => ({ ...prev, pageNumber: 1 }));
  };

  // Load reports when filters change
  useEffect(() => {
    loadReports();
  }, [filters, selectedReportType]);

  // Get available report types based on user role
  const getAvailableReportTypes = () => {
    const types = [{ value: 'all', label: 'All Reports' }];
    
    if (userRole === 'Admin' || userRole === 'VolunteerCoordinator') {
      types.push({ value: REPORT_TYPES.EVENT, label: 'Event Reports' });
    }
    if (userRole === 'Admin' || userRole === 'Organization') {
      types.push({ value: REPORT_TYPES.ORGANIZATION, label: 'Organization Reports' });
    }
    if (userRole === 'Admin') {
      types.push({ value: REPORT_TYPES.SYSTEM, label: 'System Reports' });
    }
    
    return types;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Management
        </CardTitle>
        <CardDescription>
          View and manage reports based on your role permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reports by content or type..."
                value={filters.searchTerm || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={selectedReportType}
            onValueChange={(value) => handleReportTypeChange(value as ReportType | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableReportTypes().map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading reports...</p>
                  </TableCell>
                </TableRow>
              ) : reports.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-sm text-gray-500">No reports found</p>
                  </TableCell>
                </TableRow>
              ) : (
                reports.items.map((report) => (
                  <TableRow key={report.reportId}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`bg-${reportUtils.getReportTypeColor(report.reportType)}-50 text-${reportUtils.getReportTypeColor(report.reportType)}-700 border-${reportUtils.getReportTypeColor(report.reportType)}-200`}
                      >
                        {reportUtils.getReportTypeDisplayName(report.reportType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate" title={report.content}>
                        {reportUtils.truncateContent(report.content, 80)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {reportUtils.getWordCount(report.content)} words
                      </p>
                    </TableCell>
                    <TableCell>
                      {reportUtils.formatReportDate(report.generatedDate)}
                    </TableCell>
                    <TableCell>
                      {report.createdBy ? `User #${report.createdBy}` : 'System'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReport?.(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report)}
                          disabled={downloadingIds.has(report.reportId) || !reportUtils.canDownloadReports(userRole)}
                        >
                          {downloadingIds.has(report.reportId) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {reports.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((reports.pageNumber - 1) * reports.pageSize) + 1} to{' '}
              {Math.min(reports.pageNumber * reports.pageSize, reports.totalCount)} of{' '}
              {reports.totalCount} reports
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(reports.pageNumber - 1)}
                    className={reports.hasPreviousPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, reports.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === reports.pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {reports.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(reports.pageNumber + 1)}
                    className={reports.hasNextPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportListComponent;