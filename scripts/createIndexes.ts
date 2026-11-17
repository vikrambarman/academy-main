/**
 * scripts/createIndexes.ts
 * ─────────────────────────────────────────────────────
 * MongoDB Atlas me missing indexes create karta hai.
 * IDEMPOTENT hai — kitni bhi baar chalao, safe hai.
 * Existing indexes ko touch/drop NAHI karta.
 *
 * Run: npx tsx scripts/createIndexes.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const INDEXES: { coll: string; spec: Record<string, 1 | -1> }[] = [
  // Students — user lookup (portal login ke baad har query)
  { coll: "students", spec: { user: 1 } },
  { coll: "students", spec: { phone: 1 } },
  { coll: "students", spec: { courseStatus: 1, isActive: 1 } },

  // Enrollments — student-wise fee/ledger queries
  { coll: "enrollments", spec: { student: 1 } },
  { coll: "enrollments", spec: { course: 1 } },
  { coll: "enrollments", spec: { franchise: 1 } },
  { coll: "enrollments", spec: { "payments.date": -1 } },

  // Users — role-based lists
  { coll: "users", spec: { role: 1 } },

  // Notices — public layout har load pe query karta hai
  { coll: "notices", spec: { isActive: 1, isPublished: 1, createdAt: -1 } },

  // Notes — course-wise study material
  { coll: "notes", spec: { course: 1 } },

  // Timetable — course-wise schedule
  { coll: "timetables", spec: { course: 1 } },

  // Certificates — student + public verification
  { coll: "certificates", spec: { student: 1 } },
  { coll: "certificates", spec: { certificateNo: 1 } },

  // Enquiries/Contacts — admin lists (newest first)
  { coll: "enquiries", spec: { createdAt: -1 } },
  { coll: "contacts", spec: { createdAt: -1 } },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db!;

  console.log("🔧 Creating indexes...\n");

  let ok = 0;
  let skipped = 0;

  for (const { coll, spec } of INDEXES) {
    try {
      await db.collection(coll).createIndex(spec);
      console.log(`✅ ${coll} → ${JSON.stringify(spec)}`);
      ok++;
    } catch (e: any) {
      // Index already exists ya name conflict — safe skip
      console.warn(`⏭️  ${coll} → ${JSON.stringify(spec)} (skipped: ${e.message})`);
      skipped++;
    }
  }

  console.log(`\n✨ Done: ${ok} created, ${skipped} skipped`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Index creation failed:", err);
  process.exit(1);
});