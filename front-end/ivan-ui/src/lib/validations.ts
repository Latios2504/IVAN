// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂĐĨŨƠưăđĩũơƯĐỀỂỆỄỦỨỪỬỰàáâãèéêìíòóôõùúăđĩũơưằắặẳẵằắặẳẵèéêìíòóôõùúăđĩũơưèéêìíòóôõùúăđĩũơưỀỂỆỄỦỨỪỬỰ\s]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Error messages (Vietnamese)
const VALIDATION_MESSAGES = {
  REQUIRED: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_PASSWORD:
    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  INVALID_NAME: "Tên không hợp lệ",
  INVALID_USERNAME:
    "Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang",
  INVALID_URL: "URL không hợp lệ",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  MIN_LENGTH: (min: number) => `Tối thiểu ${min} ký tự`,
  MAX_LENGTH: (max: number) => `Tối đa ${max} ký tự`,
  FILE_TOO_LARGE: "File quá lớn",
  INVALID_FILE_TYPE: "Loại file không được hỗ trợ",
} as const;

// Validation functions
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validatePassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

export function validateName(name: string): boolean {
  return NAME_REGEX.test(name) && name.length >= 2;
}

export function validateUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export function validateUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

// Field validation with error messages
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateField(
  value: string,
  type: string,
  options?: { required?: boolean; min?: number; max?: number }
): ValidationResult {
  const { required = false, min, max } = options || {};

  // Check required
  if (required && (!value || value.trim().length === 0)) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED };
  }

  // If not required and empty, it's valid
  if (!required && (!value || value.trim().length === 0)) {
    return { isValid: true };
  }

  // Length validation
  if (min && value.length < min) {
    return { isValid: false, error: VALIDATION_MESSAGES.MIN_LENGTH(min) };
  }

  if (max && value.length > max) {
    return { isValid: false, error: VALIDATION_MESSAGES.MAX_LENGTH(max) };
  }

  // Type-specific validation
  switch (type) {
    case "email":
      if (!validateEmail(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_EMAIL };
      }
      break;

    case "phone":
      if (!validatePhone(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_PHONE };
      }
      break;

    case "password":
      if (!validatePassword(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_PASSWORD };
      }
      break;

    case "name":
      if (!validateName(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_NAME };
      }
      break;

    case "username":
      if (!validateUsername(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_USERNAME };
      }
      break;

    case "url":
      if (!validateUrl(value)) {
        return { isValid: false, error: VALIDATION_MESSAGES.INVALID_URL };
      }
      break;
  }

  return { isValid: true };
}

// File validation
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: VALIDATION_MESSAGES.INVALID_FILE_TYPE };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: VALIDATION_MESSAGES.FILE_TOO_LARGE };
  }

  return { isValid: true };
}
