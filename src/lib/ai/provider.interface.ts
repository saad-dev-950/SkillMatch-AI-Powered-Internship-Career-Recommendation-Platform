import { MatchResult, StudentMatchingInput, InternshipMatchingInput } from "../matching";

export interface AISkillGapReport {
  matchingSkillsSummary: string;
  missingSkillsSummary: string;
  recommendedActions: string[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface IAIServiceProvider {
  /**
   * Generates a "Why You Match" natural language explanation grounded strictly in the deterministic match score.
   */
  generateMatchExplanation(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<string>;

  /**
   * Generates a structured skill gap diagnostic report.
   */
  generateSkillGapReport(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<AISkillGapReport>;

  /**
   * Generates AI mentor career guidance responses based on conversation history and student context.
   */
  generateCareerGuidance(
    messages: ChatMessage[],
    student: StudentMatchingInput
  ): Promise<string>;
}
