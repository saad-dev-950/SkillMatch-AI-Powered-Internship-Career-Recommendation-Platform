"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-white tracking-tight">SkillMatch</span>
                <span className="ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-800 uppercase">
                  AI
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              SkillMatch is an AI-powered internship discovery platform connecting ambitious students with high-match career opportunities using explainable AI and skill-gap diagnostic intelligence.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Matching Engine Active</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product Features</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/internships" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Explore Job Listings</span>
                </Link>
              </li>
              <li>
                <Link href="/student/recommendations" className="hover:text-indigo-400 transition-colors">
                  <span>AI Recommendations</span>
                </Link>
              </li>
              <li>
                <Link href="/student/applications" className="hover:text-indigo-400 transition-colors">
                  <span>Application Tracking</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform & Portal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/student/profile" className="hover:text-indigo-400 transition-colors">
                  <span>Student Profile</span>
                </Link>
              </li>
              {user?.role === "ADMIN" && (
                <li>
                  <Link href="/admin/dashboard" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-amber-300">
                    <span>Admin Portal</span>
                    <ArrowUpRight className="w-3 h-3 text-amber-400" />
                  </Link>
                </li>
              )}
              {!user && (
                <li>
                  <Link href="/login" className="hover:text-indigo-400 transition-colors">
                    <span>Sign In / Register</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SkillMatch. Built as an AI-powered internship and career recommendation platform.</p>
          <p className="font-mono text-[11px]">Powered by Next.js 14, Prisma & Auth.js</p>
        </div>
      </div>
    </footer>
  );
}
