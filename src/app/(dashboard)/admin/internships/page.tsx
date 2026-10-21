import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InternshipTable } from "@/components/admin/InternshipTable";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInternshipsPage() {
  const session = await auth();

  // Strict Server-Side Admin Authorization
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch all internships, categories, and skills
  const [internships, categories, availableSkills] = await Promise.all([
    db.internship.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        requiredSkills: { include: { skill: true } },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.skill.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-900">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Internship Listings CRUD
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Create, edit, publish, or archive internship listings across all categories.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 text-right">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{internships.length}</p>
        </div>
      </div>

      {/* Internship Table */}
      <InternshipTable
        internships={internships}
        categories={categories}
        availableSkills={availableSkills}
      />
    </div>
  );
}
