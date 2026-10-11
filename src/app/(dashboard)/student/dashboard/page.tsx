import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { GraduationCap, Briefcase, CheckCircle2, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch student profile & skills count from database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          educations: true,
        },
      },
    },
  });

  const profile = user?.profile;
  const applicationCount = await db.application.count({ where: { studentId: session.user.id } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                Student Workspace
              </Badge>
              <span className="text-xs text-indigo-300">SkillMatch Platform Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile ? `${profile.firstName} ${profile.lastName}` : session.user.email}! 👋
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              {profile?.targetRole || "Student Candidate"} • {profile?.location || "Location not set"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1 shrink-0">
            <p className="text-indigo-200 font-medium">Session Status:</p>
            <p className="font-mono text-white truncate max-w-[200px]">ID: {session.user.id}</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated as {session.user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Education History</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate max-w-[200px]">
              {profile?.educations[0]?.institution || "Not specified"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.educations[0]?.fieldOfStudy || "Add education in profile"}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills Inventory</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {profile?.skills.length || 0} Skills Added
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Technical & Soft Skills</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applications</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{applicationCount} Submitted</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track application pipeline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
