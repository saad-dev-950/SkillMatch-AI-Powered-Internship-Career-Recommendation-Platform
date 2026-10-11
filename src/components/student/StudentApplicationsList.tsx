"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Calendar, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { withdrawApplicationAction } from "@/lib/actions/applicationActions";
import { useToast } from "@/components/providers/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
  const [appToWithdraw, setAppToWithdraw] = useState<{ id: string; title: string } | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const toast = useToast();

  const filteredApplications = applications.filter((app) => {
    if (selectedTab === "ALL") return true;
    return app.status === selectedTab;
  });

  const confirmWithdraw = async () => {
    if (!appToWithdraw) return;
    setIsWithdrawing(true);
    try {
      const res = await withdrawApplicationAction(appToWithdraw.id);
      if (res.success) {
        toast.info(`Withdrew application for "${appToWithdraw.title}"`, "Application Withdrawn");
      } else {
        toast.error(res.error || "Failed to withdraw application.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsWithdrawing(false);
      setAppToWithdraw(null);
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
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              selectedTab === tab.value
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedTab === tab.value ? "bg-indigo-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-xl mx-auto">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
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
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[app.status] || "primary"} className="text-xs">
                    Status: {app.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/internships/${app.internship.id}`}
                    className="font-extrabold text-slate-900 dark:text-slate-100 text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {app.internship.title}
                  </Link>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{app.internship.companyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.internship.location} ({app.internship.workMode})
                    </span>
                  </p>
                </div>

                {app.coverLetter && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 max-w-xl line-clamp-2">
                    &ldquo;{app.coverLetter}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 dark:border-slate-800">
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
                    onClick={() => setAppToWithdraw({ id: app.id, title: app.internship.title })}
                    className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <ConfirmModal
        isOpen={!!appToWithdraw}
        onClose={() => setAppToWithdraw(null)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${appToWithdraw?.title}"?`}
        confirmText="Withdraw Application"
        variant="danger"
        isLoading={isWithdrawing}
      />
    </div>
  );
}
