// Validation constants and regex patterns
export const VALIDATION = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone validation (Vietnamese format)
  PHONE_REGEX: /^(\+84|84|0)(3|5|7|8|9)\d{8}$/,

  // Password requirements
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Name validation (Vietnamese characters)
  NAME_REGEX:
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂĐĨŨƠưăđĩũơƯĐỀỂỆỄỦỨỪỬỰàáâãèéêìíòóôõùúăđĩũơưằắặẳẵằắặẳẵèéêìíòóôõùúăđĩũơưèéêìíòóôõùúăđĩũơưỀỂỆỄỦỨỪỬỰ\s]+$/,

  // Username validation
  USERNAME_REGEX: /^[a-zA-Z0-9_-]{3,20}$/,

  // URL validation
  URL_REGEX:
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// Error messages (Vietnamese)
export const VALIDATION_MESSAGES = {
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
