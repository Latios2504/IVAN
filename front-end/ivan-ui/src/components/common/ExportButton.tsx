import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileImage,
  Settings,
} from "lucide-react";
import { ExportModal } from "./ExportModal";

export type ExportFormat = "excel" | "csv" | "pdf" | "json";

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  sections?: string[];
  includeCharts?: boolean;
  language?: string;
}

interface ExportButtonProps {
  onExport: (format: ExportFormat, options: ExportOptions) => void;
  loading?: boolean;
  availableFormats?: ExportFormat[];
  className?: string;
  dataType?:
    | "analytics"
    | "users"
    | "events"
    | "registrations"
    | "organizations";
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

const formatConfig = {
  excel: {
    label: "Excel (.xlsx)",
    icon: FileSpreadsheet,
    description: "Tệp Excel với định dạng và biểu đồ",
    color: "text-green-600",
  },
  csv: {
    label: "CSV (.csv)",
    icon: FileText,
    description: "Tệp CSV tương thích với Excel",
    color: "text-blue-600",
  },
  pdf: {
    label: "PDF (.pdf)",
    icon: FileImage,
    description: "Báo cáo PDF chuyên nghiệp",
    color: "text-red-600",
  },
  json: {
    label: "JSON (.json)",
    icon: FileText,
    description: "Dữ liệu JSON cho API",
    color: "text-purple-600",
  },
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  loading = false,
  availableFormats = ["excel", "csv", "json"],
  className = "",
  dataType = "analytics",
  buttonText = "Xuất dữ liệu",
  variant = "default",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");

  const handleQuickExport = (format: ExportFormat) => {
    // Quick export with default options
    const defaultOptions: ExportOptions = {
      format,
      includeCharts: true,
      language: "vi-VN",
    };
    onExport(format, defaultOptions);
  };

  const handleAdvancedExport = () => {
    setIsModalOpen(true);
  };

  const handleModalExport = (options: ExportOptions) => {
    onExport(options.format, options);
    setIsModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} disabled={loading} className={className}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Đang xuất..." : buttonText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-2 py-1 text-sm font-medium text-gray-900">
            Xuất nhanh
          </div>
          <DropdownMenuSeparator />

          {availableFormats.map((format) => {
            const config = formatConfig[format];
            const Icon = config.icon;

            return (
              <DropdownMenuItem
                key={format}
                onClick={() => handleQuickExport(format)}
                className="flex items-start space-x-3 p-3"
              >
                <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className="text-xs text-gray-500">
                    {config.description}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleAdvancedExport}
            className="flex items-center space-x-3 p-3"
          >
            <Settings className="h-4 w-4 text-gray-600" />
            <div>
              <div className="text-sm font-medium">Tùy chọn nâng cao</div>
              <div className="text-xs text-gray-500">
                Cấu hình chi tiết xuất dữ liệu
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleModalExport}
        dataType={dataType}
        availableFormats={availableFormats}
        defaultFormat={selectedFormat}
      />
    </>
  );
};
