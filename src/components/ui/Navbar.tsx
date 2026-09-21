"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LogOut, User, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              SkillMatch
            </span>
            <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
              AI
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6">
          {user?.role === "STUDENT" && (
            <>
              <Link
                href="/student/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Portal
              </Link>
            </>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <Badge variant={user.role === "ADMIN" ? "warning" : "primary"}>
                {user.role}
              </Badge>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900">{user.name || user.email}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-slate-600 hover:text-rose-600 gap-1.5"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
