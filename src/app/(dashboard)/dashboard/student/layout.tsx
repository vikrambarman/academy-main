import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server/session";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { StudentShellClient } from "./student-shell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session || session.role !== "student") redirect("/student/login");
  if (session.isFirstLogin) redirect("/change-password?forced=true");

  await connectDB();
  const student = await Student.findOne({ user: session.id })
    .select("name studentId profileImage isActive")
    .lean();

  if (!student || !student.isActive) redirect("/student/login");

  return (
    <StudentShellClient student={JSON.parse(JSON.stringify(student))}>
      {children}
    </StudentShellClient>
  );
}