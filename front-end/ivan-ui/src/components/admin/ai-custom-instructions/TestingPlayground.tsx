import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  History,
  Settings,
} from "lucide-react";
import type { AiCustomInstructionDTO } from "@/types/ai";
import { aiInstructionsService } from "@/services/aiInstructionsService";
import { aiService } from "@/services/aiService";

interface TestingPlaygroundProps {
  instruction: AiCustomInstructionDTO;
  onClose: () => void;
}

interface TestResult {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  executionTime: number;
  success: boolean;
  error?: string;
  model: string;
  sqlData?: {
    sqlGenerated: string;
    data: any[];
    totalRows: number;
    rowsReturned: number;
    executionTime: string;
  };
}

const SAMPLE_QUERIES = [
  "Tôi có thể tham gia hoạt động tình nguyện nào?",
  "Làm thế nào để đăng ký sự kiện?",
  "Tôi muốn biết về các chương trình đào tạo",
  "Hãy giải thích về quy trình đánh giá hiệu suất",
  "Tôi cần hỗ trợ về việc lập lịch làm việc",
];

export default function TestingPlayground({
  instruction,
  onClose,
}: TestingPlaygroundProps) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  // Client-side memory (per instruction)
  const [conversationId, setConversationId] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelsResponse = await aiInstructionsService.getAvailableModels();

        // Handle direct array response for models
        if (Array.isArray(modelsResponse)) {
          setAvailableModels(modelsResponse);
        }
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  // Load memory from localStorage per instruction
  useEffect(() => {
    const keyPrefix = `ivan_playground_${instruction.instructionId}_`;
    const storedId = localStorage.getItem(keyPrefix + "conversation_id");
    const storedSummary = localStorage.getItem(keyPrefix + "summary");
    const storedResults = localStorage.getItem(keyPrefix + "results");
    if (storedId) setConversationId(storedId);
    if (storedSummary) setSummary(storedSummary);
    if (storedResults) {
      try {
        const parsed: any[] = JSON.parse(storedResults);
        const restored: TestResult[] = parsed.map((r) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        }));
        setTestResults(restored);
      } catch {}
    }
  }, [instruction.instructionId]);

  // Persist memory
  useEffect(() => {
    const keyPrefix = `ivan_playground_${instruction.instructionId}_`;
    localStorage.setItem(keyPrefix + "conversation_id", conversationId || "");
    localStorage.setItem(keyPrefix + "summary", summary || "");
    const toStore = testResults.map((r) => ({
      ...r,
      timestamp: r.timestamp.toISOString(),
    }));
    localStorage.setItem(keyPrefix + "results", JSON.stringify(toStore));
  }, [instruction.instructionId, conversationId, summary, testResults]);

  const generateConversationId = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  // Build memory from testResults as recent turns
  const buildClientMemory = () => {
    // From results, construct alternating user/assistant turns
    const recent = testResults.slice(0, 8).reverse();
    const messages = recent.flatMap((r) => [
      {
        role: "user" as const,
        content: r.query,
        timestamp: r.timestamp.toISOString(),
      },
      {
        role: "assistant" as const,
        content: r.response,
        timestamp: r.timestamp.toISOString(),
      },
    ]);
    const clientMessages = messages.slice(-8);
    const first = testResults[testResults.length - 1]?.query || "";
    const last = testResults[0]?.query || "";
    const sum = `Tóm tắt ngắn (Playground): ${
      testResults.length
    } lượt test. Chủ đề ban đầu: "${first?.slice(0, 120) || ""}". Gần đây: "${
      last?.slice(0, 120) || ""
    }".`;
    return { clientMessages, clientSummary: sum };
  };

  const handleTest = async () => {
    if (!currentQuery.trim() || !selectedModel) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      console.log(
        "Sending query to main AI service with automatic SQL detection..."
      );

      const convoId = conversationId || generateConversationId();
      const { clientMessages, clientSummary } = buildClientMemory();
      // Use the main AI service with client-side memory
      const result = await aiService.sendQuery({
        query: currentQuery,
        customInstructionId: instruction.instructionId,
        preferredModel: selectedModel,
        includeContext: true,
        conversationId: convoId,
        clientMessages,
        clientSummary,
      });

      // Handle the response from the main AI service
      const newResult: TestResult = {
        id: Date.now().toString(),
        query: currentQuery,
        response: result.response,
        timestamp: new Date(result.generatedAt || new Date()),
        executionTime: result.executionTimeMs,
        success: result.success,
        model: result.modelUsed,
        error: result.errorMessage,
        sqlData: result.sqlData,
      };

      const updated = [newResult, ...testResults];
      setTestResults(updated);
      setConversationId(convoId);
      const mem2 = buildClientMemory();
      setSummary(mem2.clientSummary);

      if (result.success) {
        setCurrentQuery("");
      }
    } catch (error) {
      const newResult: TestResult = {
        id: Date.now().toString(),
        query: currentQuery,
        response: "",
        timestamp: new Date(),
        executionTime: Date.now() - startTime,
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        model: selectedModel,
      };

      setTestResults((prev) => [newResult, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleQuery = (query: string) => {
    setCurrentQuery(query);
  };

  const handleClearHistory = () => {
    setTestResults([]);
    setConversationId("");
    setSummary("");
    const keyPrefix = `ivan_playground_${instruction.instructionId}_`;
    localStorage.removeItem(keyPrefix + "conversation_id");
    localStorage.removeItem(keyPrefix + "summary");
    localStorage.removeItem(keyPrefix + "results");
  };

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Testing Playground
              </h3>
              <p className="text-sm text-muted-foreground">
                Test hướng dẫn: {instruction.instructionName}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                🔍 Tự động phát hiện SQL: AI sẽ tự động tạo truy vấn SQL khi bạn
                hỏi về dữ liệu
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Đóng
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel - Query Input */}
          <div className="w-1/2 border-r border-border flex flex-col min-h-0">
            <div className="p-6 border-b border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Nhập câu hỏi test
              </h4>

              <div className="space-y-4">
                <Textarea
                  placeholder="Nhập câu hỏi để test AI..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  className="min-h-[100px]"
                />

                {/* Model Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Chọn mô hình Gemini
                  </label>
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Chọn mô hình để test..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          <div className="flex flex-col">
                            <span className="font-medium">{model}</span>
                            <span className="text-xs text-muted-foreground">
                              {/* MODEL_DESCRIPTIONS[model] || "Mô hình Gemini AI" */}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModel &&
                    currentConfig &&
                    currentConfig.currentModel &&
                    selectedModel === currentConfig.currentModel && (
                      <p className="text-xs text-blue-600 flex items-center">
                        <Badge variant="outline" className="mr-1">
                          Mặc định
                        </Badge>
                        Đây là mô hình hiện tại của hệ thống
                      </p>
                    )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleTest}
                    disabled={
                      !currentQuery.trim() || !selectedModel || isLoading
                    }
                    className="flex-1 rounded-xl"
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
                    className="rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Queries */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              <h5 className="text-sm font-medium text-foreground mb-3">
                Câu hỏi mẫu
              </h5>
              <div className="space-y-2">
                {SAMPLE_QUERIES.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseSampleQuery(query)}
                    className="w-full text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Test Results */}
          <div className="w-1/2 flex flex-col min-h-0">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  Kết quả test ({testResults.length})
                </h4>
                {testResults.length > 0 && (
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearHistory}
                      className="rounded-xl"
                    >
                      <History className="h-4 w-4 mr-1" />
                      Xóa lịch sử
                    </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 min-h-0">
              {testResults.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Bot className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chưa có kết quả test nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nhập câu hỏi và nhấn "Chạy test" để bắt đầu
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {testResults.map((result) => (
                    <Card
                      key={result.id}
                      className={`card-hover rounded-2xl ${
                        result.success ? "border-green-200" : "border-red-200"
                      }`}
                    >
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
                            {result.model && (
                              <Badge variant="secondary" className="text-xs">
                                <Settings className="h-3 w-3 mr-1" />
                                {result.model}
                              </Badge>
                            )}
                          </div>
                          {result.success && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCopyResponse(result.response)
                              }
                              className="rounded-xl"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* User Query */}
                        <div className="flex space-x-3">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                          <div className="bg-muted rounded-xl p-3 flex-1">
                            <p className="text-sm text-foreground">
                              {result.query}
                            </p>
                          </div>
                        </div>

                        {/* AI Response or Error */}
                        <div className="flex space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              result.success ? "bg-blue-100" : "bg-red-100"
                            }`}
                          >
                            <Bot
                              className={`h-3 w-3 ${
                                result.success
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            />
                          </div>
                          <div
                            className={`rounded-xl p-3 flex-1 ${
                              result.success ? "bg-blue-50" : "bg-red-50"
                            }`}
                          >
                            {result.success ? (
                              <div className="max-h-80 overflow-y-auto">
                                <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                                  {result.response}
                                </pre>

                                {/* Display SQL Data if available */}
                                {result.sqlData && (
                                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center mb-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800"
                                      >
                                        📊 SQL Data
                                      </Badge>
                                      <span className="text-xs text-green-600 ml-2">
                                        {result.sqlData.rowsReturned} rows
                                        returned
                                      </span>
                                    </div>

                                    <div className="text-xs text-green-700 mb-2">
                                      <strong>Generated SQL:</strong>
                                      <pre className="mt-1 p-2 bg-green-100 rounded-xl text-xs overflow-x-auto">
                                        {result.sqlData.sqlGenerated}
                                      </pre>
                                    </div>

                                    {result.sqlData.data &&
                                      result.sqlData.data.length > 0 && (
                                        <div className="text-xs text-green-700">
                                          <strong>Data Preview:</strong>
                                          <div className="mt-1 max-h-40 overflow-y-auto">
                                            <table className="w-full text-xs border-collapse">
                                              <thead className="bg-green-100">
                                                <tr>
                                                  {Object.keys(
                                                    result.sqlData.data[0]
                                                  ).map((key) => (
                                                    <th
                                                      key={key}
                                                      className="border border-green-200 px-2 py-1 text-left"
                                                    >
                                                      {key}
                                                    </th>
                                                  ))}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {result.sqlData.data
                                                  .slice(0, 5)
                                                  .map((row, index) => (
                                                    <tr
                                                      key={index}
                                                      className="border-b border-green-200"
                                                    >
                                                      {Object.values(row).map(
                                                        (value, colIndex) => (
                                                          <td
                                                            key={colIndex}
                                                            className="border border-green-200 px-2 py-1"
                                                          >
                                                            {String(
                                                              value || ""
                                                            ).substring(0, 50)}
                                                            {String(value || "")
                                                              .length > 50
                                                              ? "..."
                                                              : ""}
                                                          </td>
                                                        )
                                                      )}
                                                    </tr>
                                                  ))}
                                              </tbody>
                                            </table>
                                            {result.sqlData.data.length > 5 && (
                                              <p className="text-xs text-green-600 mt-1">
                                                ... and{" "}
                                                {result.sqlData.data.length - 5}{" "}
                                                more rows
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
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
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Instruction ID: {instruction.instructionId}</span>
              <Badge variant={instruction.isActive ? "default" : "secondary"}>
                {instruction.isActive ? "Đang hoạt động" : "Không hoạt động"}
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
