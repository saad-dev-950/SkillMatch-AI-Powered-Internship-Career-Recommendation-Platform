import { IAIServiceProvider, AISkillGapReport, ChatMessage } from "./provider.interface";
import { MockAIProvider } from "./mock.provider";
import { OpenAIProvider } from "./openai.provider";
import { MatchResult, StudentMatchingInput, InternshipMatchingInput } from "../matching";

class AIService {
  private mockProvider: MockAIProvider;

  constructor() {
    this.mockProvider = new MockAIProvider();
  }

  private getProvider(): IAIServiceProvider {
    const apiKey = process.env.OPENAI_API_KEY;
    const providerSetting = process.env.AI_PROVIDER || "mock";

    if (providerSetting.toLowerCase() === "openai" && apiKey && apiKey.trim() !== "") {
      return new OpenAIProvider(apiKey);
    }

    return this.mockProvider;
  }

  /**
   * Generates natural language match explanation with automatic fallback.
   */
  async getMatchExplanation(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<string> {
    const provider = this.getProvider();
    try {
      return await provider.generateMatchExplanation(result, student, job);
    } catch (error) {
      console.warn("⚠️ AI Provider failed, using MockAI fallback:", error);
      return await this.mockProvider.generateMatchExplanation(result, student, job);
    }
  }

  /**
   * Generates skill-gap report with automatic fallback.
   */
  async getSkillGapReport(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<AISkillGapReport> {
    const provider = this.getProvider();
    try {
      return await provider.generateSkillGapReport(result, student, job);
    } catch (error) {
      console.warn("⚠️ AI Provider failed, using MockAI fallback:", error);
      return await this.mockProvider.generateSkillGapReport(result, student, job);
    }
  }

  /**
   * Generates AI mentor guidance response with automatic fallback.
   */
  async getCareerGuidance(
    messages: ChatMessage[],
    student: StudentMatchingInput
  ): Promise<string> {
    const provider = this.getProvider();
    try {
      return await provider.generateCareerGuidance(messages, student);
    } catch (error) {
      console.warn("⚠️ AI Provider failed, using MockAI fallback:", error);
      return await this.mockProvider.generateCareerGuidance(messages, student);
    }
  }
}

export const aiService = new AIService();
