import { IAIServiceProvider, AISkillGapReport, ChatMessage } from "./provider.interface";
import { MatchResult, StudentMatchingInput, InternshipMatchingInput } from "../matching";

export class MockAIProvider implements IAIServiceProvider {
  async generateMatchExplanation(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<string> {
    const matchedNames = result.matchedSkills.map((s) => s.name).join(", ");
    const missingNames = result.missingSkills.map((s) => s.name).join(", ");

    if (result.matchScore >= 80) {
      return `Strong ${result.matchScore}% Match! Your background in ${matchedNames || "relevant skills"} aligns exceptionally well with ${job.companyName}'s requirements for the ${job.title} position. ${result.locationMatchReason}.`;
    } else if (result.matchScore >= 50) {
      return `Moderate ${result.matchScore}% Match. You possess key skills (${matchedNames || "core competencies"}) suitable for ${job.title}. Acquiring proficiency in ${missingNames || "additional tools"} will significantly boost your candidate profile.`;
    } else {
      return `Baseline ${result.matchScore}% Match. While this ${job.title} listing requires ${missingNames || "specific technical skills"} you haven't listed yet, your foundation provides a starting point for skill development.`;
    }
  }

  async generateSkillGapReport(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<AISkillGapReport> {
    const matchedNames = result.matchedSkills.map((s) => `${s.name} (${s.studentLevel})`);
    const missingNames = result.missingSkills.map((s) => s.name);

    const recommendedActions: string[] = [];
    for (const missing of result.missingSkills) {
      recommendedActions.push(`Complete a hands-on project or tutorial covering ${missing.name} to demonstrate practical competency.`);
    }

    if (recommendedActions.length === 0) {
      recommendedActions.push("Your skill profile fully satisfies all listed technical requirements for this position!");
      recommendedActions.push("Focus on tailoring your portfolio and preparing for technical interviews.");
    }

    return {
      matchingSkillsSummary: matchedNames.length > 0
        ? `You satisfy ${matchedNames.length} key required skill(s): ${matchedNames.join(", ")}.`
        : "No direct skill overlaps identified yet.",
      missingSkillsSummary: missingNames.length > 0
        ? `Skill gap identified in ${missingNames.length} area(s): ${missingNames.join(", ")}.`
        : "Zero technical skill gaps detected for this role.",
      recommendedActions,
    };
  }

  async generateCareerGuidance(
    messages: ChatMessage[],
    student: StudentMatchingInput
  ): Promise<string> {
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const name = student.firstName || "Candidate";
    const role = student.targetRole || "Software Engineering Intern";
    const skillList = student.skills.map((s) => s.name).join(", ");

    if (lastUserMsg.toLowerCase().includes("resume") || lastUserMsg.toLowerCase().includes("cv")) {
      return `Hello ${name}! For a target role as a ${role}, structure your resume to highlight your top technical skills (${skillList || "core skills"}). Emphasize project outcomes, quantified metrics (e.g. 'improved performance by 25%'), and clear links to your GitHub/Portfolio.`;
    } else if (lastUserMsg.toLowerCase().includes("interview")) {
      return `Great question, ${name}! To prepare for interviews in ${role}, focus on explaining technical decision trade-offs, demonstrating problem-solving methodologies, and reviewing data structures and system design fundamentals.`;
    } else {
      return `Hello ${name}! As a candidate targeting ${role} positions with skills in ${skillList || "various domains"}, focus on building 1–2 polished end-to-end projects. Having live deployed demonstrations and clean code repositories is the single best way to stand out to internship recruiters. How else can I guide your career journey?`;
    }
  }
}
