import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminApplicationsTable } from "@/components/admin/AdminApplicationsTable";
import { ShieldCheck, Users } from "lucide-react";

export default async function AdminApplicationsPage() {
  const session = await auth();

  // Strict Admin Authorization Guard
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch candidate applications
  const applications = await db.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          profile: {
            include: {
              educations: true,
              skills: { include: { skill: true } },
            },
          },
        },
      },
      internship: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Applications Portal
          </h1>
          <p className="text-slate-500 text-sm">
            Review applicant profiles, inspect candidate qualifications, and progress application statuses.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 text-right">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-extrabold text-slate-900">{applications.length}</p>
        </div>
      </div>

      {/* Applications Table */}
      <AdminApplicationsTable applications={applications} />
    </div>
  );
}
