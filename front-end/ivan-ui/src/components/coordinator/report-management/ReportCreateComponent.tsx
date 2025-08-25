import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { reportService, validateReportData, reportUtils } from '@/services/reportService';
import type {
  ReportInputModel,
  ReportViewModel,
  ReportValidationResult,
} from '@/types/report';

interface Event {
  eventId: number;
  eventName: string;
  eventDate: string;
  status: string;
}

interface ReportCreateComponentProps {
  userRole?: string;
  coordinatorId?: number;
  onReportCreated?: (report: ReportViewModel) => void;
  onCancel?: () => void;
}

export const ReportCreateComponent: React.FC<ReportCreateComponentProps> = ({
  userRole = 'VolunteerCoordinator',
  coordinatorId,
  onReportCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReportInputModel>({
    content: '',
  });
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [validation, setValidation] = useState<ReportValidationResult>({
    isValid: true,
    errors: [],
  });
  const [wordCount, setWordCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  // Mock function to load available events - replace with actual API call
  const loadAvailableEvents = async () => {
    setLoadingEvents(true);
    try {
      // This should be replaced with actual API call to get events
      // For now, using mock data
      const mockEvents: Event[] = [
        {
          eventId: 1,
          eventName: 'Community Cleanup Drive',
          eventDate: '2024-02-15',
          status: 'Completed',
        },
        {
          eventId: 2,
          eventName: 'Food Distribution Program',
          eventDate: '2024-02-20',
          status: 'Ongoing',
        },
        {
          eventId: 3,
          eventName: 'Educational Workshop',
          eventDate: '2024-02-25',
          status: 'Completed',
        },
      ];
      
      // Filter events that are completed or ongoing (can create reports for these)
      const reportableEvents = mockEvents.filter(
        event => event.status === 'Completed' || event.status === 'Ongoing'
      );
      
      setAvailableEvents(reportableEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load available events');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ReportInputModel, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Update word count
    if (field === 'content') {
      setWordCount(reportUtils.getWordCount(value));
    }
    
    // Validate on change
    const validationResult = validateReportData(updatedData);
    setValidation(validationResult);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEventId) {
      toast.error('Please select an event to create a report for');
      return;
    }
    
    if (!validation.isValid) {
      toast.error('Please fix validation errors before submitting');
      return;
    }
    
    setLoading(true);
    try {
      const createdReport = await reportService.createEventReport(
        selectedEventId,
        formData
      );
      
      toast.success('Event report created successfully!');
      onReportCreated?.(createdReport);
      
      // Reset form
      setFormData({ content: '' });
      setSelectedEventId(null);
      setWordCount(0);
      setValidation({ isValid: true, errors: [] });
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ content: '' });
    setSelectedEventId(null);
    setWordCount(0);
    setValidation({ isValid: true, errors: [] });
    onCancel?.();
  };

  // Load events on component mount
  useEffect(() => {
    loadAvailableEvents();
  }, []);

  // Get selected event details
  const selectedEvent = availableEvents.find(event => event.eventId === selectedEventId);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Create Event Report
        </CardTitle>
        <CardDescription>
          Create a comprehensive report for a completed or ongoing event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-2">
            <Label htmlFor="event-select">Select Event *</Label>
            {loadingEvents ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading events...</span>
              </div>
            ) : (
              <Select
                value={selectedEventId?.toString() || ''}
                onValueChange={(value) => setSelectedEventId(parseInt(value))}
              >
                <SelectTrigger id="event-select">
                  <SelectValue placeholder="Choose an event to report on" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.eventId} value={event.eventId.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{event.eventName}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge
                            variant={event.status === 'Completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {event.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedEvent && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-900">
                  Selected: {selectedEvent.eventName}
                </p>
                <p className="text-xs text-blue-700">
                  Date: {new Date(selectedEvent.eventDate).toLocaleDateString()} • 
                  Status: {selectedEvent.status}
                </p>
              </div>
            )}
          </div>

          {/* Report Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Report Content *</Label>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{wordCount} words</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>
            
            {previewMode ? (
              <div className="min-h-[200px] p-4 border rounded-md bg-gray-50">
                <h4 className="font-medium mb-2">Report Preview:</h4>
                <div className="whitespace-pre-wrap text-sm">
                  {formData.content || 'No content to preview...'}
                </div>
              </div>
            ) : (
              <Textarea
                id="content"
                placeholder="Write a comprehensive report about the event. Include details about activities, outcomes, challenges, and recommendations..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="min-h-[200px] resize-y"
                disabled={loading}
              />
            )}
            
            {/* Content Guidelines */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Minimum 10 characters, maximum 10,000 characters</p>
              <p>• Include event summary, activities, participant feedback, and outcomes</p>
              <p>• Mention any challenges faced and recommendations for future events</p>
            </div>
          </div>

          {/* Validation Errors */}
          {!validation.isValid && validation.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Indicator */}
          {validation.isValid && formData.content.length > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Report content looks good! Ready to submit.
              </AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !validation.isValid || !selectedEventId}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Report
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportCreateComponent;