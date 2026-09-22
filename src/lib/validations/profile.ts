import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  phone: z.string().trim().optional().nullable(),
  bio: z.string().trim().max(500, "Bio must be less than 500 characters").optional().nullable(),
  location: z.string().trim().optional().nullable(),
  targetRole: z.string().trim().optional().nullable(),
  preferredWorkMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional().nullable(),
  preferredCategory: z.string().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const educationSchema = z.object({
  institution: z.string().trim().min(2, "Institution name is required"),
  degree: z.string().trim().min(2, "Degree is required"),
  fieldOfStudy: z.string().trim().min(2, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  gpa: z.coerce.number().min(0).max(4.0).optional().nullable(),
});

export type EducationInput = z.infer<typeof educationSchema>;

export const studentSkillSchema = z.object({
  skillId: z.string().min(1, "Please select a skill"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
});

export type StudentSkillInput = z.infer<typeof studentSkillSchema>;
