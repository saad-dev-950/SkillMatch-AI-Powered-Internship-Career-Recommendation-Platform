"use client";

import { useState } from "react";
import { GraduationCap, Plus, Trash2, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { addEducationAction, deleteEducationAction } from "@/lib/actions/profileActions";

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

    const res = await addEducationAction({
      institution: form.institution,
      degree: form.degree,
      fieldOfStudy: form.fieldOfStudy,
      startDate: form.startDate,
      endDate: form.isCurrent ? null : form.endDate,
      isCurrent: form.isCurrent,
      gpa: form.gpa ? parseFloat(form.gpa) : null,
    });

    setIsLoading(false);

    if (res.success) {
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
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this education entry?")) {
      await deleteEducationAction(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
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
        <div className="p-6 bg-slate-50 rounded-xl text-center border border-dashed border-slate-300">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No education entries added yet.</p>
          <p className="text-[11px] text-slate-500 mt-1">Add your degree, university, and field of study.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h5 className="font-bold text-slate-900 text-sm">{edu.institution}</h5>
                <p className="text-xs font-medium text-indigo-600">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(edu.startDate).getFullYear()} -{" "}
                    {edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : "N/A"}
                  </span>
                  {edu.gpa && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Award className="w-3 h-3 text-emerald-600" />
                      GPA: {edu.gpa.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
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
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold">{error}</div>}

          <Input
            label="University / Institution"
            placeholder="Stanford University"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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
            <label htmlFor="isCurrent" className="text-xs font-medium text-slate-700 cursor-pointer">
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

          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Add Education
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
