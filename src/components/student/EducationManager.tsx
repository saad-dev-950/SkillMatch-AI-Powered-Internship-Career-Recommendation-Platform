"use client";

import { useState } from "react";
import { GraduationCap, Plus, Trash2, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { addEducationAction, deleteEducationAction } from "@/lib/actions/profileActions";
import { useToast } from "@/components/providers/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  gpa?: number | null;
}

interface EducationManagerProps {
  educations: EducationItem[];
}

export function EducationManager({ educations }: EducationManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [eduToDelete, setEduToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    gpa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await addEducationAction({
        institution: form.institution,
        degree: form.degree,
        fieldOfStudy: form.fieldOfStudy,
        startDate: form.startDate,
        endDate: form.isCurrent ? null : form.endDate,
        isCurrent: form.isCurrent,
        gpa: form.gpa ? parseFloat(form.gpa) : null,
      });

      if (res.success) {
        toast.success(`Added education entry for ${form.institution}`, "Education Added");
        setIsModalOpen(false);
        setForm({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          gpa: "",
        });
      } else {
        setError(res.error || "Failed to add education.");
        toast.error(res.error || "Failed to add education.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteEdu = async () => {
    if (!eduToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteEducationAction(eduToDelete.id);
      if (res.success) {
        toast.success(`Removed education entry for ${eduToDelete.name}`, "Education Removed");
      } else {
        toast.error(res.error || "Failed to remove education.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsDeleting(false);
      setEduToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Education History
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-dashed border-slate-300 dark:border-slate-700">
          <GraduationCap className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No education entries added yet.</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Add your degree, university, and field of study.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{edu.institution}</h5>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(edu.startDate).getFullYear()} -{" "}
                    {edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : "N/A"}
                  </span>
                  {edu.gpa && (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      GPA: {edu.gpa.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEduToDelete({ id: edu.id, name: edu.institution })}
                aria-label={`Remove education at ${edu.institution}`}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0"
                title="Remove entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Education Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Education Entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold">{error}</div>}

          <Input
            label="University / Institution"
            placeholder="Stanford University"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Degree"
              placeholder="Bachelor of Science"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              required
            />
            <Input
              label="Field of Study"
              placeholder="Computer Science"
              value={form.fieldOfStudy}
              onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            {!form.isCurrent && (
              <Input
                label="End Date (Expected)"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isCurrent"
              checked={form.isCurrent}
              onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="isCurrent" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              I am currently studying here
            </label>
          </div>

          <Input
            label="GPA (Optional)"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            placeholder="3.85"
            value={form.gpa}
            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
          />

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Add Education
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!eduToDelete}
        onClose={() => setEduToDelete(null)}
        onConfirm={confirmDeleteEdu}
        title="Remove Education Entry"
        message={`Are you sure you want to remove the education entry for "${eduToDelete?.name}"?`}
        confirmText="Remove Entry"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
