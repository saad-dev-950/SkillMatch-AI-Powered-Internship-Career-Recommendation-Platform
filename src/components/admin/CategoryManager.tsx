"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, FolderKanban, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/adminCategoryActions";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count: { internships: number };
}

interface CategoryManagerProps {
  categories: CategoryWithCount[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  const [form, setForm] = useState({ name: "", slug: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "" });
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setError("");
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setForm({ name: val, slug: editingCategory ? form.slug : slugified });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = editingCategory
      ? await updateCategoryAction(editingCategory.id, form)
      : await createCategoryAction(form);

    setIsLoading(false);

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setError(res.error || "Failed to save category.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setError("");
    if (confirm(`Are you sure you want to delete the "${name}" category?`)) {
      const res = await deleteCategoryAction(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Job Categories ({categories.length})</h2>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
              </div>
              <p className="text-xs font-mono text-slate-400">slug: {cat.slug}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {cat._count.internships} Internship Listings
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit Category"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Job Category" : "Add New Job Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

          <Input
            label="Category Name"
            placeholder="Software Engineering"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="Category Slug"
            placeholder="software-engineering"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />

          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingCategory ? "Save Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
