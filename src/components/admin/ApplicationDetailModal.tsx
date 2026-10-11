"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { adminUpdateApplicationStatusAction } from "@/lib/actions/applicationActions";
import { GraduationCap, Award, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

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

interface ApplicationDetailData {
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

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationDetailData | null;
}

export function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
}: ApplicationDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("APPLIED");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toast = useToast();

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
    }
    setMessage("");
  }, [application]);

  if (!application) return null;

  const profile = application.student.profile;
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : application.student.email;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await adminUpdateApplicationStatusAction({
        applicationId: application.id,
        status: selectedStatus as any,
      });

      if (res.success) {
        toast.success(
          `Updated status for ${fullName} to ${selectedStatus.replace("_", " ").toLowerCase()}`,
          "Status Updated"
        );
        setMessage("Status updated!");
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 800);
      } else {
        const err = res.error || "Failed to update status.";
        setMessage(err);
        toast.error(err, "Update Failed");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { label: "Applied (Submitted)", value: "APPLIED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Interviewing Candidate", value: "INTERVIEWING" },
    { label: "Job Offered 🎉", value: "OFFERED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Withdrawn", value: "WITHDRAWN" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Candidate Application Review`} maxWidth="2xl">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{fullName}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Applied for: <strong className="text-indigo-600 dark:text-indigo-400">{application.internship.title}</strong> ({application.internship.companyName})
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Submitted on {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Badge variant="primary" className="text-xs shrink-0 self-start sm:self-center">
            {application.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Change Status Form */}
        <form onSubmit={handleUpdateStatus} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Update Candidate Pipeline Status
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white dark:bg-slate-900"
            />
            <Button type="submit" size="md" isLoading={isLoading} className="shrink-0 font-semibold">
              Save Status
            </Button>
          </div>
          {message && <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{message}</p>}
        </form>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Note</h5>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              &ldquo;{application.coverLetter}&rdquo;
            </div>
          </div>
        )}

        {/* Candidate Profile Highlights */}
        {profile ? (
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Candidate Information</h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{application.student.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Education */}
            {profile.educations.length > 0 && (
              <div className="space-y-2">
                <h6 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Education
                </h6>
                {profile.educations.map((e) => (
                  <div key={e.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{e.institution}</span>
                    <span className="text-slate-600 dark:text-slate-400">{e.degree} in {e.fieldOfStudy}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="space-y-2">
                <h6 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  Skills
                </h6>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s.id} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                      {s.skill.name} ({s.level})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">Candidate profile has not been completed yet.</p>
        )}
      </div>
    </Modal>
  );
}
