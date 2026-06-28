"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Customer } from "@/lib/types";

const PAGE_SIZE = 10;

type SafeCustomer = Omit<Customer, "passwordHash">;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<SafeCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<SafeCustomer | null>(null);

  const fetchCustomers = async () => {
    const res = await fetch("/api/admin/customers");
    if (res.ok) setCustomers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete customer "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  const filtered = useMemo(() => {
    let list = customers.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter !== "all") list = list.filter((c) => c.role === roleFilter);
    return list;
  }, [customers, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customers</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage customer accounts ({filtered.length} of {customers.length} total)
          </p>
        </div>
        <Button onClick={() => { setEditingCustomer(null); setShowForm(true); }} className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" /> Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-9 px-3 text-sm border border-neutral-200 rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        {(search || roleFilter !== "all") && (
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setRoleFilter("all"); setPage(1); }} className="gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => { setShowForm(false); setEditingCustomer(null); }}
          onSaved={() => { setShowForm(false); setEditingCustomer(null); fetchCustomers(); }}
        />
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Joined</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((customer) => (
                    <tr key={customer.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600 flex-shrink-0">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </div>
                          <span className="font-medium text-neutral-900">
                            {customer.firstName} {customer.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{customer.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                          {customer.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id, `${customer.firstName} ${customer.lastName}`)}
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
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">Page {page} of {totalPages} · {filtered.length} customers</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>«</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="w-9">{p}</Button>;
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

function CustomerForm({
  customer,
  onClose,
  onSaved,
}: {
  customer: SafeCustomer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!customer;
  const [form, setForm] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    role: customer?.role || "customer",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, string> = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      role: form.role,
    };
    if (form.password) body.password = form.password;
    if (!isEdit) {
      if (!form.password) { setError("Password is required for new customers"); setSaving(false); return; }
      body.password = form.password;
    }

    const url = isEdit ? `/api/admin/customers/${customer.id}` : "/api/admin/customers";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed to save");
    } else {
      onSaved();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto py-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">First Name *</label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Last Name *</label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email *</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Password {isEdit ? "(leave blank to keep current)" : "*"}
            </label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Role</label>
            <select
              className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "customer" | "admin" })}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
