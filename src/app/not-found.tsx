"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Search, Home, ArrowLeft, Briefcase, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Background AI Orbital Glow & Floating Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Creative AI Career Card & Orbital Badge */}
        <div className="relative inline-flex items-center justify-center">
          {/* Rotating AI Ring */}
          <div className="absolute inset-0 w-36 h-36 -m-4 rounded-full border border-dashed border-indigo-400/40 dark:border-indigo-500/30 animate-[spin_16s_linear_infinite] pointer-events-none" />

          {/* Floating Job Match Graphic Card */}
          <div className="w-28 h-28 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center relative group overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-1 animate-pulse">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Page 404
            </span>

            {/* Glowing Accent Corner Dot */}
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>

          {/* Floating Mini Badges */}
          <div className="absolute -top-3 -right-6 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-black rounded-full shadow-lg flex items-center gap-1 animate-[bounce_3s_infinite]">
            <Sparkles className="w-3 h-3" />
            <span>404 Match</span>
          </div>

          <div className="absolute -bottom-2 -left-6 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full shadow-md flex items-center gap-1">
            <Search className="w-3 h-3 text-indigo-500" />
            <span>Zero Results</span>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <span>Opportunity Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Oops! This Opportunity Doesn&apos;t Exist.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page or job listing you are looking for may have moved, expired, or never existed on SkillMatch.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold gap-2 shadow-indigo-200 dark:shadow-none">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>

          <Link href="/internships" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Explore Jobs</span>
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
