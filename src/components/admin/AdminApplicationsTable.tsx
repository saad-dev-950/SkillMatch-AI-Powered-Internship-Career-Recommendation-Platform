"use client";

import { useState } from "react";
import { Search, Eye, Filter, User, Building2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ApplicationDetailModal } from "./ApplicationDetailModal";

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gpa?: number | null;
}

interface StudentSkill {
  id: string;
  level: string;
  skill: {
    name: string;
  };
}

interface ApplicationItem {
  id: string;
  status: string;
  coverLetter?: string | null;
  createdAt: Date;
  student: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      phone?: string | null;
      bio?: string | null;
      location?: string | null;
      targetRole?: string | null;
      educations: Education[];
      skills: StudentSkill[];
    } | null;
  };
  internship: {
    id: string;
    title: string;
    companyName: string;
  };
}

interface AdminApplicationsTableProps {
  applications: ApplicationItem[];
}

export function AdminApplicationsTable({ applications }: AdminApplicationsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [inspectingApplication, setInspectingApplication] = useState<ApplicationItem | null>(null);

  const filteredApplications = applications.filter((app) => {
    const studentName = app.student.profile
      ? `${app.student.profile.firstName} ${app.student.profile.lastName}`
      : app.student.email;

    const matchesSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.student.email.toLowerCase().includes(search.toLowerCase()) ||
      app.internship.title.toLowerCase().includes(search.toLowerCase()) ||
      app.internship.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusVariants: Record<string, "primary" | "warning" | "success" | "danger" | "secondary"> = {
    APPLIED: "primary",
    UNDER_REVIEW: "warning",
    INTERVIEWING: "warning",
    OFFERED: "success",
    REJECTED: "danger",
    WITHDRAWN: "secondary",
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search candidate name, email, or internship title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Applications Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <User className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No candidate applications found.</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-4">Applied Internship</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredApplications.map((app) => {
                  const studentName = app.student.profile
                    ? `${app.student.profile.firstName} ${app.student.profile.lastName}`
                    : app.student.email;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{studentName}</div>
                        <div className="text-slate-500 text-[11px]">{app.student.email}</div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        <div>{app.internship.title}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{app.internship.companyName}</div>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={statusVariants[app.status] || "primary"}>
                          {app.status.replace("_", " ")}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setInspectingApplication(app)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Candidate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Review Modal */}
      <ApplicationDetailModal
        isOpen={!!inspectingApplication}
        onClose={() => setInspectingApplication(null)}
        application={inspectingApplication}
      />
    </div>
  );
}
