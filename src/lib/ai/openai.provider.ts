import { IAIServiceProvider, AISkillGapReport, ChatMessage } from "./provider.interface";
import { MatchResult, StudentMatchingInput, InternshipMatchingInput } from "../matching";

export class OpenAIProvider implements IAIServiceProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-3.5-turbo") {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callOpenAI(messages: { role: string; content: string }[], jsonMode: boolean = false): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API request failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async generateMatchExplanation(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<string> {
    const prompt = `You are a career advisor AI for the SkillMatch platform.
The deterministic matching engine has computed a match score of ${result.matchScore}% for candidate ${student.firstName} ${student.lastName} applying to ${job.title} at ${job.companyName}.

Match Details:
- Overall Score: ${result.matchScore}%
- Matching Skills: ${result.matchedSkills.map((s) => s.name).join(", ") || "None"}
- Missing Required Skills: ${result.missingSkills.map((s) => s.name).join(", ") || "None"}
- Location Reason: ${result.locationMatchReason}
- Category Reason: ${result.categoryMatchReason}

STRICT INSTRUCTIONS:
- Explain WHY the candidate received this score in 2-3 concise sentences.
- DO NOT change or recalculate the numeric score of ${result.matchScore}%.
- DO NOT invent skills not listed in the input.
- Be encouraging, professional, and clear.`;

    return await this.callOpenAI([
      { role: "system", content: "You are an objective AI career assistant." },
      { role: "user", content: prompt },
    ]);
  }

  async generateSkillGapReport(
    result: MatchResult,
    student: StudentMatchingInput,
    job: InternshipMatchingInput
  ): Promise<AISkillGapReport> {
    const prompt = `You are an AI technical career coach. Perform a skill gap diagnostic report for ${student.firstName} aiming for ${job.title}.

Deterministic Match Data:
- Matching Skills: ${JSON.stringify(result.matchedSkills)}
- Missing Skills: ${JSON.stringify(result.missingSkills)}

Respond strictly in valid JSON format with keys:
{
  "matchingSkillsSummary": "string",
  "missingSkillsSummary": "string",
  "recommendedActions": ["string array of 2-3 specific learning actions"]
}`;

    const rawResponse = await this.callOpenAI(
      [
        { role: "system", content: "You respond ONLY in valid JSON format." },
        { role: "user", content: prompt },
      ],
      true
    );

    try {
      const parsed = JSON.parse(rawResponse);
      return {
        matchingSkillsSummary: parsed.matchingSkillsSummary || "Skills evaluated.",
        missingSkillsSummary: parsed.missingSkillsSummary || "Gaps evaluated.",
        recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : ["Review job requirements."],
      };
    } catch {
      throw new Error("Failed to parse OpenAI JSON response");
    }
  }

  async generateCareerGuidance(
    messages: ChatMessage[],
    student: StudentMatchingInput
  ): Promise<string> {
    const systemPrompt = `You are SkillMatch AI, an expert career mentor for higher-education students.
Candidate Context:
- Name: ${student.firstName} ${student.lastName}
- Target Role: ${student.targetRole || "Software Intern"}
- Location: ${student.location || "Not set"}
- Skills: ${student.skills.map((s) => `${s.name} (${s.level})`).join(", ") || "None listed"}

Provide helpful, actionable, and encouraging career advice. Keep answers under 150 words. Never fabricate candidate qualifications.`;

    const openAiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    return await this.callOpenAI(openAiMessages);
  }
}
