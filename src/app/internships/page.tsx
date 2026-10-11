import { db } from "@/lib/db";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { Search, Briefcase } from "lucide-react";

interface InternshipsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    workMode?: string;
  };
}

export default async function InternshipsPage({ searchParams }: InternshipsPageProps) {
  const query = searchParams.q || "";
  const selectedCategory = searchParams.category || "ALL";
  const selectedWorkMode = searchParams.workMode || "ALL";

  // Fetch only PUBLISHED internships
  const [internships, categories] = await Promise.all([
    db.internship.findMany({
      where: {
        status: "PUBLISHED",
        ...(selectedCategory !== "ALL" ? { categoryId: selectedCategory } : {}),
        ...(selectedWorkMode !== "ALL" ? { workMode: selectedWorkMode } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { companyName: { contains: query } },
                { location: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        requiredSkills: { include: { skill: true } },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Internship Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Explore Open Internship Opportunities
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Browse verified positions across top engineering, product, and design teams.
        </p>
      </div>

      {/* Filter Toolbar Form */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by job title, company, or keyword..."
              aria-label="Search jobs by keyword"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              name="category"
              defaultValue={selectedCategory}
              aria-label="Filter by Category"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="workMode"
              defaultValue={selectedWorkMode}
              aria-label="Filter by Work Mode"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Work Modes</option>
              <option value="REMOTE">Remote Only</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              Apply Search Filters
            </button>
          </div>
        </form>
      </div>

      {/* Internship Cards Grid */}
      {internships.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-xl mx-auto">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching internships found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We couldn&apos;t find any open positions matching your search filters. Try clearing some keywords or resetting category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((job) => (
            <InternshipCard key={job.id} internship={job} />
          ))}
        </div>
      )}
    </div>
  );
}
