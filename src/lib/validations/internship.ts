import { z } from "zod";

export const internshipSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  companyName: z.string().trim().min(2, "Company name is required"),
  companyLogo: z.string().trim().url("Please enter a valid image URL").optional().or(z.literal("")),
  location: z.string().trim().min(2, "Location is required"),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).default("REMOTE"),
  type: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP"]).default("INTERNSHIP"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  responsibilities: z.string().trim().optional().nullable(),
  requirements: z.string().trim().optional().nullable(),
  stipend: z.coerce.number().min(0, "Stipend cannot be negative").optional().nullable(),
  categoryId: z.string().min(1, "Please select a category"),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).default("PUBLISHED"),
  deadline: z.string().optional().nullable(),
  skillIds: z.array(z.string()).min(1, "Select at least one required skill"),
});

export type InternshipInput = z.infer<typeof internshipSchema>;
