import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/student/ProfileForm";
import { EducationManager } from "@/components/student/EducationManager";
import { SkillManager } from "@/components/student/SkillManager";
import { User, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function StudentProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch student profile, education, skills, and categories
  const [user, categories, availableSkills] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: {
          include: {
            educations: { orderBy: { startDate: "desc" } },
            skills: { include: { skill: true } },
          },
        },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.skill.findMany({ orderBy: { name: "asc" } }),
  ]);

  const profile = user?.profile;

  // Calculate Profile Completion %
  let completionScore = 0;
  if (profile?.firstName && profile?.lastName) completionScore += 20;
  if (profile?.phone) completionScore += 10;
  if (profile?.location) completionScore += 10;
  if (profile?.targetRole) completionScore += 15;
  if (profile?.bio) completionScore += 15;
  if (profile?.educations && profile.educations.length > 0) completionScore += 15;
  if (profile?.skills && profile.skills.length > 0) completionScore += 15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>Student Profile Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Candidate Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Keep your skills, education, and career preferences up to date for optimal internship matching.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Profile Completion</span>
            <span className="text-indigo-600 font-extrabold">{completionScore}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500 rounded-full"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            {completionScore >= 80 ? "🎉 Outstanding profile strength!" : "Add more details to boost match score."}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info & Career Goals Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details & Preferences</CardTitle>
            </CardHeader>
            <ProfileForm
              initialData={{
                firstName: profile?.firstName || "",
                lastName: profile?.lastName || "",
                phone: profile?.phone,
                bio: profile?.bio,
                location: profile?.location,
                targetRole: profile?.targetRole,
                preferredWorkMode: profile?.preferredWorkMode,
                preferredCategory: profile?.preferredCategory,
              }}
              categories={categories}
            />
          </Card>
        </div>

        {/* Right Column: Education & Skills Managers */}
        <div className="space-y-8">
          <Card>
            <EducationManager educations={profile?.educations || []} />
          </Card>

          <Card>
            <SkillManager availableSkills={availableSkills} studentSkills={profile?.skills || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
