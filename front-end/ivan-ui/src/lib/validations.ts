import { VALIDATION, VALIDATION_MESSAGES } from "@/constants/validation";

// Validation functions
export function validateEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone);
}

export function validatePassword(password: string): boolean {
  return VALIDATION.PASSWORD_REGEX.test(password);
}

export function validateName(name: string): boolean {
  return VALIDATION.NAME_REGEX.test(name) && name.length >= 2;
}

export function validateUsername(username: string): boolean {
  return VALIDATION.USERNAME_REGEX.test(username);
}

export function validateUrl(url: string): boolean {
  return VALIDATION.URL_REGEX.test(url);
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
