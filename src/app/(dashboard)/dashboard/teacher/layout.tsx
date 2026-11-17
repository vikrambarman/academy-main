import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server/session";
import { connectDB } from "@/lib/db";
import Teacher from "@/models/Teacher";
import { TeacherShellClient } from "./teacher-shell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session || session.role !== "teacher") redirect("/teacher/login");
  if (session.isFirstLogin) redirect("/change-password?forced=true");

  await connectDB();
  const teacher = await Teacher.findOne({ user: session.id })
    .select("name employeeId")
    .lean();

  if (!teacher) redirect("/teacher/login");

  return (
    <TeacherShellClient teacher={JSON.parse(JSON.stringify(teacher))}>
      {children}
    </TeacherShellClient>
  );
}