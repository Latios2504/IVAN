import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Smartphone, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

// Notification preferences schema
const notificationSettingsSchema = z.object({
  // General notification channels
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  
  // Event-related notifications
  eventReminders: z.boolean(),
  eventUpdates: z.boolean(),
  eventCancellations: z.boolean(),
  newEventOpportunities: z.boolean(),
  
  // Application and registration notifications
  applicationStatusUpdates: z.boolean(),
  registrationConfirmations: z.boolean(),
  
  // Organization and partnership notifications
  organizationUpdates: z.boolean(),
  partnershipInvitations: z.boolean(),
  collaborationUpdates: z.boolean(),
  
  // System notifications
  systemAnnouncements: z.boolean(),
  securityAlerts: z.boolean(),
  certificateUpdates: z.boolean(),
  
  // Volunteer-specific notifications (conditional based on role)
  taskAssignments: z.boolean(),
  scheduleChanges: z.boolean(),
  performanceReports: z.boolean(),
  
  // Organization-specific notifications
  volunteerApplications: z.boolean(),
  coordinatorUpdates: z.boolean(),
  reportReminders: z.boolean(),
  
  // Timing preferences
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
});

type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

interface NotificationSettingsProps {
  user: User;
}

// Sample notification data - will be replaced with API call
const getDefaultNotificationSettings = (userRole: string): NotificationSettingsFormData => {
  return {
    // General channels
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Event notifications
    eventReminders: true,
    eventUpdates: true,
    eventCancellations: true,
    newEventOpportunities: userRole === 'volunteer',
    
    // Application notifications
    applicationStatusUpdates: true,
    registrationConfirmations: true,
    
    // Organization notifications
    organizationUpdates: true,
    partnershipInvitations: userRole === 'partner' || userRole === 'organization',
    collaborationUpdates: userRole === 'partner' || userRole === 'organization',
    
    // System notifications
    systemAnnouncements: true,
    securityAlerts: true,
    certificateUpdates: userRole === 'volunteer',
    
    // Role-specific notifications
    taskAssignments: userRole === 'volunteer' || userRole === 'coordinator',
    scheduleChanges: userRole === 'volunteer' || userRole === 'coordinator',
    performanceReports: userRole === 'volunteer',
    
    volunteerApplications: userRole === 'organization' || userRole === 'coordinator',
    coordinatorUpdates: userRole === 'organization',
    reportReminders: userRole === 'organization' || userRole === 'coordinator',
    
    // Timing
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  };
};

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: getDefaultNotificationSettings(user.role),
  });

  const emailEnabled = form.watch("emailNotifications");
  const pushEnabled = form.watch("pushNotifications");
  const smsEnabled = form.watch("smsNotifications");
  const quietHoursEnabled = form.watch("quietHoursEnabled");

  const onSubmit = async (data: NotificationSettingsFormData) => {
    setIsLoading(true);
    try {
      // TODO: Call API to update notification settings
      // await notificationService.updateSettings(user.id, data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Cài đặt thông báo đã được cập nhật!");
    } catch (error) {
      toast.error("Không thể cập nhật cài đặt thông báo. Vui lòng thử lại.");
      console.error("Error updating notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Kênh nhận thông báo
            </CardTitle>
            <CardDescription>
              Chọn các kênh bạn muốn nhận thông báo từ hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormDescription>
                      Nhận thông báo qua email tại {user.email}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Thông báo đẩy
                    </FormLabel>
                    <FormDescription>
                      Hiển thị thông báo trên trình duyệt và thiết bị
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS
                      <Badge variant="secondary" className="text-xs">
                        Tính phí
                      </Badge>
                    </FormLabel>
                    <FormDescription>
                      Nhận SMS cho các thông báo quan trọng
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Event Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo sự kiện</CardTitle>
            <CardDescription>
              Quản lý thông báo liên quan đến sự kiện và hoạt động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="eventReminders"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Nhắc nhở sự kiện</FormLabel>
                    <FormDescription>
                      Nhận nhắc nhở trước khi sự kiện bắt đầu
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventUpdates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Cập nhật sự kiện</FormLabel>
                    <FormDescription>
                      Thông báo khi có thay đổi về sự kiện
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventCancellations"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Hủy sự kiện</FormLabel>
                    <FormDescription>
                      Thông báo ngay khi sự kiện bị hủy
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {user.role === 'volunteer' && (
              <FormField
                control={form.control}
                name="newEventOpportunities"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Cơ hội tình nguyện mới</FormLabel>
                      <FormDescription>
                        Thông báo về các sự kiện tình nguyện phù hợp
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Role-specific notifications */}
        {(user.role === 'volunteer' || user.role === 'coordinator') && (
          <Card>
            <CardHeader>
              <CardTitle>Thông báo công việc</CardTitle>
              <CardDescription>
                Thông báo về nhiệm vụ và lịch trình công việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="taskAssignments"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Phân công nhiệm vụ</FormLabel>
                      <FormDescription>
                        Thông báo khi được phân công nhiệm vụ mới
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduleChanges"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Thay đổi lịch trình</FormLabel>
                      <FormDescription>
                        Thông báo khi có thay đổi về lịch làm việc
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!emailEnabled && !pushEnabled && !smsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quietHoursEnabled ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              Giờ im lặng
            </CardTitle>
            <CardDescription>
              Tạm dừng thông báo trong khoảng thời gian cụ thể
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="quietHoursEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Bật giờ im lặng</FormLabel>
                    <FormDescription>
                      Không nhận thông báo trong thời gian nghỉ ngơi
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quietHoursStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bắt đầu</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quietHoursEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kết thúc</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
