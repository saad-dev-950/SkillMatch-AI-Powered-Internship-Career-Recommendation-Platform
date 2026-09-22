"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateMatchScore, StudentMatchingInput, InternshipMatchingInput } from "@/lib/matching";
import { aiService } from "@/lib/ai/ai.service";
import { ChatMessage } from "@/lib/ai/provider.interface";

// Helper to format DB user to StudentMatchingInput
async function getStudentMatchingContext(userId: string): Promise<StudentMatchingInput | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
        },
      },
    },
  });

  if (!user?.profile) return null;

  return {
    id: user.id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    location: user.profile.location,
    targetRole: user.profile.targetRole,
    preferredWorkMode: user.profile.preferredWorkMode,
    preferredCategory: user.profile.preferredCategory,
    skills: user.profile.skills.map((s) => ({
      skillId: s.skillId,
      name: s.skill.name,
      level: s.level,
    })),
  };
}

// 1. Get Match Explanation ("Why You Match")
export async function getRecommendationExplanationAction(internshipId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const studentContext = await getStudentMatchingContext(session.user.id);
    if (!studentContext) {
      return { success: false, error: "Please complete your student profile first." };
    }

    const job = await db.internship.findUnique({
      where: { id: internshipId },
      include: {
        category: true,
        requiredSkills: { include: { skill: true } },
      },
    });

    if (!job || job.status !== "PUBLISHED") {
      return { success: false, error: "Internship listing not found" };
    }

    const jobContext: InternshipMatchingInput = {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      workMode: job.workMode,
      categoryId: job.categoryId,
      categoryName: job.category.name,
      requiredSkills: job.requiredSkills.map((rs) => ({
        skillId: rs.skillId,
        name: rs.skill.name,
      })),
    };

    // Calculate deterministic match score
    const matchResult = calculateMatchScore(studentContext, jobContext);

    // Generate AI explanation
    const explanation = await aiService.getMatchExplanation(matchResult, studentContext, jobContext);

    return {
      success: true,
      matchResult,
      explanation,
    };
  } catch (error) {
    console.error("Error in getRecommendationExplanationAction:", error);
    return { success: false, error: "Failed to generate match explanation." };
  }
}

// 2. Get Skill Gap Diagnostic Report
export async function getSkillGapReportAction(internshipId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const studentContext = await getStudentMatchingContext(session.user.id);
    if (!studentContext) {
      return { success: false, error: "Please complete your student profile first." };
    }

    const job = await db.internship.findUnique({
      where: { id: internshipId },
      include: {
        category: true,
        requiredSkills: { include: { skill: true } },
      },
    });

    if (!job || job.status !== "PUBLISHED") {
      return { success: false, error: "Internship listing not found" };
    }

    const jobContext: InternshipMatchingInput = {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      workMode: job.workMode,
      categoryId: job.categoryId,
      categoryName: job.category.name,
      requiredSkills: job.requiredSkills.map((rs) => ({
        skillId: rs.skillId,
        name: rs.skill.name,
      })),
    };

    const matchResult = calculateMatchScore(studentContext, jobContext);
    const report = await aiService.getSkillGapReport(matchResult, studentContext, jobContext);

    return {
      success: true,
      matchResult,
      report,
    };
  } catch (error) {
    console.error("Error in getSkillGapReportAction:", error);
    return { success: false, error: "Failed to generate skill gap report." };
  }
}

// 3. Send AI Career Mentor Chat Message
export async function sendCareerGuidanceAction(messages: ChatMessage[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const studentContext = await getStudentMatchingContext(session.user.id);
    if (!studentContext) {
      return { success: false, error: "Please complete your student profile first." };
    }

    const reply = await aiService.getCareerGuidance(messages, studentContext);

    return {
      success: true,
      reply,
    };
  } catch (error) {
    console.error("Error in sendCareerGuidanceAction:", error);
    return { success: false, error: "AI Mentor service currently unavailable." };
  }
}
