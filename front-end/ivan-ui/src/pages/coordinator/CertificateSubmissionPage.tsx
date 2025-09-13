import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { certificateService } from "@/services/certificateService";
import { coordinatorQueriesService } from "@/services/coordinatorQueriesService";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateInputModel } from "@/types/certificate";
import type {
  VolunteerBriefDto,
  EventBriefDto,
} from "@/types/coordinatorQueries";
import type { CertificateTemplateViewModel } from "@/types/certificate";

interface FormData {
  volunteerId: string;
  eventId: string;
  templateId: string;
  certificateNumber: string;
  certificateName: string;
  description: string;
  hoursCompleted: string;
  performanceLevel: string;
  certificateFileUrl: string;
  digitalSignature: string;
  verificationCode: string;
  qrcodeUrl: string;
}

const CertificateSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volunteers, setVolunteers] = useState<VolunteerBriefDto[]>([]);
  const [events, setEvents] = useState<EventBriefDto[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplateViewModel[]>(
    []
  );
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    volunteerId: "",
    eventId: "",
    templateId: "",
    certificateNumber: "",
    certificateName: "",
    description: "",
    hoursCompleted: "",
    performanceLevel: "Good",
    certificateFileUrl: "",
    digitalSignature: "",
    verificationCode: "",
    qrcodeUrl: "",
  });

  // inside useEffect for loading initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);

        // Load volunteers and templates only
        const [volunteersData, templatesData] = await Promise.all([
          coordinatorQueriesService.getAllVolunteersOfMyOrganizations(),
          certificateTemplateService.getCertificateTemplates(),
        ]);

        setVolunteers(volunteersData || []);
        setTemplates(templatesData.items || []);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // fetch events whenever volunteer changes
  useEffect(() => {
    const fetchEventsForVolunteer = async () => {
      // clear current event selection whenever volunteer changes
      setFormData((prev) => ({ ...prev, eventId: "" }));

      if (!formData.volunteerId) {
        setEvents([]);
        return;
      }
      try {
        setLoadingData(true);
        const result =
          await coordinatorQueriesService.getCompletedEventsOfMyOrganizationsForVolunteer(
            parseInt(formData.volunteerId),
            { pageNumber: 1, pageSize: 1000 } // big page to fetch all
          );
        setEvents(result.items || []);
      } catch (err) {
        console.error("Error fetching events for volunteer:", err);
        setEvents([]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchEventsForVolunteer();
  }, [formData.volunteerId]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.volunteerId) errors.push("Vui lòng chọn tình nguyện viên");
    if (!formData.eventId) errors.push("Vui lòng chọn sự kiện");
    if (!formData.templateId) errors.push("Vui lòng chọn mẫu chứng chỉ");
    if (!formData.certificateName.trim())
      errors.push("Vui lòng nhập tên chứng chỉ");
    if (
      formData.hoursCompleted &&
      (isNaN(Number(formData.hoursCompleted)) ||
        Number(formData.hoursCompleted) < 0)
    ) {
      errors.push("Số giờ hoàn thành phải là số không âm");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate required fields
      const timestamp = Date.now();
      const certificateNumber = `CERT-${timestamp}`;
      const verificationCode = `VERIFY-${timestamp}`;

      const certificateInput: CertificateInputModel = {
        volunteerId: parseInt(formData.volunteerId),
        eventId: parseInt(formData.eventId),
        templateId: parseInt(formData.templateId),
        certificateNumber,
        certificateName: formData.certificateName.trim(),
        description: formData.description.trim() || undefined,
        hoursCompleted: formData.hoursCompleted
          ? Number(formData.hoursCompleted)
          : undefined,
        performanceLevel: formData.performanceLevel || undefined,
        verificationCode,
      };

      await certificateService.createCertificate(certificateInput);
      setIsSubmitted(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          volunteerId: "",
          eventId: "",
          templateId: "",
          certificateNumber: "",
          certificateName: "",
          description: "",
          hoursCompleted: "",
          performanceLevel: "Good",
          certificateFileUrl: "",
          digitalSignature: "",
          verificationCode: "",
          qrcodeUrl: "",
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error("Error creating certificate:", err);
      setError(
        err.message || "Có lỗi xảy ra khi tạo chứng chỉ. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nộp Chứng Chỉ</h1>
        <p className="text-gray-600 mt-2">
          Tạo và nộp chứng chỉ cho tình nguyện viên để tổ chức duyệt
        </p>
      </div>

      {isSubmitted && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Chứng chỉ đã được nộp thành công! Đang chờ tổ chức duyệt.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Thông Tin Chứng Chỉ</span>
          </CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để tạo chứng chỉ cho tình nguyện viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volunteer Selection */}
              <div className="space-y-2">
                <Label htmlFor="volunteerId">Tình Nguyện Viên *</Label>
                <Select
                  value={formData.volunteerId}
                  onValueChange={(value) =>
                    handleInputChange("volunteerId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình nguyện viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers.map((volunteer) => (
                      <SelectItem
                        key={volunteer.volunteerId}
                        value={volunteer.volunteerId.toString()}
                      >
                        {volunteer.fullName} - {volunteer.email} (
                        {volunteer.totalEvents} sự kiện)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Selection */}
              <div className="space-y-2">
                <Label htmlFor="eventId">Sự Kiện *</Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => handleInputChange("eventId", value)}
                  disabled={!formData.volunteerId} // disable until volunteer is chosen
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.volunteerId
                          ? "Vui lòng chọn tình nguyện viên trước"
                          : events.length === 0
                          ? "Không có sự kiện hoàn thành nào"
                          : "Chọn sự kiện"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.volunteerId && events.length > 0 ? (
                      events.map((event) => (
                        <SelectItem
                          key={event.eventId}
                          value={event.eventId.toString()}
                        >
                          {event.eventName} (
                          {new Date(event.endDate).toLocaleDateString("vi-VN")})
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="templateId">Mẫu Chứng Chỉ *</Label>
                <Select
                  value={formData.templateId}
                  onValueChange={(value) =>
                    handleInputChange("templateId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mẫu chứng chỉ" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.templateId}
                        value={template.templateId.toString()}
                      >
                        {template.templateName} - {template.templateType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Performance Level */}
              <div className="space-y-2">
                <Label htmlFor="performanceLevel">Mức Độ Thực Hiện</Label>
                <Select
                  value={formData.performanceLevel}
                  onValueChange={(value) =>
                    handleInputChange("performanceLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Xuất sắc</SelectItem>
                    <SelectItem value="Good">Tốt</SelectItem>
                    <SelectItem value="Satisfactory">Đạt yêu cầu</SelectItem>
                    <SelectItem value="Needs Improvement">
                      Cần cải thiện
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Certificate Name */}
            <div className="space-y-2">
              <Label htmlFor="certificateName">Tên Chứng Chỉ *</Label>
              <Input
                id="certificateName"
                type="text"
                value={formData.certificateName}
                onChange={(e) =>
                  handleInputChange("certificateName", e.target.value)
                }
                placeholder="Nhập tên chứng chỉ"
                className="w-full"
              />
            </div>

            {/* Hours Completed */}
            <div className="space-y-2">
              <Label htmlFor="hoursCompleted">Số Giờ Hoàn Thành</Label>
              <Input
                id="hoursCompleted"
                type="number"
                min="0"
                step="0.5"
                value={formData.hoursCompleted}
                onChange={(e) =>
                  handleInputChange("hoursCompleted", e.target.value)
                }
                placeholder="Nhập số giờ hoàn thành"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Nhập mô tả về chứng chỉ (tùy chọn)"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/coordinator/dashboard")}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang nộp...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Nộp Chứng Chỉ
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateSubmissionPage;
