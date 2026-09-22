"use client";

import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, MapPin, DollarSign, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { InternshipFormModal } from "./InternshipFormModal";
import { deleteInternshipAction, toggleInternshipStatusAction } from "@/lib/actions/adminInternshipActions";

interface Category {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface RequiredSkillItem {
  skillId: string;
  skill: Skill;
}

interface Internship {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  location: string;
  workMode: string;
  type: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  stipend?: number | null;
  categoryId: string;
  category: Category;
  status: string;
  deadline?: Date | null;
  requiredSkills: RequiredSkillItem[];
  createdAt: Date;
}

interface InternshipTableProps {
  internships: Internship[];
  categories: Category[];
  availableSkills: Skill[];
}

export function InternshipTable({ internships, categories, availableSkills }: InternshipTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);

  const filteredInternships = internships.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || job.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingInternship(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: Internship) => {
    setEditingInternship(job);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteInternshipAction(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await toggleInternshipStatusAction(id, nextStatus as "DRAFT" | "PUBLISHED");
  };

  const statusVariants: Record<string, "success" | "warning" | "danger"> = {
    PUBLISHED: "success",
    DRAFT: "warning",
    CLOSED: "danger",
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search by job title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 font-semibold shrink-0">
          <Plus className="w-4 h-4" />
          Create Listing
        </Button>
      </div>

      {/* Internship Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredInternships.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No internship listings found.</p>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or create a new job listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Job Title & Company</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Work Mode</th>
                  <th className="py-3.5 px-4">Stipend</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Skills Required</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredInternships.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{job.companyName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {job.category.name}
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-[11px]">
                        {job.workMode}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      {job.stipend ? `$${job.stipend.toLocaleString()}/mo` : "Unpaid / Negotiable"}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="cursor-pointer"
                        title="Click to toggle publish status"
                      >
                        <Badge variant={statusVariants[job.status] || "primary"} className="capitalize">
                          {job.status.toLowerCase()}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map((rs) => (
                          <span
                            key={rs.skillId}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                          >
                            {rs.skill.name}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{job.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title={job.status === "PUBLISHED" ? "Unpublish listing" : "Publish listing"}
                      >
                        {job.status === "PUBLISHED" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internship Create/Edit Modal */}
      <InternshipFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        availableSkills={availableSkills}
        initialData={editingInternship}
      />
    </div>
  );
}
