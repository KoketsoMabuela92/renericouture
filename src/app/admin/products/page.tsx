"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Eye,
  EyeOff,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  ImageIcon,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products?all=true");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleToggleActive = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    fetchProducts();
  };

  const handleToggleFeatured = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    });
    fetchProducts();
  };

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);
    return list;
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginated = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your product catalogue ({products.length} products)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-9 px-3 text-sm border border-neutral-200 rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || categoryFilter !== "all") && (
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategoryFilter("all"); setPage(1); }} className="gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Stock</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-neutral-400">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{product.name}</p>
                            <p className="text-xs text-neutral-500">
                              {product.colors.length} colors, {product.sizes.length} sizes
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-neutral-500">{product.sku}</td>
                      <td className="py-3 px-4 text-neutral-600">{product.category}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(product.price)}
                        {product.compareAtPrice && (
                          <span className="block text-xs text-neutral-400 line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={
                            product.stock < 10
                              ? "text-red-600 font-medium"
                              : "text-neutral-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Badge variant={product.active ? "success" : "secondary"}>
                            {product.active ? "Active" : "Draft"}
                          </Badge>
                          {product.featured && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            title={product.featured ? "Remove from featured" : "Add to featured"}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                product.featured
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-neutral-400"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleToggleActive(product)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            title={product.active ? "Deactivate" : "Activate"}
                          >
                            {product.active ? (
                              <Eye className="h-4 w-4 text-neutral-400" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-neutral-400" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                          >
                            <Edit2 className="h-4 w-4 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages} · {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>«</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="w-9">{p}</Button>
              );
            })}
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    sku: product?.sku || "",
    stock: product?.stock?.toString() || "0",
    sizes: product?.sizes?.join(", ") || "",
    colors: product?.colors?.join(", ") || "",
    tags: product?.tags?.join(", ") || "",
    featured: product?.featured || false,
    active: product?.active !== false,
  });
  const [saving, setSaving] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: { name: string }[]) => {
        const names = cats.map((c) => c.name);
        setCategoryOptions(names);
        if (!form.category && names.length > 0) {
          setForm((f) => ({ ...f, category: names[0] }));
        }
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setImages((prev) => [...prev, publicUrl]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Check your S3 configuration.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      category: form.category,
      subcategory: form.subcategory || undefined,
      sku: form.sku,
      stock: parseInt(form.stock),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      active: form.active,
      images,
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto py-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="col-span-2">
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Product Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((url, i) => (
                <div key={i} className="relative group w-20 h-20 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-300 hover:border-neutral-400 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
              >
                {uploadingImage ? (
                  <div className="animate-spin h-4 w-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span className="text-[10px]">Upload</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {images.length === 0 && (
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> No images yet. Upload images or they&apos;ll use a placeholder.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Product Name *
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Description *
              </label>
              <textarea
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Price (ZAR) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Compare at Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Category *
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Subcategory
              </label>
              <Input
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                placeholder="e.g. Tops, Bottoms, Outerwear"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">SKU *</label>
              <Input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Stock *</label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Sizes (comma separated)
              </label>
              <Input
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="XS, S, M, L, XL"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Colors (comma separated)
              </label>
              <Input
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="Black, White, Navy"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Tags (comma separated)
              </label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="summer, casual, elegant"
              />
            </div>

            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-neutral-300"
                />
                Featured product
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-neutral-300"
                />
                Active (visible in store)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
