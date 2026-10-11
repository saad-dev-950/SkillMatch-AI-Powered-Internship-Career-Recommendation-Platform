import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { StudentApplicationsList } from "@/components/student/StudentApplicationsList";
import { GraduationCap } from "lucide-react";

export default async function StudentApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch applications for the logged in student
  const applications = await db.application.findMany({
    where: { studentId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      internship: {
        include: {
          category: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Candidate Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Applications Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor the status of your submitted internship applications in real-time.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 text-right">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Submitted</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{applications.length}</p>
        </div>
      </div>

      {/* Applications Tracker List */}
      <StudentApplicationsList applications={applications} />
    </div>
  );
}
