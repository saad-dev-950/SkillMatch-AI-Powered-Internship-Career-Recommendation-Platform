import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ApplyButtonSection } from "@/components/internships/ApplyButtonSection";
import { MapPin, Calendar, Building2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface InternshipDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const job = await db.internship.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      requiredSkills: { include: { skill: true } },
    },
  });

  if (!job) {
    notFound();
  }

  // Unpublished jobs are only accessible by ADMIN
  if (job.status !== "PUBLISHED" && userRole !== "ADMIN") {
    notFound();
  }

  // Check if current user has already applied
  let existingApplication = null;
  if (userId) {
    existingApplication = await db.application.findUnique({
      where: {
        studentId_internshipId: {
          studentId: userId,
          internshipId: job.id,
        },
      },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/internships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Internship Discovery
      </Link>

      {/* Header Info Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Left Column: Job Info */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 shrink-0 text-xl shadow-xs">
              <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="text-xs">
                  {job.category.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {job.workMode}
                </Badge>
                {job.status !== "PUBLISHED" && (
                  <Badge variant="warning" className="text-xs">
                    {job.status} (Admin Only)
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>{job.companyName}</span>
                <span>•</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Stipend Container Box */}
          <div className="px-5 py-4 sm:px-6 sm:py-4.5 bg-slate-50/90 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 text-left sm:text-right space-y-1.5 min-w-[200px] shadow-xs backdrop-blur-xs transition-colors">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Stipend
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {job.stipend ? `$${job.stipend.toLocaleString()}/mo` : "Paid Position"}
            </p>
            {job.deadline && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center sm:justify-end gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Apply Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ApplyButtonSection
            internshipId={job.id}
            internshipTitle={job.title}
            companyName={job.companyName}
            isLoggedIn={!!session?.user}
            userRole={userRole}
            existingApplicationStatus={existingApplication?.status}
          />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Description & Responsibilities */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Role Description</CardTitle>
            </CardHeader>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </Card>

          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </Card>
          )}

          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Qualifications</CardTitle>
              </CardHeader>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Required Skills & Listing Specs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((rs) => (
                <span
                  key={rs.skill.id}
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-100 dark:border-indigo-900"
                >
                  {rs.skill.name}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Employment Type:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{job.type.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Work Setup:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{job.workMode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Category:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{job.category.name}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400">Posted On:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
