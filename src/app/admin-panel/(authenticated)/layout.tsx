import AdminSidebar from "@/components/admin/AdminSidebar";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'default_secret_key_12345';
const key = new TextEncoder().encode(secretKey);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = (await cookies()).get('fyd_admin_session')?.value;
  let role = 'SELLER';
  let permissions: string[] = [];

  if (session) {
    try {
      const { payload } = await jwtVerify(session, key);
      role = payload.role as string;
      permissions = payload.permissions as string[];
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-brand-light/40 overflow-hidden font-sans print:h-auto print:overflow-visible">
      <AdminSidebar role={role} permissions={permissions} />
      <main className="flex-1 overflow-auto order-1 md:order-2 pb-16 md:pb-0 print:overflow-visible print:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
