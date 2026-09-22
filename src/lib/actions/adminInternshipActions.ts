"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { internshipSchema, InternshipInput } from "@/lib/validations/internship";
import { revalidatePath } from "next/cache";

// Admin Authentication Guard Helper
async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { isAuthorized: false as const, error: "Unauthorized: Admin privileges required." };
  }
  return { isAuthorized: true as const, session };
}

// 1. Create Internship Listing
export async function createInternshipAction(input: InternshipInput) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    const validated = internshipSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid internship details" };
    }

    const {
      title,
      companyName,
      companyLogo,
      location,
      workMode,
      type,
      description,
      responsibilities,
      requirements,
      stipend,
      categoryId,
      status,
      deadline,
      skillIds,
    } = validated.data;

    // Create Internship record and link required skills
    await db.internship.create({
      data: {
        title,
        companyName,
        companyLogo: companyLogo || null,
        location,
        workMode,
        type,
        description,
        responsibilities: responsibilities || null,
        requirements: requirements || null,
        stipend: stipend || null,
        categoryId,
        status,
        deadline: deadline ? new Date(deadline) : null,
        requiredSkills: {
          create: skillIds.map((skillId) => ({
            skillId,
            isRequired: true,
          })),
        },
      },
    });

    revalidatePath("/admin/internships");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Internship listing created successfully!" };
  } catch (error) {
    console.error("Error in createInternshipAction:", error);
    return { success: false, error: "Failed to create internship listing." };
  }
}

// 2. Update Internship Listing
export async function updateInternshipAction(id: string, input: InternshipInput) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    const validated = internshipSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid internship details" };
    }

    const {
      title,
      companyName,
      companyLogo,
      location,
      workMode,
      type,
      description,
      responsibilities,
      requirements,
      stipend,
      categoryId,
      status,
      deadline,
      skillIds,
    } = validated.data;

    // Transactionally update listing and skill linkages
    await db.$transaction(async (tx) => {
      await tx.internship.update({
        where: { id },
        data: {
          title,
          companyName,
          companyLogo: companyLogo || null,
          location,
          workMode,
          type,
          description,
          responsibilities: responsibilities || null,
          requirements: requirements || null,
          stipend: stipend || null,
          categoryId,
          status,
          deadline: deadline ? new Date(deadline) : null,
        },
      });

      // Clear existing skill links and rebuild
      await tx.internshipSkill.deleteMany({
        where: { internshipId: id },
      });

      await tx.internshipSkill.createMany({
        data: skillIds.map((skillId) => ({
          internshipId: id,
          skillId,
          isRequired: true,
        })),
      });
    });

    revalidatePath("/admin/internships");
    revalidatePath(`/admin/internships/${id}`);
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Internship listing updated successfully!" };
  } catch (error) {
    console.error("Error in updateInternshipAction:", error);
    return { success: false, error: "Failed to update internship listing." };
  }
}

// 3. Delete Internship Listing
export async function deleteInternshipAction(id: string) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    await db.internship.delete({
      where: { id },
    });

    revalidatePath("/admin/internships");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Internship listing deleted." };
  } catch (error) {
    console.error("Error in deleteInternshipAction:", error);
    return { success: false, error: "Failed to delete internship listing." };
  }
}

// 4. Toggle Status (Publish / Unpublish / Close)
export async function toggleInternshipStatusAction(id: string, newStatus: "DRAFT" | "PUBLISHED" | "CLOSED") {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    await db.internship.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin/internships");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Internship status updated to ${newStatus}.` };
  } catch (error) {
    console.error("Error in toggleInternshipStatusAction:", error);
    return { success: false, error: "Failed to change internship status." };
  }
}
