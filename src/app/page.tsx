import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Cpu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden transition-colors">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/40 to-slate-100 dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-slate-950 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Career & Internship Matcher</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
          Bridge the Gap Between <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">Education & Career</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Discover high-fit internship opportunities matched deterministically against your skills, target roles, and academic background—enhanced by explainable AI guidance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 shadow-indigo-300 dark:shadow-none">
              Create Student Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
              Sign In to Platform
            </Button>
          </Link>
        </div>

        {/* Demo Credentials Box for Evaluation */}
        <div className="mt-12 sm:mt-14 max-w-2xl mx-auto bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-left transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Demo Accounts for Internship Evaluation</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 w-fit">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Student Demo Account
              </div>
              <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Email:</strong> student@skillmatch.com</p>
              <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Password:</strong> StudentPassword123!</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-[11px]">Role: Candidate profile & job application tracker</p>
            </div>

            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/70 dark:border-amber-900/50">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Admin Demo Account
              </div>
              <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Email:</strong> admin@skillmatch.com</p>
              <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Password:</strong> AdminPassword123!</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-[11px]">Role: Full CRUD & Application pipeline manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Engineered for Real-World Impact</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Built with industry-standard web architecture, secure access controls, and transparent matching logic.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">Deterministic Match Score</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Objective skill overlap and proficiency weighting formula calculates candidate suitability without LLM hallucination.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">Explainable AI Guidance</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Generates actionable &quot;Why You Match&quot; rationale, skill-gap analysis, and learning roadmaps tailored to each job posting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">Role-Based Access Control</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Strict Edge-level route protection separating Student workspaces from Admin platform management portals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
