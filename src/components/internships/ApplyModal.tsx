"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { submitApplicationAction } from "@/lib/actions/applicationActions";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const res = await submitApplicationAction({
      internshipId,
      coverLetter,
    });

    setIsLoading(false);

    if (res.success) {
      setSuccess("Application submitted successfully! Redirecting...");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(res.error || "Failed to submit application.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${companyName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
          <p className="font-bold text-indigo-900">{internshipTitle}</p>
          <p className="text-indigo-700">Company: {companyName}</p>
        </div>

        {error && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}
        {success && <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">{success}</div>}

        <Textarea
          label="Cover Note / Personal Statement (Optional)"
          placeholder="Briefly describe why you are interested in this position and how your skills align with the requirements..."
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <div className="pt-3 flex justify-end gap-2 border-t">
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
