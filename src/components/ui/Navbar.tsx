"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LogOut, User, ShieldCheck, Briefcase, FolderKanban, FileText, Search, Menu, X, Home } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    `text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl ${
      isActive(path)
        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-bold"
        : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
    }`;

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
              SkillMatch
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-100 dark:border-indigo-900 uppercase">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link href="/internships" className={navLinkClass("/internships")}>
            <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Explore Jobs</span>
          </Link>

          {user?.role === "STUDENT" && (
            <>
              <Link href="/student/recommendations" className={navLinkClass("/student/recommendations")}>
                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>AI Recommendations</span>
              </Link>

              <Link href="/student/applications" className={navLinkClass("/student/applications")}>
                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>My Applications</span>
              </Link>

              <Link href="/student/profile" className={navLinkClass("/student/profile")}>
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Profile</span>
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link href="/admin/dashboard" className={navLinkClass("/admin/dashboard")}>
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Overview</span>
              </Link>
              <Link href="/admin/internships" className={navLinkClass("/admin/internships")}>
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Manage Jobs</span>
              </Link>
              <Link href="/admin/applications" className={navLinkClass("/admin/applications")}>
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Applications</span>
              </Link>
              <Link href="/admin/categories" className={navLinkClass("/admin/categories")}>
                <FolderKanban className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Categories</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Badge variant={user.role === "ADMIN" ? "warning" : "primary"}>
                {user.role}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 gap-1.5"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-semibold">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
        </div>

        {/* Mobile Navbar Controls (Theme Toggle + Animated Hamburger) */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <Link href="/" className={navLinkClass("/")} onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home</span>
            </Link>

            <Link href="/internships" className={navLinkClass("/internships")} onClick={() => setMobileMenuOpen(false)}>
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Explore Jobs</span>
            </Link>

            {user?.role === "STUDENT" && (
              <>
                <Link href="/student/recommendations" className={navLinkClass("/student/recommendations")} onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>AI Recommendations</span>
                </Link>

                <Link href="/student/applications" className={navLinkClass("/student/applications")} onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>My Applications</span>
                </Link>

                <Link href="/student/profile" className={navLinkClass("/student/profile")} onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin/dashboard" className={navLinkClass("/admin/dashboard")} onClick={() => setMobileMenuOpen(false)}>
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Overview</span>
                </Link>
                <Link href="/admin/internships" className={navLinkClass("/admin/internships")} onClick={() => setMobileMenuOpen(false)}>
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Manage Jobs</span>
                </Link>
                <Link href="/admin/applications" className={navLinkClass("/admin/applications")} onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Applications</span>
                </Link>
                <Link href="/admin/categories" className={navLinkClass("/admin/categories")} onClick={() => setMobileMenuOpen(false)}>
                  <FolderKanban className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>Categories</span>
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between pt-1">
                <Badge variant={user.role === "ADMIN" ? "warning" : "primary"}>
                  Role: {user.role}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-rose-600 dark:text-rose-400 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
