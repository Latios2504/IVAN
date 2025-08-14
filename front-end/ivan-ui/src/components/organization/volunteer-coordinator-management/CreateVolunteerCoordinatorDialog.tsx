import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useForm } from "react-hook-form";
import { Calendar, CalendarDays, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type {
  CreateVolunteerCoordinatorDto,
  ManagementLevelDto,
  SpecializationDto,
} from "../../../types/volunteerCoordinator";
import { volunteerCoordinatorService } from "../../../services/volunteerCoordinatorService";

interface CreateVolunteerCoordinatorDialogProps {
  organizationId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  responsibilities: string;
  notes: string;
}

export const CreateVolunteerCoordinatorDialog: React.FC<
  CreateVolunteerCoordinatorDialogProps
> = ({
  organizationId,
  isOpen,
  onClose,
  onSuccess,
  managementLevels,
  specializations,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      employeeId: "",
      position: "",
      department: "",
      hireDate: new Date().toISOString().split("T")[0], // Today's date
      salary: 0,
      responsibilities: "",
      notes: "",
    },
  });

  const watchedPosition = watch("position");
  const watchedDepartment = watch("department");

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const createDto: CreateVolunteerCoordinatorDto = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        employeeId: data.employeeId,
        position: data.position,
        department: data.department,
        hireDate: data.hireDate,
        salary: data.salary,
        responsibilities: data.responsibilities,
        notes: data.notes,
      };

      await volunteerCoordinatorService.createCoordinator(
        organizationId,
        createDto
      );

      toast.success("Volunteer coordinator created successfully!");
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating volunteer coordinator:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create volunteer coordinator. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Predefined options - these would typically come from your backend or configuration
  const departmentOptions = [
    "Human Resources",
    "IT",
    "Marketing",
    "Operations",
    "Finance",
    "Customer Service",
    "Administration",
    "Events",
    "Community Outreach",
  ];

  const positionOptions = [
    "Volunteer Coordinator",
    "Senior Volunteer Coordinator",
    "Lead Volunteer Coordinator",
    "Assistant Coordinator",
    "Program Coordinator",
    "Event Coordinator",
    "Community Coordinator",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Create New Volunteer Coordinator
          </DialogTitle>
          <DialogDescription>
            Add a new volunteer coordinator to your organization. All fields
            marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  })}
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  })}
                  placeholder="Enter last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Invalid phone number format",
                    },
                  })}
                  placeholder="Enter phone number"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">
                  Employee ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeId"
                  {...register("employeeId", {
                    required: "Employee ID is required",
                  })}
                  placeholder="Enter employee ID"
                  className={errors.employeeId ? "border-red-500" : ""}
                />
                {errors.employeeId && (
                  <p className="text-sm text-red-500">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Position <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedPosition}
                  onValueChange={(value) => setValue("position", value)}
                >
                  <SelectTrigger
                    className={errors.position ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("position", {
                    required: "Position is required",
                  })}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedDepartment}
                  onValueChange={(value) => setValue("department", value)}
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("department", {
                    required: "Department is required",
                  })}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">
                  Hire Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  {...register("hireDate", {
                    required: "Hire date is required",
                  })}
                  className={errors.hireDate ? "border-red-500" : ""}
                />
                {errors.hireDate && (
                  <p className="text-sm text-red-500">
                    {errors.hireDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("salary", {
                    min: {
                      value: 0,
                      message: "Salary must be a positive number",
                    },
                    valueAsNumber: true,
                  })}
                  placeholder="Enter salary"
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && (
                  <p className="text-sm text-red-500">
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  {...register("responsibilities")}
                  placeholder="Enter key responsibilities and duties..."
                  rows={4}
                  className={errors.responsibilities ? "border-red-500" : ""}
                />
                {errors.responsibilities && (
                  <p className="text-sm text-red-500">
                    {errors.responsibilities.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Enter any additional notes or comments..."
                  rows={3}
                  className={errors.notes ? "border-red-500" : ""}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Coordinator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
