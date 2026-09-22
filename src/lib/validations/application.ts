import { z } from "zod";

export const applySchema = z.object({
  internshipId: z.string().min(1, "Internship ID is required"),
  coverLetter: z.string().trim().max(2000, "Cover letter must be less than 2000 characters").optional().nullable(),
});

export type ApplyInput = z.infer<typeof applySchema>;

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  status: z.enum(["APPLIED", "UNDER_REVIEW", "INTERVIEWING", "OFFERED", "REJECTED", "WITHDRAWN"]),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
