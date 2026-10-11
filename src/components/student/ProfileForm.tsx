"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { updateStudentProfileAction } from "@/lib/actions/profileActions";
import { AlertCircle, CheckCircle2, User, Target } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    bio?: string | null;
    location?: string | null;
    targetRole?: string | null;
    preferredWorkMode?: string | null;
    preferredCategory?: string | null;
  };
  categories: { id: string; name: string }[];
}

export function ProfileForm({ initialData, categories }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    phone: initialData.phone || "",
    bio: initialData.bio || "",
    location: initialData.location || "",
    targetRole: initialData.targetRole || "",
    preferredWorkMode: initialData.preferredWorkMode || "REMOTE",
    preferredCategory: initialData.preferredCategory || "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await updateStudentProfileAction({
        ...formData,
        preferredWorkMode: formData.preferredWorkMode as "REMOTE" | "HYBRID" | "ONSITE",
      });

      if (res.success) {
        const msg = res.message || "Profile details saved successfully!";
        setMessage({ type: "success", text: msg });
        toast.success(msg, "Profile Updated");
      } else {
        const err = res.error || "Failed to update profile.";
        setMessage({ type: "error", text: err });
        toast.error(err, "Update Failed");
      }
    } catch {
      toast.error("An unexpected error occurred while saving profile.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = [
    { label: "Select Preferred Category", value: "" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  const workModeOptions = [
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
    { label: "Onsite", value: "ONSITE" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Personal Info Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Personal Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Current Location"
            placeholder="San Francisco, CA"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <Textarea
          label="Professional Bio"
          placeholder="Brief summary of your academic achievements, passions, and technical interests..."
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      {/* Career Preferences */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Career Preferences
        </h4>

        <Input
          label="Target Role / Job Title"
          placeholder="e.g. Full-Stack Engineering Intern"
          value={formData.targetRole}
          onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Preferred Work Mode"
            options={workModeOptions}
            value={formData.preferredWorkMode}
            onChange={(e) => setFormData({ ...formData, preferredWorkMode: e.target.value })}
          />

          <Select
            label="Preferred Internship Category"
            options={categoryOptions}
            value={formData.preferredCategory}
            onChange={(e) => setFormData({ ...formData, preferredCategory: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" size="md" isLoading={isLoading} className="px-6 font-semibold">
          Save Profile Details
        </Button>
      </div>
    </form>
  );
}
