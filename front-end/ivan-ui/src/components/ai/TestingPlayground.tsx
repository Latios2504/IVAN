import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  Zap,
  Copy,
  History
} from "lucide-react";
import type { AiCustomInstructionDTO } from "@/types/ai-instructions";
import { aiInstructionsService } from "@/services/api/aiInstructionsService";

interface TestingPlaygroundProps {
  instruction: AiCustomInstructionDTO;
  onClose: () => void;
}

interface TestResult {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  executionTime?: number;
  success: boolean;
  error?: string;
}

// Predefined sample queries for quick testing
const SAMPLE_QUERIES = [
  "Làm thế nào để tôi có thể tăng số lượng tình nguyện viên tham gia hoạt động?",
  "Tổ chức sự kiện từ thiện cần chuẩn bị những gì?", 
  "Cách đánh giá hiệu quả của một chương trình tình nguyện?",
  "Làm sao để giữ chân tình nguyện viên lâu dài?",
  "Quy trình tuyển dụng tình nguyện viên hiệu quả như thế nào?",
  "Báo cáo nào tôi cần để đánh giá hoạt động tổ chức?",
];

export default function TestingPlayground({ instruction, onClose }: TestingPlaygroundProps) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!currentQuery.trim()) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await aiInstructionsService.testInstruction(
        instruction.instructionId,
        { sampleQuery: currentQuery }
      );

      const executionTime = Date.now() - startTime;
      
      const newResult: TestResult = {
        id: Date.now().toString(),
        query: currentQuery,
        response: response,
        timestamp: new Date(),
        executionTime,
        success: true,
      };

      setTestResults(prev => [newResult, ...prev]);
      setCurrentQuery("");
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      const newResult: TestResult = {
        id: Date.now().toString(),
        query: currentQuery,
        response: "",
        timestamp: new Date(),
        executionTime,
        success: false,
        error: error instanceof Error ? error.message : "Đã xảy ra lỗi khi test",
      };

      setTestResults(prev => [newResult, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleQuery = (query: string) => {
    setCurrentQuery(query);
  };

  const handleClearHistory = () => {
    setTestResults([]);
  };

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Testing Playground
              </h3>
              <p className="text-sm text-gray-600">
                Test hướng dẫn: {instruction.instructionName}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Query Input */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-6 border-b">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Nhập câu hỏi test
              </h4>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="Nhập câu hỏi để test AI..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleTest}
                    disabled={!currentQuery.trim() || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? "Đang test..." : "Chạy test"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuery("")}
                    disabled={!currentQuery.trim()}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Queries */}
            <div className="p-6">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Câu hỏi mẫu
              </h5>
              <div className="space-y-2">
                {SAMPLE_QUERIES.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseSampleQuery(query)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Test Results */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Kết quả test ({testResults.length})
                </h4>
                {testResults.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    <History className="h-4 w-4 mr-1" />
                    Xóa lịch sử
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {testResults.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Bot className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Chưa có kết quả test nào
                    </p>
                    <p className="text-xs text-gray-500">
                      Nhập câu hỏi và nhấn "Chạy test" để bắt đầu
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {testResults.map((result) => (
                    <Card key={result.id} className={`${result.success ? 'border-green-200' : 'border-red-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(result.timestamp)}
                            </span>
                            {result.executionTime && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {result.executionTime}ms
                              </Badge>
                            )}
                          </div>
                          {result.success && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyResponse(result.response)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* User Query */}
                        <div className="flex space-x-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 flex-1">
                            <p className="text-sm text-gray-800">{result.query}</p>
                          </div>
                        </div>

                        {/* AI Response or Error */}
                        <div className="flex space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            result.success ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            <Bot className={`h-3 w-3 ${
                              result.success ? 'text-blue-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div className={`rounded-lg p-3 flex-1 ${
                            result.success ? 'bg-blue-50' : 'bg-red-50'
                          }`}>
                            {result.success ? (
                              <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                                {result.response}
                              </pre>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm text-red-800 font-medium">
                                  ❌ Lỗi khi test
                                </p>
                                <p className="text-sm text-red-700">
                                  {result.error}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Instruction ID: {instruction.instructionId}</span>
              <Badge variant={instruction.isActive ? "default" : "secondary"}>
                {instruction.isActive ? "Hoạt động" : "Tạm dừng"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sẵn sàng test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
