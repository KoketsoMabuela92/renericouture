"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Edit2, Trash2, X } from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will not be deleted.`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Organize your product catalogue ({categories.length} categories)
          </p>
        </div>
        <Button onClick={() => { setEditingCat(null); setShowForm(true); }} className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCat}
          onClose={() => { setShowForm(false); setEditingCat(null); }}
          onSaved={() => { setShowForm(false); setEditingCat(null); fetchCategories(); }}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
          <p className="text-sm text-neutral-500">No categories yet</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Slug</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Description</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-neutral-100 rounded-lg">
                            <Tag className="h-4 w-4 text-neutral-500" />
                          </div>
                          <span className="font-medium text-neutral-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-neutral-500">/{cat.slug}</td>
                      <td className="py-3 px-4 text-neutral-500 max-w-xs truncate">
                        {cat.description || <span className="text-neutral-300 italic">No description</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingCat(cat); setShowForm(true); }}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto py-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Collection"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
