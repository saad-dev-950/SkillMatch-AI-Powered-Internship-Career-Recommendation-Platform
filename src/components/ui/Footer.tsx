import React from "react";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white tracking-tight">SkillMatch AI</span>
          <span className="text-xs text-slate-500">v1.0 MVP</span>
        </div>
        <p className="text-xs text-slate-500 text-center md:text-left">
          AI-Powered Internship & Career Recommendation Platform. Portfolio Project.
        </p>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-slate-500">Built with Next.js 14, Prisma & Auth.js</span>
        </div>
      </div>
    </footer>
  );
}
