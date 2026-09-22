"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Calendar, MapPin, ExternalLink, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { withdrawApplicationAction } from "@/lib/actions/applicationActions";

interface ApplicationItem {
  id: string;
  status: string;
  coverLetter?: string | null;
  createdAt: Date;
  internship: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    workMode: string;
    stipend?: number | null;
    category: {
      name: string;
    };
  };
}

interface StudentApplicationsListProps {
  applications: ApplicationItem[];
}

export function StudentApplicationsList({ applications }: StudentApplicationsListProps) {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const filteredApplications = applications.filter((app) => {
    if (selectedTab === "ALL") return true;
    return app.status === selectedTab;
  });

  const handleWithdraw = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to withdraw your application for "${title}"?`)) {
      setWithdrawingId(id);
      await withdrawApplicationAction(id);
      setWithdrawingId(null);
    }
  };

  const statusVariants: Record<string, "primary" | "warning" | "success" | "danger" | "secondary"> = {
    APPLIED: "primary",
    UNDER_REVIEW: "warning",
    INTERVIEWING: "warning",
    OFFERED: "success",
    REJECTED: "danger",
    WITHDRAWN: "secondary",
  };

  const tabs = [
    { label: "All Applications", value: "ALL", count: applications.length },
    { label: "Submitted", value: "APPLIED", count: applications.filter((a) => a.status === "APPLIED").length },
    { label: "Under Review", value: "UNDER_REVIEW", count: applications.filter((a) => a.status === "UNDER_REVIEW").length },
    { label: "Interviewing", value: "INTERVIEWING", count: applications.filter((a) => a.status === "INTERVIEWING").length },
    { label: "Offered", value: "OFFERED", count: applications.filter((a) => a.status === "OFFERED").length },
    { label: "Rejected", value: "REJECTED", count: applications.filter((a) => a.status === "REJECTED").length },
  ];

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              selectedTab === tab.value
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedTab === tab.value ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 max-w-xl mx-auto">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No applications found</h3>
          <p className="text-xs text-slate-500">
            {selectedTab === "ALL"
              ? "You haven't submitted any internship applications yet. Browse open listings and apply!"
              : `No applications currently in '${selectedTab.replace("_", " ")}' state.`}
          </p>
          <div className="pt-2">
            <Link href="/internships">
              <Button size="sm" className="font-semibold gap-1.5">
                Explore Internships
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[app.status] || "primary"} className="text-xs">
                    Status: {app.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/internships/${app.internship.id}`}
                    className="font-extrabold text-slate-900 text-lg hover:text-indigo-600 transition-colors"
                  >
                    {app.internship.title}
                  </Link>
                  <p className="text-xs font-medium text-slate-600 flex items-center gap-2 mt-0.5">
                    <span>{app.internship.companyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.internship.location} ({app.internship.workMode})
                    </span>
                  </p>
                </div>

                {app.coverLetter && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl line-clamp-2">
                    &ldquo;{app.coverLetter}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                <Link href={`/internships/${app.internship.id}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <span>View Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>

                {app.status === "APPLIED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWithdraw(app.id, app.internship.title)}
                    isLoading={withdrawingId === app.id}
                    className="text-xs text-slate-500 hover:text-rose-600"
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
