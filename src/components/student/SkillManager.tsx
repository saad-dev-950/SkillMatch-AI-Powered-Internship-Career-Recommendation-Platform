"use client";

import { useState } from "react";
import { Award, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { addStudentSkillAction, removeStudentSkillAction } from "@/lib/actions/profileActions";

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
    await addStudentSkillAction({ skillId: selectedSkillId, level: selectedLevel as any });
    setIsLoading(false);
    setSelectedSkillId("");
  };

  const handleRemoveSkill = async (skillId: string) => {
    await removeStudentSkillAction(skillId);
  };

  const levelBadgeVariants: Record<string, "secondary" | "primary" | "warning" | "success"> = {
    BEGINNER: "secondary",
    INTERMEDIATE: "primary",
    ADVANCED: "warning",
    EXPERT: "success",
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-violet-600" />
          Technical & Soft Skills Inventory
        </h4>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <p className="text-xs font-bold text-slate-700">Add Skill to Profile</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Select
              options={skillOptions}
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={remainingSkills.length === 0}
            />
          </div>
          <div>
            <Select
              options={levelOptions}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              disabled={remainingSkills.length === 0}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            disabled={!selectedSkillId || remainingSkills.length === 0}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skill
          </Button>
        </div>
      </form>

      {/* Added Skills List */}
      {studentSkills.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4 italic">No skills added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {studentSkills.map((item) => (
            <div
              key={item.id}
              className="px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                <span className="font-bold text-slate-900 text-xs block">{item.skill.name}</span>
                <span className="text-[10px] text-slate-500">{item.skill.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={levelBadgeVariants[item.level] || "primary"} className="text-[10px]">
                  {item.level}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(item.skillId)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
