"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfileSchema, UpdateProfileInput, educationSchema, EducationInput, studentSkillSchema, StudentSkillInput } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

// 1. Update Student Profile Personal Details & Preferences
export async function updateStudentProfileAction(input: UpdateProfileInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" };
    }

    const { firstName, lastName, phone, bio, location, targetRole, preferredWorkMode, preferredCategory } = validated.data;

    // Upsert student profile for the logged in user
    await db.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        firstName,
        lastName,
        phone: phone || null,
        bio: bio || null,
        location: location || null,
        targetRole: targetRole || null,
        preferredWorkMode: preferredWorkMode || "REMOTE",
        preferredCategory: preferredCategory || null,
      },
      create: {
        userId: session.user.id,
        firstName,
        lastName,
        phone: phone || null,
        bio: bio || null,
        location: location || null,
        targetRole: targetRole || null,
        preferredWorkMode: preferredWorkMode || "REMOTE",
        preferredCategory: preferredCategory || null,
      },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error in updateStudentProfileAction:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

// 2. Add Education Entry
export async function addEducationAction(input: EducationInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = educationSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" };
    }

    const profile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: "Student profile not found. Please complete personal info first." };
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, isCurrent, gpa } = validated.data;

    await db.education.create({
      data: {
        profileId: profile.id,
        institution,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate),
        endDate: isCurrent || !endDate ? null : new Date(endDate),
        isCurrent,
        gpa: gpa || null,
      },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return { success: true, message: "Education entry added successfully!" };
  } catch (error) {
    console.error("Error in addEducationAction:", error);
    return { success: false, error: "Failed to add education entry." };
  }
}

// 3. Delete Education Entry
export async function deleteEducationAction(educationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Verify ownership
    const edu = await db.education.findUnique({
      where: { id: educationId },
      include: { profile: true },
    });

    if (!edu || edu.profile.userId !== session.user.id) {
      return { success: false, error: "Education entry not found or permission denied" };
    }

    await db.education.delete({
      where: { id: educationId },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return { success: true, message: "Education entry deleted." };
  } catch (error) {
    console.error("Error in deleteEducationAction:", error);
    return { success: false, error: "Failed to delete education entry." };
  }
}

// 4. Add/Update Student Skill
export async function addStudentSkillAction(input: StudentSkillInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = studentSkillSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid skill data" };
    }

    const profile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: "Student profile not found" };
    }

    const { skillId, level } = validated.data;

    await db.studentSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId,
        },
      },
      update: { level },
      create: {
        profileId: profile.id,
        skillId,
        level,
      },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return { success: true, message: "Skill updated in profile!" };
  } catch (error) {
    console.error("Error in addStudentSkillAction:", error);
    return { success: false, error: "Failed to update skill." };
  }
}

// 5. Remove Student Skill
export async function removeStudentSkillAction(skillId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const profile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: "Student profile not found" };
    }

    await db.studentSkill.delete({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId,
        },
      },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return { success: true, message: "Skill removed from profile." };
  } catch (error) {
    console.error("Error in removeStudentSkillAction:", error);
    return { success: false, error: "Failed to remove skill." };
  }
}
