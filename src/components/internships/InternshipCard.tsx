import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SkillItem {
  skill: {
    id: string;
    name: string;
  };
}

interface InternshipCardProps {
  internship: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string | null;
    location: string;
    workMode: string;
    type: string;
    stipend?: number | null;
    category: {
      name: string;
    };
    requiredSkills: SkillItem[];
    deadline?: Date | null;
    createdAt: Date;
  };
}

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Company & Badges Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{internship.companyName}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{internship.location}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="primary" className="text-[10px]">
              {internship.workMode}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div>
          <Link
            href={`/internships/${internship.id}`}
            className="font-extrabold text-slate-900 dark:text-slate-100 text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
          >
            {internship.title}
          </Link>
          <span className="inline-block mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Category: <strong className="text-slate-700 dark:text-slate-300">{internship.category.name}</strong>
          </span>
        </div>

        {/* Required Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {internship.requiredSkills.slice(0, 4).map((rs) => (
            <span
              key={rs.skill.id}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200/60 dark:border-slate-700/60"
            >
              {rs.skill.name}
            </span>
          ))}
          {internship.requiredSkills.length > 4 && (
            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-md text-xs font-semibold">
              +{internship.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & View Details Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="font-bold text-slate-900 dark:text-slate-100">
          {internship.stipend ? `$${internship.stipend.toLocaleString()}/mo` : "Paid Internship"}
        </div>

        <Link
          href={`/internships/${internship.id}`}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-1 transition-transform"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
