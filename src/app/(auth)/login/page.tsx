"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShieldCheck, GraduationCap, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Invalid email address or password. Please try again.");
        setIsLoading(false);
        return;
      }

      router.refresh();
      router.push(callbackUrl);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const prefillAccount = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to SkillMatch</h1>
        <p className="text-sm text-slate-500">Access your candidate dashboard or admin portal</p>
      </div>

      {/* Demo Prefill Quick Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <p className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Evaluation Quick Fill:</span>
          <span className="text-[10px] text-indigo-600 font-normal">Click to auto-fill</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => prefillAccount("student@skillmatch.com", "StudentPassword123!")}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors text-left"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
            <span>Student Account</span>
          </button>
          <button
            type="button"
            onClick={() => prefillAccount("admin@skillmatch.com", "AdminPassword123!")}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 transition-colors text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Admin Account</span>
          </button>
        </div>
      </div>

      {/* Login Card Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full font-semibold mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Don&apos;t have a student account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Suspense fallback={<div className="text-center text-xs text-slate-500 py-10">Loading Sign In...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
