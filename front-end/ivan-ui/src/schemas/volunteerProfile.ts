import { z } from "zod";

// Skills validation schema
export const volunteerSkillSchema = z.object({
  skillId: z.number().min(1, "Skill is required"),
  proficiencyLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"], {
    errorMap: () => ({ message: "Please select a valid proficiency level" }),
  }),
});

// Create profile validation schema
export const volunteerProfileCreateSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .max(20, "Student ID must be 20 characters or less")
    .optional()
    .or(z.literal("")),
  university: z
    .string()
    .min(2, "University name must be at least 2 characters")
    .max(100, "University name must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  major: z
    .string()
    .min(2, "Major must be at least 2 characters")
    .max(100, "Major must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  yearOfStudy: z
    .number()
    .min(1, "Year of study must be at least 1")
    .max(7, "Year of study must be 7 or less")
    .optional(),
  motivation: z
    .string()
    .min(10, "Motivation must be at least 10 characters")
    .max(1000, "Motivation must be 1000 characters or less")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .max(2000, "Experience must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  availability: z
    .string()
    .max(500, "Availability must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  skills: z
    .array(volunteerSkillSchema)
    .min(1, "At least one skill is required")
    .max(20, "Maximum 20 skills allowed"),
});

// Update profile validation schema (similar to create but without userId)
export const volunteerProfileUpdateSchema = volunteerProfileCreateSchema.omit({
  userId: true,
});

// Basic profile info validation (for step-by-step forms)
export const basicProfileInfoSchema = z.object({
  studentId: z
    .string()
    .max(20, "Student ID must be 20 characters or less")
    .optional()
    .or(z.literal("")),
  university: z
    .string()
    .min(2, "University name must be at least 2 characters")
    .max(100, "University name must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  major: z
    .string()
    .min(2, "Major must be at least 2 characters")
    .max(100, "Major must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  yearOfStudy: z
    .number()
    .min(1, "Year of study must be at least 1")
    .max(7, "Year of study must be 7 or less")
    .optional(),
});

// Motivation and experience validation
export const motivationExperienceSchema = z.object({
  motivation: z
    .string()
    .min(10, "Please describe your motivation (at least 10 characters)")
    .max(1000, "Motivation must be 1000 characters or less"),
  experience: z
    .string()
    .max(2000, "Experience must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  availability: z
    .string()
    .max(500, "Availability must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

// Skills validation (for skills step)
export const skillsSchema = z.object({
  skills: z
    .array(volunteerSkillSchema)
    .min(1, "Please add at least one skill")
    .max(20, "Maximum 20 skills allowed"),
});

// Search and filter validation
export const volunteerSearchSchema = z.object({
  query: z.string().max(100, "Search query too long").optional(),
  university: z.string().optional(),
  major: z.string().optional(),
  yearOfStudy: z.number().min(1).max(7).optional(),
  skills: z.array(z.string()).max(10, "Too many skill filters").optional(),
  minRating: z.number().min(0).max(5).optional(),
  isVerified: z.boolean().optional(),
  sortBy: z
    .enum(["name", "university", "rating", "volunteerHours", "createdAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Type inference
export type VolunteerProfileCreateForm = z.infer<
  typeof volunteerProfileCreateSchema
>;
export type VolunteerProfileUpdateForm = z.infer<
  typeof volunteerProfileUpdateSchema
>;
export type BasicProfileInfoForm = z.infer<typeof basicProfileInfoSchema>;
export type MotivationExperienceForm = z.infer<
  typeof motivationExperienceSchema
>;
export type SkillsForm = z.infer<typeof skillsSchema>;
export type VolunteerSearchForm = z.infer<typeof volunteerSearchSchema>;

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be ${max} characters or less`,
  INVALID_YEAR: "Please enter a valid year of study (1-7)",
  INVALID_SKILL: "Please select a valid skill and proficiency level",
  TOO_MANY_SKILLS: "Maximum 20 skills allowed",
  MOTIVATION_TOO_SHORT:
    "Please provide more details about your motivation (at least 10 characters)",
} as const;

// Helper functions for validation
export const validateProfileStep = (step: string, data: any) => {
  switch (step) {
    case "basic":
      return basicProfileInfoSchema.safeParse(data);
    case "motivation":
      return motivationExperienceSchema.safeParse(data);
    case "skills":
      return skillsSchema.safeParse(data);
    default:
      return {
        success: false,
        error: { issues: [{ message: "Invalid step" }] },
      };
  }
};

export const validateFullProfile = (data: any, isUpdate = false) => {
  const schema = isUpdate
    ? volunteerProfileUpdateSchema
    : volunteerProfileCreateSchema;
  return schema.safeParse(data);
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  STUDENT_ID: /^[A-Za-z0-9]{1,20}$/,
  UNIVERSITY_NAME: /^[A-Za-z\s\u00C0-\u024F\u1E00-\u1EFF]{2,100}$/,
  MAJOR_NAME: /^[A-Za-z\s\u00C0-\u024F\u1E00-\u1EFF]{2,100}$/,
} as const;
