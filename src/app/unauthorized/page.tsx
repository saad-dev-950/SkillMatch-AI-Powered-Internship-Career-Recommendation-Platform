import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-6 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">403 — Access Denied</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You do not have the required role permissions to access this page. Admin privileges are required for administrator routes.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/student/dashboard">
            <Button variant="primary" className="w-full gap-2 font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Return to Student Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
