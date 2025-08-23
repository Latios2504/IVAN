import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Settings, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';
import { chatBotService } from '@/services/chatBotService';
import { toast } from 'sonner';

interface CustomInstruction {
  instructionId: number;
  instructionName: string;
  systemPrompt: string;
  behaviorInstructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatbotConfiguration {
  enableCustomInstructions: boolean;
  defaultCustomInstructionId: number | null;
  defaultCustomInstruction: {
    instructionId: number;
    instructionName: string;
    systemPrompt: string;
    behaviorInstructions: string;
    isActive: boolean;
  } | null;
  cacheDurationMinutes: number;
  fallbackBehavior: string;
}

const ChatbotConfigurationPanel: React.FC = () => {
  const [configuration, setConfiguration] = useState<ChatbotConfiguration | null>(null);
  const [availableInstructions, setAvailableInstructions] = useState<CustomInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInstructionId, setSelectedInstructionId] = useState<string>('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [config, instructions] = await Promise.all([
        chatBotService.getConfiguration(),
        chatBotService.getAvailableInstructions()
      ]);
      
      setConfiguration(config);
      setAvailableInstructions(instructions);
      setSelectedInstructionId(config.defaultCustomInstructionId?.toString() || 'none');
    } catch (error) {
      console.error('Error loading chatbot configuration:', error);
      toast.error('Không thể tải cấu hình chatbot');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      setSaving(true);
      
      const instructionId = selectedInstructionId === 'none' ? null : parseInt(selectedInstructionId);
      const success = await chatBotService.setDefaultInstruction(instructionId);
      
      if (success) {
        toast.success('Cấu hình chatbot đã được cập nhật thành công');
        await loadData(); // Reload to get updated configuration
      } else {
        toast.error('Không thể cập nhật cấu hình chatbot');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Lỗi khi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setRefreshing(true);
      const success = await chatBotService.clearCache();
      
      if (success) {
        toast.success('Cache đã được xóa thành công');
      } else {
        toast.error('Không thể xóa cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Lỗi khi xóa cache');
    } finally {
      setRefreshing(false);
    }
  };

  const getSelectedInstruction = () => {
    if (selectedInstructionId === 'none') return null;
    return availableInstructions.find(inst => inst.instructionId.toString() === selectedInstructionId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải cấu hình...</span>
        </CardContent>
      </Card>
    );
  }

  if (!configuration) {
    return (
      <Card>
        <CardContent className="p-8">
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Không thể tải cấu hình chatbot. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cấu hình Chatbot
          </CardTitle>
          <CardDescription>
            Quản lý Custom Instruction mặc định cho chatbot. Instruction này sẽ được áp dụng cho tất cả cuộc trò chuyện với chatbot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Trạng thái hiện tại</h4>
              <p className="text-sm text-muted-foreground">
                {configuration.enableCustomInstructions ? (
                  configuration.defaultCustomInstruction ? (
                    <>Đang sử dụng: <strong>{configuration.defaultCustomInstruction.instructionName}</strong></>
                  ) : (
                    'Custom Instructions được bật nhưng chưa chọn instruction mặc định'
                  )
                ) : (
                  'Custom Instructions đã bị tắt'
                )}
              </p>
            </div>
            <Badge variant={configuration.enableCustomInstructions ? 'default' : 'secondary'}>
              {configuration.enableCustomInstructions ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {configuration.enableCustomInstructions ? 'Đã bật' : 'Đã tắt'}
            </Badge>
          </div>

          {/* Configuration Form */}
          {configuration.enableCustomInstructions && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chọn Custom Instruction mặc định
                </label>
                <Select value={selectedInstructionId} onValueChange={setSelectedInstructionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn instruction..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        Không sử dụng instruction
                      </div>
                    </SelectItem>
                    {availableInstructions.map((instruction) => (
                      <SelectItem key={instruction.instructionId} value={instruction.instructionId.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{instruction.instructionName}</span>
                          {instruction.instructionId === configuration.defaultCustomInstructionId && (
                            <Badge variant="outline" className="ml-2">Hiện tại</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview selected instruction */}
              {getSelectedInstruction() && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h5 className="font-medium mb-2">Preview Instruction</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>System Prompt:</strong>
                      <p className="text-muted-foreground mt-1 line-clamp-3">
                        {getSelectedInstruction()?.systemPrompt}
                      </p>
                    </div>
                    {getSelectedInstruction()?.behaviorInstructions && (
                      <div>
                        <strong>Behavior Instructions:</strong>
                        <p className="text-muted-foreground mt-1 line-clamp-2">
                          {getSelectedInstruction()?.behaviorInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveConfiguration} 
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu cấu hình'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleClearCache} 
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Lưu ý:</strong> Thay đổi cấu hình sẽ ảnh hưởng đến tất cả cuộc trò chuyện mới với chatbot. 
              Cache sẽ được làm mới trong {configuration.cacheDurationMinutes} phút hoặc bạn có thể xóa cache thủ công.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{availableInstructions.length}</div>
              <div className="text-sm text-muted-foreground">Tổng Instructions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {availableInstructions.filter(i => i.isActive).length}
              </div>
              <div className="text-sm text-muted-foreground">Instructions Hoạt động</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {configuration.cacheDurationMinutes}m
              </div>
              <div className="text-sm text-muted-foreground">Thời gian Cache</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotConfigurationPanel;