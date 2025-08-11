import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, FileText, FileImage, Info } from "lucide-react";
import type { ExportFormat, ExportOptions } from "./ExportButton";

type DateRange = {
  from: Date;
  to: Date;
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  dataType:
    | "analytics"
    | "users"
    | "events"
    | "registrations"
    | "organizations";
  availableFormats?: ExportFormat[];
  defaultFormat?: ExportFormat;
}

interface FormatDetails {
  label: string;
  icon: typeof FileSpreadsheet;
  description: string;
  features: string[];
  color: string;
  comingSoon?: boolean;
}

const formatDetails: Record<ExportFormat, FormatDetails> = {
  excel: {
    label: "Excel",
    icon: FileSpreadsheet,
    description: "Tệp Excel (.xlsx) với nhiều trang tính, biểu đồ và định dạng",
    features: [
      "Nhiều trang tính",
      "Biểu đồ nhúng",
      "Định dạng màu sắc",
      "Bộ lọc dữ liệu",
    ],
    color: "bg-green-100 text-green-800",
  },
  csv: {
    label: "CSV",
    icon: FileText,
    description:
      "Tệp CSV (.csv) đơn giản, tương thích với Excel và Google Sheets",
    features: [
      "Dung lượng nhỏ",
      "Tương thích cao",
      "Dễ xử lý",
      "UTF-8 encoding",
    ],
    color: "bg-blue-100 text-blue-800",
  },
  pdf: {
    label: "PDF",
    icon: FileImage,
    description: "Báo cáo PDF (.pdf) chuyên nghiệp với biểu đồ và layout đẹp",
    features: [
      "Layout chuyên nghiệp",
      "Biểu đồ chất lượng cao",
      "Không thể chỉnh sửa",
      "In ấn tốt",
    ],
    color: "bg-red-100 text-red-800",
    comingSoon: true,
  },
  json: {
    label: "JSON",
    icon: FileText,
    description: "Dữ liệu JSON (.json) cho phân tích hoặc tích hợp API",
    features: ["Cấu trúc dữ liệu", "Tích hợp API", "Máy đọc được", "Nén tốt"],
    color: "bg-purple-100 text-purple-800",
  },
};

const dataTypeLabels = {
  analytics: "Thống kê phân tích",
  users: "Dữ liệu người dùng",
  events: "Dữ liệu sự kiện",
  registrations: "Đăng ký sự kiện",
  organizations: "Dữ liệu tổ chức",
};

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  dataType,
  availableFormats = ["excel", "csv", "json"],
  defaultFormat = "excel",
}) => {
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>(defaultFormat);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [language, setLanguage] = useState("vi-VN");

  const handleExport = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      includeCharts: includeCharts && selectedFormat !== "csv",
      language,
    };

    onExport(options);
  };

  const formatInfo = formatDetails[selectedFormat];
  const FormatIcon = formatInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Xuất dữ liệu - {dataTypeLabels[dataType]}</DialogTitle>
          <DialogDescription>
            Chọn định dạng tệp và cấu hình xuất dữ liệu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Định dạng tệp</Label>
            <div className="space-y-2">
              {availableFormats.map((format) => {
                const details = formatDetails[format];
                const Icon = details.icon;
                const isSelected = selectedFormat === format;

                return (
                  <Card
                    key={format}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${details.comingSoon ? "opacity-60" : ""}`}
                    onClick={() =>
                      !details.comingSoon && setSelectedFormat(format)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{details.label}</span>
                            {details.comingSoon && (
                              <Badge variant="secondary" className="text-xs">
                                Sắp có
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {details.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Additional Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Tùy chọn</Label>

            {/* Include Charts */}
            {selectedFormat !== "csv" && (
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={(checked) =>
                    setIncludeCharts(checked === true)
                  }
                />
                <div>
                  <label
                    htmlFor="includeCharts"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Bao gồm biểu đồ
                  </label>
                  <p className="text-xs text-gray-500">
                    Xuất biểu đồ cùng với dữ liệu (nếu có hỗ trợ)
                  </p>
                </div>
              </div>
            )}

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Ngôn ngữ
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={formatInfo.comingSoon}>
            {formatInfo.comingSoon ? "Chưa khả dụng" : "Xuất dữ liệu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
