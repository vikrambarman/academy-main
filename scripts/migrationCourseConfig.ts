/**
 * Migration Script: CourseFranchiseConfig
 * Old: { availableCertTypes: [ObjectId], feeStructure: { total, ... } }
 * New: { certEntries: [{ certType, isDefault, fee, registrationFee, ... }] }
 *
 * Run: npx ts-node --project tsconfig.json scripts/migrateCourseConfigs.ts
 * Or:  npx tsx scripts/migrateCourseConfigs.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";
if (!MONGO_URI) { console.error("❌ MONGODB_URI not found in .env.local"); process.exit(1); }

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db!;
    const col = db.collection("coursefranchiseconfigs");

    const all = await col.find({}).toArray();
    console.log(`📦 Total configs found: ${all.length}`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of all) {
        // Already migrated — has certEntries with objects
        if (
            Array.isArray(doc.certEntries) &&
            doc.certEntries.length > 0 &&
            typeof doc.certEntries[0] === "object" &&
            doc.certEntries[0].certType !== undefined
        ) {
            console.log(`  ⏭  SKIP  [${doc._id}] — already has certEntries`);
            skipped++;
            continue;
        }

        try {
            // Build certEntries from old data
            const oldFee = doc.feeStructure || {};
            const defaultCertId = doc.defaultCertType?.toString();

            // availableCertTypes was [ObjectId] — use it if present, else use defaultCertType only
            const availableIds: string[] = Array.isArray(doc.availableCertTypes) && doc.availableCertTypes.length > 0
                ? doc.availableCertTypes.map((id: any) => id.toString())
                : (defaultCertId ? [defaultCertId] : []);

            // Deduplicate — ensure defaultCertType is in the list
            const uniqueIds = [...new Set([
                ...(defaultCertId ? [defaultCertId] : []),
                ...availableIds,
            ])];

            const certEntries = uniqueIds.map((certId, idx) => ({
                certType: new mongoose.Types.ObjectId(certId),
                isDefault: certId === defaultCertId || idx === 0,
                fee: oldFee.total ?? 0,
                registrationFee: 0,   // old data had no registration fee
                installmentsAllowed: oldFee.installmentsAllowed ?? true,
                maxInstallments: oldFee.maxInstallments ?? 3,
                minInstallmentAmount: oldFee.minInstallmentAmount ?? 500,
            }));

            await col.updateOne(
                { _id: doc._id },
                {
                    $set: { certEntries },
                    $unset: {
                        availableCertTypes: "",
                        feeStructure: "",        // remove old flat feeStructure
                    },
                }
            );

            console.log(`  ✅ MIGRATED [${doc._id}] — ${uniqueIds.length} cert(s), fee: ₹${oldFee.total ?? 0}`);
            migrated++;
        } catch (err: any) {
            console.error(`  ❌ ERROR [${doc._id}]:`, err.message);
            errors++;
        }
    }

    console.log("\n────────────────────────────────────");
    console.log(`✅ Migrated : ${migrated}`);
    console.log(`⏭  Skipped  : ${skipped}`);
    console.log(`❌ Errors   : ${errors}`);
    console.log("────────────────────────────────────");

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
}

run().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});