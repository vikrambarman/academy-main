import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server/session";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Certificate from "@/models/Certificate";
import "@/models/Course";
import "@/models/Franchise";
import "@/models/CertificateType";
import { StudentDashboardUI } from "./dashboard-ui";

export default async function StudentDashboardPage() {
  const session = await getServerSession();
  if (!session || session.role !== "student") redirect("/student/login");

  await connectDB();

  const student = await Student.findOne({ user: session.id })
    .select("name studentId email phone profileImage courseStatus isActive")
    .lean();

  if (!student) redirect("/student/login");
  if (!student.isActive) redirect("/student/login?disabled=1");

  const [enrollments, certificates] = await Promise.all([
    Enrollment.find({ student: student._id })
      .populate("course", "name authority verification")
      .populate("franchise", "name code registeredBodies portalUrl portalLoginRequired isOwn")
      .populate("certType", "name code issuingBody verificationMethod verificationUrl benefits")
      .select("feesTotal feesPaid certificateStatus payments course franchise certType externalStudentId")
      .lean(),
    Certificate.find({ student: student._id })
      .select("enrollment certificateNo authority issueDate expiryDate verifyUrl status remarks")
      .lean(),
  ]);

  // enrollmentId → certificate map
  const certMap: Record<string, any> = {};
  for (const cert of certificates as any[]) {
    certMap[cert.enrollment.toString()] = cert;
  }

  const enriched = (enrollments as any[]).map((e) => ({
    ...e,
    certificate: certMap[e._id.toString()] ?? null,
  }));

  // Dates serialize karo (RSC safe)
  const initialData = JSON.parse(
    JSON.stringify({ student, enrollments: enriched })
  );

  return <StudentDashboardUI initialData={initialData} />;
}