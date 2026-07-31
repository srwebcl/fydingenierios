import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-brand-light/40 overflow-hidden font-sans print:h-auto print:overflow-visible">
      <AdminSidebar />
      <main className="flex-1 overflow-auto order-1 md:order-2 pb-16 md:pb-0 print:overflow-visible print:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
