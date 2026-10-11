"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/adminCategoryActions";
import { useToast } from "@/components/providers/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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

  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

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

    try {
      const res = editingCategory
        ? await updateCategoryAction(editingCategory.id, form)
        : await createCategoryAction(form);

      if (res.success) {
        toast.success(
          editingCategory ? `Updated category "${form.name}"` : `Created category "${form.name}"`,
          "Category Saved"
        );
        setIsModalOpen(false);
      } else {
        setError(res.error || "Failed to save category.");
        toast.error(res.error || "Failed to save category.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(categoryToDelete.id);
      if (res.success) {
        toast.success(`Deleted category "${categoryToDelete.name}"`, "Category Deleted");
      } else {
        toast.error(res.error || "Failed to delete category.", "Error");
      }
    } catch {
      toast.error("An unexpected error occurred.", "Error");
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Job Categories ({categories.length})</h2>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cat.name}</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500">slug: {cat.slug}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                {cat._count.internships} Internship Listings
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(cat)}
                aria-label={`Edit ${cat.name} category`}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Category"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                aria-label={`Delete ${cat.name} category`}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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
          {error && <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">{error}</div>}

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

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingCategory ? "Save Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
        title="Delete Job Category"
        message={`Are you sure you want to delete the "${categoryToDelete?.name}" category?`}
        confirmText="Delete Category"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
