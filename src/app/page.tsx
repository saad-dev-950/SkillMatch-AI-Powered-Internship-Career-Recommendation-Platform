import Link from "next/link";
import { Sparkles, Briefcase, ShieldCheck, ArrowRight, CheckCircle2, Cpu, BarChart3, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/40 to-slate-100 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Career & Internship Matcher</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Bridge the Gap Between <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">Education & Career</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Discover high-fit internship opportunities matched deterministically against your skills, target roles, and academic background—enhanced by explainable AI guidance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 shadow-indigo-300">
              Create Student Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
              Sign In to Platform
            </Button>
          </Link>
        </div>

        {/* Demo Credentials Box for Evaluation */}
        <div className="mt-14 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/60 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Demo Accounts for Internship Evaluation</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Student Demo Account
              </div>
              <p className="text-slate-600"><strong className="text-slate-800">Email:</strong> student@skillmatch.com</p>
              <p className="text-slate-600"><strong className="text-slate-800">Password:</strong> StudentPassword123!</p>
              <p className="text-slate-500 mt-2 text-[11px]">Role: Candidate profile & job application tracker</p>
            </div>

            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Demo Account
              </div>
              <p className="text-slate-600"><strong className="text-slate-800">Email:</strong> admin@skillmatch.com</p>
              <p className="text-slate-600"><strong className="text-slate-800">Password:</strong> AdminPassword123!</p>
              <p className="text-slate-500 mt-2 text-[11px]">Role: Full CRUD & Application pipeline manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Engineered for Real-World Impact</h2>
            <p className="text-slate-600 text-sm mt-2">Built with industry-standard web architecture, secure access controls, and transparent matching logic.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Deterministic Match Score</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Objective skill overlap and proficiency weighting formula calculates candidate suitability without LLM hallucination.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Explainable AI Guidance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Generates actionable &quot;Why You Match&quot; rationale, skill-gap analysis, and learning roadmaps tailored to each job posting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Role-Based Access Control</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Strict Edge-level route protection separating Student workspaces from Admin platform management portals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
