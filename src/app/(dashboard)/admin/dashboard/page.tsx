import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase, FolderKanban, CheckCircle2, TrendingUp, Award, ArrowRight, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Strict Admin Authorization
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch Analytical Metrics from Database
  const [
    studentCount,
    jobCount,
    publishedJobCount,
    categoryCount,
    applicationCount,
    applicationsByStatusRaw,
    internshipsWithSkills,
    categoriesWithCounts,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.internship.count(),
    db.internship.count({ where: { status: "PUBLISHED" } }),
    db.category.count(),
    db.application.count(),
    db.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    db.internshipSkill.findMany({
      include: { skill: true },
    }),
    db.category.findMany({
      include: { _count: { select: { internships: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Process Status Counts
  const statusCounts: Record<string, number> = {
    APPLIED: 0,
    UNDER_REVIEW: 0,
    INTERVIEWING: 0,
    OFFERED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
  for (const item of applicationsByStatusRaw) {
    statusCounts[item.status] = item._count._all;
  }

  // Compute Top In-Demand Skills from Internship Requirements
  const skillFrequencyMap = new Map<string, { name: string; count: number }>();
  for (const item of internshipsWithSkills) {
    const s = item.skill;
    const existing = skillFrequencyMap.get(s.id) || { name: s.name, count: 0 };
    skillFrequencyMap.set(s.id, { name: s.name, count: existing.count + 1 });
  }

  const topSkills = Array.from(skillFrequencyMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                Administrator Analytics
              </Badge>
              <span className="text-xs text-amber-300">Live Database Metrics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SkillMatch Platform Overview
            </h1>
            <p className="text-amber-200/80 text-sm max-w-xl">
              System metric analytics based on actual student activity, job listings, and application pipelines.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1 shrink-0">
            <p className="text-amber-200 font-medium">Clearance & Status:</p>
            <p className="font-mono text-white">ROLE: ADMIN ({session.user.email})</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Server Authorized
            </p>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registered Students</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{studentCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Candidate profiles</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Listings</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{publishedJobCount} / {jobCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Published / Total Jobs</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 font-bold">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Categories</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{categoryCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Taxonomy domains</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Applications</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{applicationCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submitted pipeline</p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Application Pipeline Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Application Pipeline Breakdown</span>
              </CardTitle>
              <Link href="/admin/applications" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                <span>Manage Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Applied</span>
                <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{statusCounts.APPLIED}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Initial submission</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Under Review</span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{statusCounts.UNDER_REVIEW}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Being evaluated</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Interviewing</span>
                <span className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">{statusCounts.INTERVIEWING}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">In interview stage</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Offered 🎉</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{statusCounts.OFFERED}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Offer extended</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Rejected</span>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{statusCounts.REJECTED}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Not selected</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Withdrawn</span>
                <span className="text-2xl font-extrabold text-slate-500 dark:text-slate-400">{statusCounts.WITHDRAWN}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Withdrawn by student</span>
              </div>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Job Taxonomy Distribution</span>
              </CardTitle>
              <Link href="/admin/categories" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                <span>Manage Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {categoriesWithCounts.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</span>
                  <Badge variant="primary" className="text-[11px]">
                    {cat._count.internships} Job Listings
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Top In-Demand Skills */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Most In-Demand Job Skills</span>
              </CardTitle>
            </CardHeader>

            {topSkills.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">No skill requirements logged yet.</p>
            ) : (
              <div className="space-y-3">
                {topSkills.map((sk) => (
                  <div key={sk.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sk.name}</span>
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-md border border-indigo-100 dark:border-indigo-900">
                      Required in {sk.count} Job(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Management Links */}
          <Card>
            <CardHeader>
              <CardTitle>Management Portals</CardTitle>
            </CardHeader>

            <div className="space-y-2">
              <Link
                href="/admin/internships"
                className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 border border-indigo-200/80 dark:border-indigo-900/80 rounded-xl flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200 transition-colors"
              >
                <span>Internship CRUD Management</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </Link>
              <Link
                href="/admin/applications"
                className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-900/80 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200 transition-colors"
              >
                <span>Review Candidate Applications</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </Link>
              <Link
                href="/admin/categories"
                className="p-3.5 bg-violet-50/60 dark:bg-violet-950/40 hover:bg-violet-100/80 dark:hover:bg-violet-900/50 border border-violet-200/80 dark:border-violet-900/80 rounded-xl flex items-center justify-between text-xs font-bold text-violet-900 dark:text-violet-200 transition-colors"
              >
                <span>Job Taxonomy Categories</span>
                <ArrowRight className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
