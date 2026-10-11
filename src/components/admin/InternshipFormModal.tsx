"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createInternshipAction, updateInternshipAction } from "@/lib/actions/adminInternshipActions";
import { useToast } from "@/components/providers/ToastProvider";

interface Category {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface InternshipData {
  id?: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  location: string;
  workMode: string;
  type: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  stipend?: number | null;
  categoryId: string;
  status: string;
  deadline?: Date | null;
  requiredSkills?: { skillId: string }[];
}

interface InternshipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  availableSkills: Skill[];
  initialData?: InternshipData | null;
}

export function InternshipFormModal({
  isOpen,
  onClose,
  categories,
  availableSkills,
  initialData,
}: InternshipFormModalProps) {
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    companyLogo: "",
    location: "",
    workMode: "REMOTE",
    type: "INTERNSHIP",
    description: "",
    responsibilities: "",
    requirements: "",
    stipend: "",
    categoryId: categories[0]?.id || "",
    status: "PUBLISHED",
    deadline: "",
    skillIds: [] as string[],
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        companyName: initialData.companyName || "",
        companyLogo: initialData.companyLogo || "",
        location: initialData.location || "",
        workMode: initialData.workMode || "REMOTE",
        type: initialData.type || "INTERNSHIP",
        description: initialData.description || "",
        responsibilities: initialData.responsibilities || "",
        requirements: initialData.requirements || "",
        stipend: initialData.stipend ? initialData.stipend.toString() : "",
        categoryId: initialData.categoryId || categories[0]?.id || "",
        status: initialData.status || "PUBLISHED",
        deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split("T")[0] : "",
        skillIds: initialData.requiredSkills ? initialData.requiredSkills.map((s) => s.skillId) : [],
      });
    } else {
      setForm({
        title: "",
        companyName: "",
        companyLogo: "",
        location: "",
        workMode: "REMOTE",
        type: "INTERNSHIP",
        description: "",
        responsibilities: "",
        requirements: "",
        stipend: "",
        categoryId: categories[0]?.id || "",
        status: "PUBLISHED",
        deadline: "",
        skillIds: [],
      });
    }
    setError("");
  }, [initialData, categories]);

  const toggleSkill = (skillId: string) => {
    setForm((prev) => {
      const exists = prev.skillIds.includes(skillId);
      return {
        ...prev,
        skillIds: exists ? prev.skillIds.filter((id) => id !== skillId) : [...prev.skillIds, skillId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.skillIds.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }

    setIsLoading(true);

    const payload = {
      title: form.title,
      companyName: form.companyName,
      companyLogo: form.companyLogo || undefined,
      location: form.location,
      workMode: form.workMode as "REMOTE" | "HYBRID" | "ONSITE",
      type: form.type as "FULL_TIME" | "PART_TIME" | "INTERNSHIP",
      description: form.description,
      responsibilities: form.responsibilities || undefined,
      requirements: form.requirements || undefined,
      stipend: form.stipend ? parseFloat(form.stipend) : undefined,
      categoryId: form.categoryId,
      status: form.status as "DRAFT" | "PUBLISHED" | "CLOSED",
      deadline: form.deadline || undefined,
      skillIds: form.skillIds,
    };

    try {
      const res = isEditing
        ? await updateInternshipAction(initialData!.id!, payload)
        : await createInternshipAction(payload);

      if (res.success) {
        toast.success(
          isEditing ? `Updated "${form.title}"` : `Created "${form.title}"`,
          "Listing Saved"
        );
        onClose();
      } else {
        const err = res.error || "Failed to save internship listing.";
        setError(err);
        toast.error(err, "Save Failed");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));

  const workModeOptions = [
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
    { label: "Onsite", value: "ONSITE" },
  ];

  const statusOptions = [
    { label: "Published (Visible)", value: "PUBLISHED" },
    { label: "Draft (Hidden)", value: "DRAFT" },
    { label: "Closed", value: "CLOSED" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Internship Listing" : "Create New Internship Listing"}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Job Title"
            placeholder="Frontend Developer Intern"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Company Name"
            placeholder="Vercel Inc."
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Location"
            placeholder="San Francisco, CA"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <Select
            label="Work Mode"
            options={workModeOptions}
            value={form.workMode}
            onChange={(e) => setForm({ ...form, workMode: e.target.value })}
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Monthly Stipend ($)"
            type="number"
            placeholder="4500"
            value={form.stipend}
            onChange={(e) => setForm({ ...form, stipend: e.target.value })}
          />
          <Input
            label="Application Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <Select
            label="Status"
            options={statusOptions}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
        </div>

        <Textarea
          label="Job Description"
          placeholder="Provide a comprehensive summary of the internship opportunity..."
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Textarea
            label="Key Responsibilities"
            placeholder="Build React components, write tests..."
            rows={3}
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
          />
          <Textarea
            label="Requirements & Qualifications"
            placeholder="Currently enrolled in Computer Science..."
            rows={3}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
        </div>

        {/* Required Skill Tagger Selection */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Required Skills ({form.skillIds.length} selected)
          </label>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 max-h-36 overflow-y-auto">
            {availableSkills.map((s) => {
              const isSelected = form.skillIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Save Changes" : "Create Internship"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
