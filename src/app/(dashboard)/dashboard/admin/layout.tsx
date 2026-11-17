import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server/session";
import { AdminShellClient } from "./admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  if (session.isFirstLogin) redirect("/change-password?forced=true");

  return <AdminShellClient>{children}</AdminShellClient>;
}