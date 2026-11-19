import Sidebar from "@/components/layout/Sidebar";
import AdminHeader from "@/components/layout/AdminHeader";

// Admin dashboard pages are dynamic authenticated routes and must not be prerendered statically during build
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:pl-64">
        <AdminHeader />
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto bg-[var(--bg)] min-h-0">
          <div className="min-h-full bg-black/[0.01] dark:bg-white/[0.01]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
