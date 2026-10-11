"use client";

import { useState } from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { addStudentSkillAction, removeStudentSkillAction } from "@/lib/actions/profileActions";
import { useToast } from "@/components/providers/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface MasterSkill {
  id: string;
  name: string;
  category: string;
}

interface StudentSkillItem {
  id: string;
  skillId: string;
  level: string;
  skill: MasterSkill;
}

interface SkillManagerProps {
  availableSkills: MasterSkill[];
  studentSkills: StudentSkillItem[];
}

export function SkillManager({ availableSkills, studentSkills }: SkillManagerProps) {
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("INTERMEDIATE");
  const [isLoading, setIsLoading] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  // Filter out skills already added by student
  const addedSkillIds = new Set(studentSkills.map((s) => s.skillId));
  const remainingSkills = availableSkills.filter((s) => !addedSkillIds.has(s.id));

  const skillOptions = [
    { label: remainingSkills.length === 0 ? "All available skills added!" : "Select a skill to add", value: "" },
    ...remainingSkills.map((s) => ({ label: `${s.name} (${s.category})`, value: s.id })),
  ];

  const levelOptions = [
    { label: "Beginner", value: "BEGINNER" },
    { label: "Intermediate", value: "INTERMEDIATE" },
    { label: "Advanced", value: "ADVANCED" },
    { label: "Expert", value: "EXPERT" },
  ];

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    setIsLoading(true);
    try {
      const res = await addStudentSkillAction({ skillId: selectedSkillId, level: selectedLevel as any });
      if (res.success) {
        const addedSkillObj = availableSkills.find((s) => s.id === selectedSkillId);
        toast.success(`Added ${addedSkillObj?.name || "skill"} to your profile.`, "Skill Added");
        setSelectedSkillId("");
      } else {
        toast.error(res.error || "Failed to add skill.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred while adding skill.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRemoveSkill = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      const res = await removeStudentSkillAction(skillToDelete.id);
      if (res.success) {
        toast.success(`Removed ${skillToDelete.name} from your profile.`, "Skill Removed");
      } else {
        toast.error(res.error || "Failed to remove skill.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred while removing skill.", "Error");
    } finally {
      setIsDeleting(false);
      setSkillToDelete(null);
    }
  };

  const levelBadgeVariants: Record<string, "secondary" | "primary" | "warning" | "success"> = {
    BEGINNER: "secondary",
    INTERMEDIATE: "primary",
    ADVANCED: "warning",
    EXPERT: "success",
  };

  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
          <span>Technical & Soft Skills Inventory</span>
        </h4>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Skill to Profile</p>
        <div className="space-y-3">
          <div>
            <label htmlFor="skill-select" className="sr-only">
              Select a skill to add
            </label>
            <Select
              id="skill-select"
              options={skillOptions}
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={remainingSkills.length === 0}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <label htmlFor="level-select" className="sr-only">
                Select proficiency level
              </label>
              <Select
                id="level-select"
                options={levelOptions}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                disabled={remainingSkills.length === 0}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              isLoading={isLoading}
              disabled={!selectedSkillId || remainingSkills.length === 0}
              className="gap-1.5 text-xs h-10 px-4 w-full sm:w-auto shrink-0 justify-center font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </div>
        </div>
      </form>

      {/* Added Skills Grid */}
      {studentSkills.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6 italic bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          No skills added yet. Select a skill above to build your profile.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {studentSkills.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="min-w-0 flex-1 pr-1">
                <span
                  className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm block truncate"
                  title={item.skill.name}
                >
                  {item.skill.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-medium mt-0.5">
                  {item.skill.category}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={levelBadgeVariants[item.level] || "primary"}
                  className="text-[10px] uppercase font-bold tracking-wider shrink-0 px-2.5 py-0.5"
                >
                  {item.level}
                </Badge>
                <button
                  type="button"
                  onClick={() => setSkillToDelete({ id: item.skillId, name: item.skill.name })}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-colors shrink-0"
                  aria-label={`Remove ${item.skill.name} skill`}
                  title={`Remove ${item.skill.name} skill`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Skill Confirmation Modal */}
      <ConfirmModal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={confirmRemoveSkill}
        title="Remove Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}" from your profile? This may affect your internship match calculations.`}
        confirmText="Remove Skill"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
