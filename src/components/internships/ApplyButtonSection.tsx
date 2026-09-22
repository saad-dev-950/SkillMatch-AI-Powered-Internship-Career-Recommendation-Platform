"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ApplyModal } from "./ApplyModal";
import { CheckCircle2, ArrowRight, Lock } from "lucide-react";

interface ApplyButtonSectionProps {
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  isLoggedIn: boolean;
  userRole?: string;
  existingApplicationStatus?: string | null;
}

export function ApplyButtonSection({
  internshipId,
  internshipTitle,
  companyName,
  isLoggedIn,
  userRole,
  existingApplicationStatus,
}: ApplyButtonSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusVariants: Record<string, "success" | "warning" | "primary" | "danger"> = {
    APPLIED: "primary",
    UNDER_REVIEW: "warning",
    INTERVIEWING: "warning",
    OFFERED: "success",
    REJECTED: "danger",
    WITHDRAWN: "danger",
  };

  if (existingApplicationStatus) {
    return (
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900 text-xs block">You Have Applied</span>
            <span className="text-[11px] text-emerald-700">Status: {existingApplicationStatus.replace("_", " ")}</span>
          </div>
        </div>
        <Link href="/student/applications">
          <Button variant="outline" size="sm" className="text-xs bg-white">
            View My Applications
          </Button>
        </Link>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Sign in with a student account to apply to this internship listing.</span>
        </div>
        <Link href={`/login?callbackUrl=/internships/${internshipId}`}>
          <Button size="sm" className="text-xs font-semibold gap-1">
            Sign In to Apply
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="lg"
        className="w-full sm:w-auto px-8 font-extrabold shadow-indigo-200 gap-2"
      >
        Apply for Position
        <ArrowRight className="w-4 h-4" />
      </Button>

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        internshipId={internshipId}
        internshipTitle={internshipTitle}
        companyName={companyName}
      />
    </>
  );
}
