"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applySchema, ApplyInput, updateApplicationStatusSchema, UpdateApplicationStatusInput } from "@/lib/validations/application";
import { revalidatePath } from "next/cache";

// 1. Submit Internship Application (Student)
export async function submitApplicationAction(input: ApplyInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to submit an application." };
    }

    const validated = applySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid application details" };
    }

    const { internshipId, coverLetter } = validated.data;

    // Verify target internship exists and is published
    const job = await db.internship.findUnique({
      where: { id: internshipId },
    });

    if (!job || job.status !== "PUBLISHED") {
      return { success: false, error: "This internship position is not open for applications." };
    }

    // Check duplicate application
    const existingApp = await db.application.findUnique({
      where: {
        studentId_internshipId: {
          studentId: session.user.id,
          internshipId,
        },
      },
    });

    if (existingApp) {
      return { success: false, error: "You have already submitted an application for this internship listing." };
    }

    // Create Application
    await db.application.create({
      data: {
        studentId: session.user.id,
        internshipId,
        coverLetter: coverLetter || null,
        status: "APPLIED",
      },
    });

    revalidatePath(`/internships/${internshipId}`);
    revalidatePath("/student/applications");
    revalidatePath("/student/dashboard");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Error in submitApplicationAction:", error);
    return { success: false, error: "An unexpected error occurred while submitting your application." };
  }
}

// 2. Withdraw Application (Student)
export async function withdrawApplicationAction(applicationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const app = await db.application.findUnique({
      where: { id: applicationId },
    });

    if (!app || app.studentId !== session.user.id) {
      return { success: false, error: "Application record not found or permission denied." };
    }

    if (app.status === "WITHDRAWN") {
      return { success: false, error: "Application is already withdrawn." };
    }

    await db.application.update({
      where: { id: applicationId },
      data: { status: "WITHDRAWN" },
    });

    revalidatePath("/student/applications");
    revalidatePath("/student/dashboard");
    revalidatePath("/admin/applications");

    return { success: true, message: "Application has been withdrawn." };
  } catch (error) {
    console.error("Error in withdrawApplicationAction:", error);
    return { success: false, error: "Failed to withdraw application." };
  }
}

// 3. Update Application Status (Admin Only)
export async function adminUpdateApplicationStatusAction(input: UpdateApplicationStatusInput) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const validated = updateApplicationStatusSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid status data" };
    }

    const { applicationId, status } = validated.data;

    await db.application.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/admin/applications");
    revalidatePath("/admin/dashboard");
    revalidatePath("/student/applications");

    return { success: true, message: `Application status updated to ${status.replace("_", " ")}.` };
  } catch (error) {
    console.error("Error in adminUpdateApplicationStatusAction:", error);
    return { success: false, error: "Failed to update candidate application status." };
  }
}
