import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  UserRole,
  type RegisterData,
  PUBLIC_REGISTRATION_ROLES,
} from "@/types/auth";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "" as (typeof PUBLIC_REGISTRATION_ROLES)[number],
    phoneNumber: "",
    dateOfBirth: "",
    gender: undefined,
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    skills: [],
    interests: [],
    availability: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    organizationName: "",
    organizationType: undefined,
    organizationDescription: "",
    website: "",
    contactPersonName: "",
    contactPersonTitle: "",
    focusAreas: [],
    // Partner fields
    companyName: "",
    industry: "",
    companyDescription: "",
    partnershipInterests: [],
    expectedPartnership: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { register } = useAuth();
  const getSteps = () => {
    const isOrganization = formData.role === "organization";
    const isPartner = formData.role === "partner";

    return [
      {
        id: "basic",
        title: "Thông tin cơ bản",
        description: "Thông tin tài khoản và liên hệ",
      },
      {
        id: "personal",
        title: isOrganization
          ? "Thông tin tổ chức"
          : isPartner
          ? "Thông tin đối tác"
          : "Thông tin cá nhân",
        description: isOrganization
          ? "Chi tiết tổ chức và địa chỉ"
          : isPartner
          ? "Chi tiết đối tác và địa chỉ"
          : "Chi tiết cá nhân và địa chỉ",
      },
      {
        id: "role-specific",
        title: isOrganization
          ? "Thông tin hoạt động"
          : isPartner
          ? "Lĩnh vực hợp tác"
          : "Thông tin chuyên môn",
        description: isOrganization
          ? "Lĩnh vực và mô tả hoạt động"
          : isPartner
          ? "Loại hình và lĩnh vực hợp tác"
          : "Kỹ năng và sở thích",
      },
    ];
  };

  const steps = getSteps();

  const handleInputChange = (name: string, value: string | UserRole) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (name: string, value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [name]: items }));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      // Basic info validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Tên không được để trống";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Họ không được để trống";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email không được để trống";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
      if (!formData.password) {
        newErrors.password = "Mật khẩu không được để trống";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
      if (!formData.role) {
        newErrors.role = "Vui lòng chọn vai trò";
      }
    } else if (currentStep === 2) {
      // Role-specific validation
      if (formData.role === "organization") {
        if (!formData.organizationName?.trim()) {
          newErrors.organizationName = "Tên tổ chức không được để trống";
        }
        if (!formData.organizationType) {
          newErrors.organizationType = "Vui lòng chọn loại tổ chức";
        }
      } else if (formData.role === "partner") {
        if (!formData.companyName?.trim()) {
          newErrors.companyName = "Tên công ty không được để trống";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit when we're on the last step
    if (currentStep !== steps.length - 1) {
      handleNext();
      return;
    }

    if (!validateCurrentStep()) return;

    setIsLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };
  const renderBasicInfoStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Tên</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Văn"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            disabled={isLoading}
            className={errors.firstName ? "border-destructive" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Họ</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Nguyễn"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            disabled={isLoading}
            className={errors.lastName ? "border-destructive" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          disabled={isLoading}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        {" "}
        <Label htmlFor="phoneNumber">Số điện thoại</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="0123456789"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
          disabled={isLoading}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Vai trò</Label>
        <Select
          value={formData.role}
          onValueChange={(value) =>
            handleInputChange("role", value as UserRole)
          }
          disabled={isLoading}
        >
          <SelectTrigger className={errors.role ? "border-destructive" : ""}>
            <SelectValue placeholder="Chọn vai trò của bạn" />
          </SelectTrigger>{" "}
          <SelectContent>
            <SelectItem value="volunteer">
              <div className="flex flex-col">
                <span className="font-medium">Tình nguyện viên</span>
                <span className="text-sm text-muted-foreground">
                  Tham gia các hoạt động tình nguyện
                </span>
              </div>
            </SelectItem>
            <SelectItem value="organization">
              <div className="flex flex-col">
                <span className="font-medium">Tổ chức</span>
                <span className="text-sm text-muted-foreground">
                  Tạo và quản lý các hoạt động tình nguyện
                </span>
              </div>
            </SelectItem>
            <SelectItem value="partner">
              <div className="flex flex-col">
                <span className="font-medium">Đối tác</span>
                <span className="text-sm text-muted-foreground">
                  Hợp tác và tài trợ các hoạt động
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role}</p>
        )}
      </div>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <Select
            value={formData.gender || ""}
            onValueChange={(value) => handleInputChange("gender", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Nam</SelectItem>
              <SelectItem value="Female">Nữ</SelectItem>
              <SelectItem value="Other">Khác</SelectItem>
              <SelectItem value="Prefer not to say">
                Không muốn trả lời
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="123 Đường ABC"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Thành phố</Label>
          <Input
            id="city"
            name="city"
            type="text"
            placeholder="Hà Nội"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Tỉnh/Thành phố</Label>
          <Input
            id="state"
            name="state"
            type="text"
            placeholder="Hà Nội"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Mã bưu điện</Label>
          <Input
            id="postalCode"
            name="postalCode"
            type="text"
            placeholder="100000"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Quốc gia</Label>
          <Input
            id="country"
            name="country"
            type="text"
            placeholder="Việt Nam"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {formData.role === "volunteer" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Tên người liên hệ khẩn cấp
              </Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                type="text"
                placeholder="Nguyễn Văn B"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  handleInputChange("emergencyContactName", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                SĐT người liên hệ khẩn cấp
              </Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                type="tel"
                placeholder="0987654321"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  handleInputChange("emergencyContactPhone", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderRoleSpecificStep = () => {
    if (formData.role === "volunteer") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Kỹ năng (phân cách bằng dấu phẩy)</Label>
            <Textarea
              id="skills"
              name="skills"
              placeholder="Tin học, Tiếng Anh, Nấu ăn, ..."
              value={formData.skills?.join(", ") || ""}
              onChange={(e) => handleArrayChange("skills", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">
              Sở thích (phân cách bằng dấu phẩy)
            </Label>
            <Textarea
              id="interests"
              name="interests"
              placeholder="Hoạt động cộng đồng, Giáo dục, Môi trường, ..."
              value={formData.interests?.join(", ") || ""}
              onChange={(e) => handleArrayChange("interests", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">
              Thời gian có thể tham gia (phân cách bằng dấu phẩy)
            </Label>
            <Textarea
              id="availability"
              name="availability"
              placeholder="Thứ 2-6 chiều, Cuối tuần, ..."
              value={formData.availability?.join(", ") || ""}
              onChange={(e) =>
                handleArrayChange("availability", e.target.value)
              }
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>
      );
    }

    if (formData.role === "organization") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Tên tổ chức</Label>
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Quỹ ABC"
              value={formData.organizationName}
              onChange={(e) =>
                handleInputChange("organizationName", e.target.value)
              }
              required
              disabled={isLoading}
              className={errors.organizationName ? "border-destructive" : ""}
            />
            {errors.organizationName && (
              <p className="text-sm text-destructive">
                {errors.organizationName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizationType">Loại tổ chức</Label>
            <Select
              value={formData.organizationType || ""}
              onValueChange={(value) =>
                handleInputChange("organizationType", value)
              }
              disabled={isLoading}
            >
              <SelectTrigger
                className={errors.organizationType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Chọn loại tổ chức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGO">Tổ chức phi chính phủ (NGO)</SelectItem>
                <SelectItem value="Non-profit">
                  Tổ chức phi lợi nhuận
                </SelectItem>
                <SelectItem value="Government">Cơ quan chính phủ</SelectItem>
                <SelectItem value="Educational">Tổ chức giáo dục</SelectItem>
                <SelectItem value="Religious">Tổ chức tôn giáo</SelectItem>
                <SelectItem value="Corporate">Doanh nghiệp</SelectItem>
                <SelectItem value="Other">Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.organizationType && (
              <p className="text-sm text-destructive">
                {errors.organizationType}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizationDescription">Mô tả tổ chức</Label>
            <Textarea
              id="organizationDescription"
              name="organizationDescription"
              placeholder="Mô tả về hoạt động và mục tiêu của tổ chức..."
              value={formData.organizationDescription}
              onChange={(e) =>
                handleInputChange("organizationDescription", e.target.value)
              }
              disabled={isLoading}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Tên người liên hệ</Label>
              <Input
                id="contactPersonName"
                name="contactPersonName"
                type="text"
                placeholder="Nguyễn Văn C"
                value={formData.contactPersonName}
                onChange={(e) =>
                  handleInputChange("contactPersonName", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonTitle">Chức vụ người liên hệ</Label>
              <Input
                id="contactPersonTitle"
                name="contactPersonTitle"
                type="text"
                placeholder="Giám đốc"
                value={formData.contactPersonTitle}
                onChange={(e) =>
                  handleInputChange("contactPersonTitle", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="focusAreas">
              Lĩnh vực hoạt động (phân cách bằng dấu phẩy)
            </Label>
            <Textarea
              id="focusAreas"
              name="focusAreas"
              placeholder="Giáo dục, Y tế, Môi trường, ..."
              value={formData.focusAreas?.join(", ") || ""}
              onChange={(e) => handleArrayChange("focusAreas", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>{" "}
        </div>
      );
    }

    if (formData.role === "partner") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Tên công ty</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Công ty ABC"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              required
              disabled={isLoading}
              className={errors.companyName ? "border-destructive" : ""}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Ngành nghề</Label>
            <Input
              id="industry"
              name="industry"
              type="text"
              placeholder="Công nghệ thông tin"
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyDescription">Mô tả công ty</Label>
            <Textarea
              id="companyDescription"
              name="companyDescription"
              placeholder="Mô tả ngắn gọn về công ty của bạn..."
              value={formData.companyDescription}
              onChange={(e) =>
                handleInputChange("companyDescription", e.target.value)
              }
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website công ty</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Tên người đại diện</Label>
              <Input
                id="contactPersonName"
                name="contactPersonName"
                type="text"
                placeholder="Nguyễn Văn D"
                value={formData.contactPersonName}
                onChange={(e) =>
                  handleInputChange("contactPersonName", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonTitle">Chức vụ</Label>
              <Input
                id="contactPersonTitle"
                name="contactPersonTitle"
                type="text"
                placeholder="Giám đốc Marketing"
                value={formData.contactPersonTitle}
                onChange={(e) =>
                  handleInputChange("contactPersonTitle", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnershipInterests">
              Lĩnh vực quan tâm hợp tác (phân cách bằng dấu phẩy)
            </Label>
            <Textarea
              id="partnershipInterests"
              name="partnershipInterests"
              placeholder="Giáo dục, Y tế, Môi trường, CSR, ..."
              value={formData.partnershipInterests?.join(", ") || ""}
              onChange={(e) =>
                handleArrayChange("partnershipInterests", e.target.value)
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedPartnership">
              Hình thức hợp tác mong muốn
            </Label>
            <Textarea
              id="expectedPartnership"
              name="expectedPartnership"
              placeholder="Tài trợ tài chính, tài trợ hiện vật, hỗ trợ nhân sự, ..."
              value={formData.expectedPartnership}
              onChange={(e) =>
                handleInputChange("expectedPartnership", e.target.value)
              }
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <div className="px-6">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-px mx-4 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {currentStep === 0 && renderBasicInfoStep()}
            {currentStep === 1 && renderPersonalInfoStep()}
            {currentStep === 2 && renderRoleSpecificStep()}

            {errors.submit && (
              <p className="text-sm text-destructive text-center">
                {errors.submit}
              </p>
            )}
          </CardContent>{" "}
          <CardFooter className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
            >
              Quay lại
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="submit" disabled={isLoading}>
                Tiếp theo
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo tài khoản..." : "Hoàn thành đăng ký"}
              </Button>
            )}
          </CardFooter>
        </form>

        <div className="px-6 pb-6">
          <p className="text-sm text-center text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
