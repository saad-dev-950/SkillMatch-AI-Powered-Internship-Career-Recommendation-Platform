"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Building2, CheckCircle2, AlertTriangle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MatchResult } from "@/lib/matching";
import { getRecommendationExplanationAction, getSkillGapReportAction } from "@/lib/actions/aiActions";
import { AISkillGapReport } from "@/lib/ai/provider.interface";

interface AIRecommendationCardProps {
  internship: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    workMode: string;
    stipend?: number | null;
    category: { name: string };
  };
  matchResult: MatchResult;
}

export function AIRecommendationCard({ internship, matchResult }: AIRecommendationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [skillGapReport, setSkillGapReport] = useState<AISkillGapReport | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isLoadingGap, setIsLoadingGap] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);

  const score = matchResult.matchScore;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500 text-white shadow-emerald-200";
    if (s >= 60) return "bg-indigo-600 text-white shadow-indigo-200";
    return "bg-amber-500 text-white shadow-amber-200";
  };

  const handleFetchExplanation = async () => {
    if (explanation) {
      setShowDetails(!showDetails);
      return;
    }

    setShowDetails(true);
    setIsLoadingExplanation(true);
    const res = await getRecommendationExplanationAction(internship.id);
    setIsLoadingExplanation(false);

    if (res.success && res.explanation) {
      setExplanation(res.explanation);
    }
  };

  const handleFetchSkillGap = async () => {
    setIsGapModalOpen(true);
    if (!skillGapReport) {
      setIsLoadingGap(true);
      const res = await getSkillGapReportAction(internship.id);
      setIsLoadingGap(false);
      if (res.success && res.report) {
        setSkillGapReport(res.report);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all space-y-4">
      <div className="space-y-3">
        {/* Header Badges & Match % */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{internship.companyName}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {internship.location} ({internship.workMode})
              </p>
            </div>
          </div>

          {/* Deterministic Match Score Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${getScoreColor(
                score
              )}`}
              title="Calculated deterministically by SkillMatch Engine"
            >
              {score}% Match
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-semibold">Engine Score</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <Link
            href={`/internships/${internship.id}`}
            className="font-extrabold text-slate-900 text-base hover:text-indigo-600 transition-colors"
          >
            {internship.title}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">Category: {internship.category.name}</p>
        </div>

        {/* Skill Overlap Preview */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
          {matchResult.matchedSkills.map((ms) => (
            <span
              key={ms.skillId}
              className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium text-[11px] flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {ms.name}
            </span>
          ))}

          {matchResult.missingSkills.map((ms) => (
            <span
              key={ms.skillId}
              className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-medium text-[11px] flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              Missing: {ms.name}
            </span>
          ))}
        </div>
      </div>

      {/* AI Explanation Toggle & Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleFetchExplanation}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why You Match</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleFetchSkillGap}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            Skill-Gap Analysis
          </button>
        </div>

        {/* AI Match Explanation Drawer */}
        {showDetails && (
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-2 animate-in fade-in-50">
            {isLoadingExplanation ? (
              <p className="text-indigo-600 font-medium animate-pulse">Generating AI Match Explanation...</p>
            ) : (
              <>
                <p className="text-slate-800 leading-relaxed font-medium">{explanation}</p>
                <div className="pt-2 border-t border-indigo-100/80 grid grid-cols-3 gap-2 text-[10px] text-slate-500">
                  <div>Skill Score: <strong className="text-slate-800">{matchResult.scoreBreakdown.skillScore}%</strong></div>
                  <div>Location: <strong className="text-slate-800">{matchResult.scoreBreakdown.locationScore}%</strong></div>
                  <div>Category: <strong className="text-slate-800">{matchResult.scoreBreakdown.categoryScore}%</strong></div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/internships/${internship.id}`}>
            <Button size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
              View Position Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Skill Gap Analysis Modal */}
      <Modal
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
        title={`Skill-Gap Diagnostic: ${internship.title}`}
      >
        <div className="space-y-4 text-xs">
          {isLoadingGap ? (
            <p className="text-indigo-600 font-medium py-6 text-center animate-pulse">Analyzing skill profile requirements...</p>
          ) : skillGapReport ? (
            <>
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <p className="font-bold text-emerald-900">Matched Skills Summary</p>
                <p className="text-emerald-800">{skillGapReport.matchingSkillsSummary}</p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <p className="font-bold text-amber-900">Skill Gaps Identified</p>
                <p className="text-amber-800">{skillGapReport.missingSkillsSummary}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Recommended Learning Actions</p>
                <ul className="space-y-2">
                  {skillGapReport.recommendedActions.map((action, idx) => (
                    <li key={idx} className="p-3 bg-slate-50 border rounded-lg text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
