/**
 * MIGRATION SCRIPT — Purane enrollments ko franchise assign karo
 *
 * SAFETY:
 * - Default DRY_RUN=true — sirf print karta hai, kuch change nahi karta
 * - Sirf franchise + certType fields add hote hain
 * - Koi existing data delete/overwrite nahi hota
 *
 * Usage:
 *   Dry run (pehle yeh chalao):
 *     npx ts-node -r tsconfig-paths/register scripts/migrateEnrollments.ts
 *
 *   Apply changes:
 *     DRY_RUN=false npx ts-node -r tsconfig-paths/register scripts/migrateEnrollments.ts
 */

import mongoose from "mongoose";

import dotenv from "dotenv"
import Franchise from "@/models/Franchise";
import CertificateType from "@/models/CertificateType";
import Enrollment from "@/models/Enrollment";

dotenv.config({ path: ".env.local" });
const MONGO_URI = process.env.MONGODB_URI!;
const DRY_RUN    = process.env.DRY_RUN !== "false";

/**
 * Course level → default franchise + certType mapping
 * Apne hisaab se customize karo
 */
const LEVEL_MAP: Record<string, { franchise: string; certType: string }> = {
    "Diploma Courses":               { franchise: "GSDM",    certType: "GSDM_MEDHAVI" },
    "Foundation Courses":            { franchise: "DRISHTI",  certType: "DRISHTI_CERT" },
    "Accounting & Business Courses": { franchise: "GSDM",    certType: "GSDM_NSDC"    },
    "IT & Technical Courses":        { franchise: "GSDM",    certType: "GSDM_NSDC"    },
    "Cloud Computing":               { franchise: "GSDM",    certType: "GSDM_NSDC"    },
    "Web Development":               { franchise: "GSDM",    certType: "GSDM_NSDC"    },
    "App Development":               { franchise: "GSDM",    certType: "GSDM_NSDC"    },
    "Programming Languages":         { franchise: "GSDM",    certType: "GSDM_NSDC"    },
};

const FALLBACK = { franchise: "GSDM", certType: "GSDM_NSDC" };

async function migrate() {
    await mongoose.connect(MONGO_URI);

    console.log(`\n${"=".repeat(60)}`);
    console.log(`MIGRATION — ${DRY_RUN ? "DRY RUN (no changes)" : "APPLYING CHANGES"}`);
    console.log(`${"=".repeat(60)}\n`);

    const franchises = await Franchise.find({});
    const certTypes  = await CertificateType.find({});
    const franchiseMap = Object.fromEntries(franchises.map(f => [f.code, f]));
    const certTypeMap  = Object.fromEntries(certTypes.map(c => [c.code, c]));

    const legacyEnrollments = await Enrollment.find({ franchise: null })
        .populate<{ course: { _id: mongoose.Types.ObjectId; name: string; level: string } }>("course");

    console.log(`Found ${legacyEnrollments.length} legacy enrollments\n`);

    let updated = 0, skipped = 0, errors = 0;

    for (const enrollment of legacyEnrollments) {
        const course    = enrollment.course as any;
        const level     = course?.level || "Unknown";
        const map       = LEVEL_MAP[level] || FALLBACK;
        const franchise = franchiseMap[map.franchise];
        const certType  = certTypeMap[map.certType];

        if (!franchise) {
            console.warn(`  SKIP: enrollment ${enrollment._id} — franchise "${map.franchise}" not in DB`);
            skipped++;
            continue;
        }

        console.log(
            `  [${DRY_RUN ? "DRY" : "APPLY"}] ${enrollment._id}\n` +
            `    Course: ${course?.name} (${level})\n` +
            `    → ${franchise.name} / ${certType?.name || "no cert type"}\n`
        );

        if (!DRY_RUN) {
            try {
                await Enrollment.findByIdAndUpdate(enrollment._id, {
                    $set: {
                        franchise: franchise._id,
                        certType:  certType?._id || null,
                        franchiseFeeNote: `Auto-migrated: ${franchise.code} (${level})`,
                    },
                });
                updated++;
            } catch (err) {
                console.error(`  ERROR: ${enrollment._id}:`, err);
                errors++;
            }
        } else {
            updated++;
        }
    }

    console.log(`\n${"─".repeat(60)}`);
    console.log(`${DRY_RUN ? "Would update" : "Updated"}: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    if (errors) console.log(`Errors: ${errors}`);

    if (DRY_RUN) {
        console.log(`\nTo apply: DRY_RUN=false npx ts-node -r tsconfig-paths/register scripts/migrateEnrollments.ts`);
    } else {
        console.log(`\n✅ Migration done!`);
    }

    await mongoose.disconnect();
}

migrate().catch(err => { console.error(err); process.exit(1); });