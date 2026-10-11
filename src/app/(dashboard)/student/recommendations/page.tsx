import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { calculateMatchScore, StudentMatchingInput, InternshipMatchingInput } from "@/lib/matching";
import { AIRecommendationCard } from "@/components/ai/AIRecommendationCard";
import { Sparkles, Briefcase } from "lucide-react";

export default async function StudentRecommendationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch student profile & skills
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
        },
      },
    },
  });

  if (!user?.profile) {
    redirect("/student/profile");
  }

  const studentContext: StudentMatchingInput = {
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

  // Fetch open PUBLISHED internships
  const internships = await db.internship.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      requiredSkills: { include: { skill: true } },
    },
  });

  // Calculate deterministic match score for each internship
  const rankedInternships = internships
    .map((job) => {
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
      return { job, matchResult };
    })
    .sort((a, b) => b.matchResult.matchScore - a.matchResult.matchScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Deterministic AI Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personalized Internship Recommendations
          </h1>
          <p className="text-indigo-200/90 text-sm max-w-2xl">
            Open positions ranked objectively using our SkillMatch formula based on your skills, proficiency levels, and career targets.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs shrink-0 text-right space-y-1">
          <p className="text-indigo-200">Candidate Skills Tagged:</p>
          <p className="text-xl font-extrabold text-white">{studentContext.skills.length} Skills</p>
        </div>
      </div>

      {/* Ranked Listings Grid */}
      {rankedInternships.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-xl mx-auto">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No active internship listings</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Check back soon for new open positions from recruiters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedInternships.map(({ job, matchResult }) => (
            <AIRecommendationCard key={job.id} internship={job} matchResult={matchResult} />
          ))}
        </div>
      )}
    </div>
  );
}
