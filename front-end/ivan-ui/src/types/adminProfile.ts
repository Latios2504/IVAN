// Admin Profile API Types - Matching backend AdminProfileController

// View model for displaying admin profile data - matches backend AdminProfileViewModel
export interface AdminProfileViewModel {
  userId: number;
  email: string;
  // Personal Information from UserProfiles
  firstName?: string;
  lastName?: string;
  fullName?: string; // Computed field (FirstName + ' ' + LastName)
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string (mapped from DateOnly in backend)
  gender?: string;
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// Update DTO for updating admin profile - matches backend AdminProfileUpdateDto
export interface AdminProfileUpdateDto {
  // All fields are optional for soft updates
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string
  gender?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  avatar?: string;
}

// Avatar update DTO - matches backend AdminAvatarUpdateDto
export interface AdminAvatarUpdateDto {
  avatarUrl: string;
}

// Gender options for UI
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Nam' },
  { value: 'Female', label: 'Nữ' },
  { value: 'Other', label: 'Khác' },
] as const;

export type GenderType = typeof GENDER_OPTIONS[number]['value'];

// Profile completion helper
export interface ProfileCompletionInfo {
  completionPercentage: number;
  missingFields: string[];
}

// Helper function to calculate profile completion
export const calculateProfileCompletion = (profile: AdminProfileViewModel): ProfileCompletionInfo => {
  const requiredFields = [
    'firstName',
    'lastName', 
    'phoneNumber',
    'dateOfBirth',
    'gender',
    'address',
    'province'
  ];
  
  const missingFields: string[] = [];
  let completedFields = 0;
  
  requiredFields.forEach(field => {
    const value = profile[field as keyof AdminProfileViewModel];
    if (value && value.toString().trim() !== '') {
      completedFields++;
    } else {
      missingFields.push(field);
    }
  });
  
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  
  return {
    completionPercentage,
    missingFields
  };
};

// Form validation helpers
export const validateAdminProfileUpdate = (data: AdminProfileUpdateDto): string[] => {
  const errors: string[] = [];
  
  // Validate date of birth
  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.push('Ngày sinh không thể là ngày trong tương lai');
    }
    
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      errors.push('Tuổi phải từ 18 trở lên');
    }
  }
  
  // Validate phone number format (Vietnamese phone numbers)
  if (data.phoneNumber) {
    const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(data.phoneNumber.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }
  }
  
  // Validate names
  if (data.firstName && data.firstName.trim().length < 2) {
    errors.push('Tên phải có ít nhất 2 ký tự');
  }
  
  if (data.lastName && data.lastName.trim().length < 2) {
    errors.push('Họ phải có ít nhất 2 ký tự');
  }
  
  return errors;
};