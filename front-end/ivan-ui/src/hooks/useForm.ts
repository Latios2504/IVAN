import { useState, useCallback, type ChangeEvent } from "react";

export interface UseFormResult<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
  isValid: boolean;
  handleChange: (
    field: keyof T
  ) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleValueChange: (field: keyof T, value: any) => void;
  setData: (data: T) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  validate: () => boolean;
}

export interface FormValidationRule<T> {
  field: keyof T;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, data: T) => string | null;
  message?: string;
}

export interface UseFormOptions<T> {
  initialData: T;
  validationRules?: FormValidationRule<T>[];
  onSubmit?: (data: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validationRules = [],
  onSubmit,
}: UseFormOptions<T>): UseFormResult<T> => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = useCallback(
    (field: keyof T, value: any): string | null => {
      const rules = validationRules.filter((rule) => rule.field === field);

      for (const rule of rules) {
        // Required validation
        if (
          rule.required &&
          (!value || (typeof value === "string" && value.trim() === ""))
        ) {
          return rule.message || `${String(field)} là bắt buộc`;
        }

        // Skip other validations if value is empty and not required
        if (!value || (typeof value === "string" && value.trim() === "")) {
          continue;
        }

        // Min length validation
        if (
          rule.minLength &&
          typeof value === "string" &&
          value.length < rule.minLength
        ) {
          return (
            rule.message ||
            `${String(field)} phải có ít nhất ${rule.minLength} ký tự`
          );
        }

        // Max length validation
        if (
          rule.maxLength &&
          typeof value === "string" &&
          value.length > rule.maxLength
        ) {
          return (
            rule.message ||
            `${String(field)} không được vượt quá ${rule.maxLength} ký tự`
          );
        }

        // Pattern validation
        if (
          rule.pattern &&
          typeof value === "string" &&
          !rule.pattern.test(value)
        ) {
          return rule.message || `${String(field)} không đúng định dạng`;
        }

        // Custom validation
        if (rule.custom) {
          const customResult = rule.custom(value, data);
          if (customResult) {
            return customResult;
          }
        }
      }

      return null;
    },
    [validationRules, data]
  );

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    // Validate all fields that have rules
    const fieldsToValidate = [
      ...new Set(validationRules.map((rule) => rule.field)),
    ];

    for (const field of fieldsToValidate) {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [data, validateField, validationRules]);

  const handleChange = useCallback(
    (field: keyof T) =>
      (
        e: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        setData((prev) => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  const handleValueChange = useCallback(
    (field: keyof T, value: any) => {
      setData((prev) => ({ ...prev, [field]: value }));

      // Clear error when value changes
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsLoading(false);
  }, [initialData]);

  const isValid = Object.keys(errors).length === 0;

  return {
    data,
    errors,
    isLoading,
    isValid,
    handleChange,
    handleValueChange,
    setData,
    setError,
    clearError,
    clearAllErrors,
    setLoading: setIsLoading,
    reset,
    validate,
  };
};
