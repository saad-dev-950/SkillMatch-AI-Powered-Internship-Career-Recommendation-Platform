import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Briefcase, FolderKanban, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Strict Admin Server Check
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch admin statistics from DB
  const [studentCount, jobCount, categoryCount, applicationCount] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.internship.count(),
    db.category.count(),
    db.application.count(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-amber-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                Administrator Portal
              </Badge>
              <span className="text-xs text-amber-300">Phase 1 Milestone Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SkillMatch Platform Management 🛡️
            </h1>
            <p className="text-amber-200/80 text-sm max-w-xl">
              System administrator privileges active. Authenticated as <span className="font-semibold text-white">{session.user.email}</span>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1 shrink-0">
            <p className="text-amber-200 font-medium">Security Clearance:</p>
            <p className="font-mono text-white">ROLE: ADMIN</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Edge RBAC Verified
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{studentCount}</p>
            <p className="text-xs text-slate-500">Registered candidates</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Listings</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{jobCount}</p>
            <p className="text-xs text-slate-500">Internship opportunities</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Categories</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{categoryCount}</p>
            <p className="text-xs text-slate-500">Taxonomy classifications</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{applicationCount}</p>
            <p className="text-xs text-slate-500">Submitted by candidates</p>
          </div>
        </div>
      </div>

      {/* Phase 1 Verification Status */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Admin Security & Database Audit</h2>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            Admin Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Strict Edge Authorization</span>
              Non-admin users attempting to access `/admin/*` are automatically blocked and redirected to 403 page.
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Database Seeding Complete</span>
              Admin account (`admin@skillmatch.com`) and initial taxonomy seeded cleanly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
