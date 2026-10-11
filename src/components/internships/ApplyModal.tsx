"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { submitApplicationAction } from "@/lib/actions/applicationActions";
import { useToast } from "@/components/providers/ToastProvider";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
}

export function ApplyModal({
  isOpen,
  onClose,
  internshipId,
  internshipTitle,
  companyName,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await submitApplicationAction({
        internshipId,
        coverLetter,
      });

      if (res.success) {
        toast.success(`Your application for "${internshipTitle}" at ${companyName} has been submitted!`, "Application Submitted");
        setSuccess("Application submitted successfully!");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const err = res.error || "Failed to submit application.";
        setError(err);
        toast.error(err, "Submission Failed");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${companyName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl text-xs space-y-1">
          <p className="font-bold text-indigo-900 dark:text-indigo-300">{internshipTitle}</p>
          <p className="text-indigo-700 dark:text-indigo-400">Company: {companyName}</p>
        </div>

        {error && <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">{error}</div>}
        {success && <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold">{success}</div>}

        <Textarea
          label="Cover Note / Personal Statement (Optional)"
          placeholder="Briefly describe why you are interested in this position and how your skills align with the requirements..."
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!!success}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
