import AdminSidebar from "@/components/admin/sidebar";
import AdminLayoutClient from "./layout-client";

export const metadata = {
  title: "Admin Dashboard | Renéri Couture",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
