import { calculateMatchScore, StudentMatchingInput, InternshipMatchingInput } from "./matching";

function runUnitTests() {
  console.log("🧪 Running Deterministic Matching Engine Unit Tests...\n");
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAILED: ${testName} - ${detail || ""}`);
      failedCount++;
    }
  }

  // 1. Test Perfect Match (100%)
  const perfectStudent: StudentMatchingInput = {
    id: "s1",
    firstName: "Alex",
    lastName: "Rivera",
    location: "San Francisco, CA",
    targetRole: "Software Engineer",
    preferredWorkMode: "REMOTE",
    preferredCategory: "cat-1",
    skills: [
      { skillId: "sk-react", name: "React", level: "EXPERT" },
      { skillId: "sk-ts", name: "TypeScript", level: "EXPERT" },
    ],
  };

  const perfectJob: InternshipMatchingInput = {
    id: "j1",
    title: "React Engineer Intern",
    companyName: "Vercel",
    location: "San Francisco, CA",
    workMode: "REMOTE",
    categoryId: "cat-1",
    categoryName: "Software Engineering",
    requiredSkills: [
      { skillId: "sk-react", name: "React" },
      { skillId: "sk-ts", name: "TypeScript" },
    ],
  };

  const perfectResult = calculateMatchScore(perfectStudent, perfectJob);
  assert(perfectResult.matchScore === 100, "Perfect Match Score equals 100%");
  assert(perfectResult.matchedSkills.length === 2, "Perfect Match has 2 matched skills");
  assert(perfectResult.missingSkills.length === 0, "Perfect Match has 0 missing skills");

  // 2. Test Partial Skill Match & Intermediate Proficiency
  const partialStudent: StudentMatchingInput = {
    id: "s2",
    firstName: "Jordan",
    lastName: "Lee",
    location: "New York, NY",
    targetRole: "Full Stack",
    preferredWorkMode: "HYBRID",
    preferredCategory: "cat-1",
    skills: [{ skillId: "sk-react", name: "React", level: "BEGINNER" }], // 0.70 weight
  };

  const multiSkillJob: InternshipMatchingInput = {
    id: "j2",
    title: "Full Stack Developer",
    companyName: "Stripe",
    location: "New York, NY",
    workMode: "HYBRID",
    categoryId: "cat-1",
    categoryName: "Software Engineering",
    requiredSkills: [
      { skillId: "sk-react", name: "React" },
      { skillId: "sk-node", name: "Node.js" },
    ],
  };

  const partialResult = calculateMatchScore(partialStudent, multiSkillJob);
  // SkillScore: (0.70 + 0) / 2 * 100 = 35%
  // LocationScore: HYBRID match = 100%
  // CategoryScore: Exact category match = 100%
  // RawScore: (0.60 * 35) + (0.20 * 100) + (0.20 * 100) = 21 + 20 + 20 = 61%
  assert(partialResult.matchScore === 61, "Partial Skill Match Score equals 61%");
  assert(partialResult.matchedSkills.length === 1, "Partial Match has 1 matched skill");
  assert(partialResult.missingSkills.length === 1, "Partial Match has 1 missing skill (Node.js)");

  // 3. Test Zero Skill Overlap
  const zeroSkillStudent: StudentMatchingInput = {
    id: "s3",
    firstName: "Taylor",
    lastName: "Swift",
    location: "Miami, FL",
    targetRole: "UI UX Designer",
    preferredWorkMode: "ONSITE",
    preferredCategory: "cat-design",
    skills: [{ skillId: "sk-figma", name: "Figma", level: "EXPERT" }],
  };

  const zeroResult = calculateMatchScore(zeroSkillStudent, perfectJob);
  // SkillScore: 0%
  // LocationScore: Remote job = 100%
  // CategoryScore: cat-design vs cat-1 = 50%
  // RawScore: (0.60 * 0) + (0.20 * 100) + (0.20 * 50) = 0 + 20 + 10 = 30%
  assert(zeroResult.matchScore === 30, "Zero Skill Overlap Score equals 30%");
  assert(zeroResult.matchedSkills.length === 0, "Zero Skill Overlap has 0 matched skills");
  assert(zeroResult.missingSkills.length === 2, "Zero Skill Overlap has 2 missing skills");

  // 4. Test Score Bounds (0 - 100)
  assert(perfectResult.matchScore >= 0 && perfectResult.matchScore <= 100, "Score is bounded between 0 and 100");
  assert(partialResult.matchScore >= 0 && partialResult.matchScore <= 100, "Score is bounded between 0 and 100");
  assert(zeroResult.matchScore >= 0 && zeroResult.matchScore <= 100, "Score is bounded between 0 and 100");

  console.log(`\n📊 Test Summary: ${passedCount} Passed, ${failedCount} Failed.\n`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runUnitTests();
