import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormProgress,
  commonProgressStages,
} from "@/components/common/FormProgress";
import { Camera, Save, X } from "lucide-react";
import { toast } from "sonner";

// Validation schema for personal info
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  bio: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  user: User;
}

// Sample data for provinces and districts (Vietnam)
const PROVINCES = [
  { value: "hanoi", label: "Hà Nội" },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "danang", label: "Đà Nẵng" },
  { value: "haiphong", label: "Hải Phòng" },
  { value: "cantho", label: "Cần Thơ" },
];

const DISTRICTS: Record<string, Array<{ value: string; label: string }>> = {
  hanoi: [
    { value: "dongda", label: "Đống Đa" },
    { value: "badinh", label: "Ba Đình" },
    { value: "hoankiem", label: "Hoàn Kiếm" },
    { value: "thaihoc", label: "Thái Hòa" },
  ],
  hcm: [
    { value: "quan1", label: "Quận 1" },
    { value: "quan3", label: "Quận 3" },
    { value: "quan7", label: "Quận 7" },
    { value: "binhtan", label: "Bình Tân" },
  ],
};

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState<
    "idle" | "validating" | "uploading" | "submitting" | "completed"
  >("idle");

  // Initialize form with user data
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user.profile?.firstName || "",
      lastName: user.profile?.lastName || "",
      email: user.email,
      phoneNumber: user.profile?.phoneNumber || "",
      dateOfBirth: user.profile?.dateOfBirth || "",
      address: user.profile?.address || "",
      province: user.profile?.province || "",
      district: user.profile?.district || "",
      bio: user.profile?.bio || "",
    },
  });

  const watchedProvince = form.watch("province");

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Ảnh đại diện không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    setSubmitStage("validating");
    setSubmitProgress(20);

    try {
      // Validation stage
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Profile update stage
      setSubmitStage("submitting");
      setSubmitProgress(60);

      // TODO: Call API to update user profile
      // await userService.updateProfile(user.id, data);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If there's an avatar file, upload it separately
      if (avatarFile) {
        setSubmitStage("uploading");
        setSubmitProgress(80);

        // TODO: Call API to upload avatar
        // await userService.uploadAvatar(user.id, avatarFile);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Completion
      setSubmitStage("completed");
      setSubmitProgress(100);

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      // Reset progress after a brief delay
      setTimeout(() => {
        setSubmitStage("idle");
        setSubmitProgress(0);
      }, 1000);
    } catch (error) {
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
      console.error("Error updating profile:", error);
      setSubmitStage("idle");
      setSubmitProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Avatar Display */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.profile?.profilePicture}
              alt={user.fullName}
            />
            <AvatarFallback className="text-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {user.fullName || "Chưa cập nhật"}
            </h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Profile Information Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Số điện thoại
            </Label>
            <p className="mt-1">
              {user.profile?.phoneNumber || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Ngày sinh
            </Label>
            <p className="mt-1">
              {user.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-500">Địa chỉ</Label>
            <p className="mt-1">{user.profile?.address || "Chưa cập nhật"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Tỉnh/Thành phố
            </Label>
            <p className="mt-1">{user.profile?.province || "Chưa cập nhật"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Quận/Huyện
            </Label>
            <p className="mt-1">{user.profile?.district || "Chưa cập nhật"}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-500">
              Giới thiệu
            </Label>
            <p className="mt-1">{user.profile?.bio || "Chưa cập nhật"}</p>
          </div>
        </div>

        <Button onClick={() => setIsEditing(true)} className="w-full md:w-auto">
          Chỉnh sửa thông tin
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarPreview || user.profile?.profilePicture}
              alt={user.fullName}
            />
            <AvatarFallback className="text-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" asChild>
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Thay đổi ảnh đại diện
                </span>
              </Button>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kích thước tối đa: 5MB. Định dạng: JPG, PNG
            </p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder="Số nhà, tên đường..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Province and District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quận/Huyện</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!watchedProvince}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {watchedProvince &&
                      DISTRICTS[watchedProvince]?.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu bản thân</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Chia sẻ một chút về bản thân bạn..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Progress Indicator */}
        {isLoading && (
          <FormProgress
            currentStage={submitStage}
            progress={submitProgress}
            stages={
              avatarFile
                ? commonProgressStages.profileWithUpload
                : commonProgressStages.profileUpdate
            }
            showPercentage={true}
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Hủy bỏ
          </Button>
        </div>
      </form>
    </Form>
  );
}
