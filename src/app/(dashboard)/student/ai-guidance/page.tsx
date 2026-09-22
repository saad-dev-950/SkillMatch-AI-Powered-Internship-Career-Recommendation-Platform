import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AIChatBox } from "@/components/ai/AIChatBox";
import { Sparkles, Bot } from "lucide-react";

export default async function StudentAIGuidancePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  const studentName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : session.user.email.split("@")[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Interactive AI Career Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Career Guidance & Mentorship
          </h1>
          <p className="text-indigo-200/90 text-sm max-w-xl">
            Ask questions about technical resume optimization, interview strategies, and skill roadmaps.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs shrink-0 space-y-1">
          <p className="text-indigo-200 font-medium">Candidate Profile Connected:</p>
          <p className="font-bold text-white">{studentName}</p>
        </div>
      </div>

      {/* ChatBox Component */}
      <AIChatBox studentName={studentName} targetRole={user?.profile?.targetRole} />
    </div>
  );
}
