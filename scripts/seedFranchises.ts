/**
 * SEED SCRIPT — Run once before deployment
 *
 * Creates:
 * - 3 Franchise documents (GSDM, DRISHTI, OWN)
 * - 5 CertificateType documents
 *
 * Safe to re-run — uses upsert
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/seedFranchises.ts
 */

import CertificateType from "@/models/CertificateType";
import Franchise from "@/models/Franchise";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" });
const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    // ── Step 1: Franchises ──────────────────────────────────────────────

    const gsdm = await Franchise.findOneAndUpdate(
        { code: "GSDM" },
        {
            name: "Gramin Skill Development Mission",
            code: "GSDM",
            description: "Gramin Shiksha Private Limited ka unit. MSME, MCA aur NSDC/Skill India registered.",
            registeredBodies: ["MSME", "MCA", "NSDC", "Skill India"],
            websiteUrl: "https://graminskill.in",
            portalUrl: "https://graminskill.in",
            portalLoginRequired: true,
            isOwn: false,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ GSDM:", gsdm._id.toString());

    const drishti = await Franchise.findOneAndUpdate(
        { code: "DRISHTI" },
        {
            name: "Drishti Computer Education",
            code: "DRISHTI",
            description: "MSME, MCA, Startup India, Niti Aayog aur ISO registered franchise.",
            registeredBodies: ["MSME", "MCA", "Startup India", "Niti Aayog", "ISO"],
            websiteUrl: "https://drishticomputer.com",
            portalUrl: "https://drishticomputer.com",
            portalLoginRequired: false,
            isOwn: false,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ DRISHTI:", drishti._id.toString());

    const own = await Franchise.findOneAndUpdate(
        { code: "OWN" },
        {
            // IMPORTANT: Apne institute ka naam yahan update karo
            name: "Shivshakti Computer Academy",
            code: "OWN",
            description: "ISO aur MSME registered institute certificate.",
            registeredBodies: ["ISO", "MSME"],
            websiteUrl: "https://www.shivshakticomputer.in",
            portalUrl: "https://www.shivshakticomputer.in/student/login",
            portalLoginRequired: false,
            isOwn: true,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ OWN:", own._id.toString());

    // ── Step 2: Certificate Types ───────────────────────────────────────

    await CertificateType.findOneAndUpdate(
        { code: "GSDM_MEDHAVI" },
        {
            franchise: gsdm._id,
            name: "Medhavi Skill University Diploma",
            code: "GSDM_MEDHAVI",
            issuingBody: "Medhavi Skill University (via GSDM)",
            verificationMethod: "DigiLocker + NSDC/Skill India Portal",
            verificationUrl: "https://digilocker.gov.in",
            portalVerificationSteps: [
                "DigiLocker app download karein ya digilocker.gov.in visit karein",
                "Aadhaar number se login karein",
                "'Issued Documents' section mein jayein",
                "Medhavi Skill University ka certificate milega — download karein",
                "NSDC portal (skillindia.gov.in) par bhi verify kar sakte hain",
            ],
            benefits: [
                "University Diploma — pan India recognized",
                "DigiLocker mein permanently stored",
                "NSDC/Skill India portal pe verifiable — sarkari naukri mein valid",
                "Medhavi Skill University ka official seal",
                "Higher education ke liye eligible",
            ],
            applicableLevels: ["Diploma Courses"],
            defaultFee: 4000,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ GSDM_MEDHAVI cert type");

    await CertificateType.findOneAndUpdate(
        { code: "GSDM_NSDC" },
        {
            franchise: gsdm._id,
            name: "NSDC Short Term Certificate",
            code: "GSDM_NSDC",
            issuingBody: "NSDC / Skill India (via GSDM)",
            verificationMethod: "DigiLocker + NSDC/Skill India Portal",
            verificationUrl: "https://skillindiadigital.gov.in",
            portalVerificationSteps: [
                "skillindia.gov.in ya NSDC portal visit karein",
                "Certificate number enter karein",
                "DigiLocker par bhi available hai — Aadhaar se login karein",
            ],
            benefits: [
                "NSDC/Skill India government recognized certificate",
                "DigiLocker mein stored — permanently accessible",
                "Short term courses ke liye nationally valid",
                "Sarkari yojanaon mein direct benefit eligible",
                "Private sector jobs mein recognized",
            ],
            applicableLevels: [
                "Accounting & Business Courses",
                "IT & Technical Courses",
                "Cloud Computing",
                "Web Development",
                "App Development",
                "Programming Languages",
            ],
            defaultFee: 1500,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ GSDM_NSDC cert type");

    await CertificateType.findOneAndUpdate(
        { code: "GSDM_SELF" },
        {
            franchise: gsdm._id,
            name: "GSDM Self Certificate",
            code: "GSDM_SELF",
            issuingBody: "Gramin Skill Development Mission",
            verificationMethod: "GSDM Official Portal",
            verificationUrl: "https://graminskill.in",
            portalVerificationSteps: [
                "graminskill.in portal visit karein",
                "Certificate verification section mein jayein",
                "Certificate number ya student ID enter karein",
            ],
            benefits: [
                "GSDM ka official self-certified document",
                "MSME aur MCA registered organization ka certificate",
                "Local level pe recognized",
            ],
            applicableLevels: ["Foundation Courses"],
            defaultFee: 1000,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ GSDM_SELF cert type");

    await CertificateType.findOneAndUpdate(
        { code: "DRISHTI_CERT" },
        {
            franchise: drishti._id,
            name: "Drishti Computer Education Certificate",
            code: "DRISHTI_CERT",
            issuingBody: "Drishti Computer Education",
            verificationMethod: "Drishti Official Website",
            verificationUrl: "https://drishticomputer.com",
            portalVerificationSteps: [
                "drishticce.com website visit karein",
                "Certificate verify section dhundhen",
                "Certificate number ya roll number enter karein",
                "Details screen par show hongi",
            ],
            benefits: [
                "MSME, MCA, Startup India, Niti Aayog registered",
                "ISO certified organization ka certificate",
                "Private sector mein widely recognized",
                "Pan India computer education network",
                "All course levels ke liye valid",
            ],
            applicableLevels: ["Foundation Courses", "Accounting & Business Courses",],
            defaultFee: 200,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ DRISHTI_CERT cert type");

    await CertificateType.findOneAndUpdate(
        { code: "OWN_CERT" },
        {
            franchise: own._id,
            name: "Institute Certificate",
            code: "OWN_CERT",
            issuingBody: "Shivshakti Computer Academy",
            verificationMethod: "Institute Portal",
            verificationUrl: "https://shivshakticomputer.in/verify-certificate",
            portalVerificationSteps: [
                "Institute se contact karein",
                "Student ID aur course naam batayen",
                "Certificate authenticity confirm ki jaayegi",
            ],
            benefits: [
                "ISO aur MSME registered institute ka certificate",
                "Local employment ke liye valid",
                "Institute ke official stamp aur sign ke saath",
            ],
            applicableLevels: [],
            defaultFee: 0,
            isActive: true,
        },
        { upsert: true, new: true }
    );
    console.log("✓ OWN_CERT cert type");

    console.log("\n✅ Seed complete!");
    console.log("\nIDs for reference:");
    console.log("  GSDM:    ", gsdm._id.toString());
    console.log("  DRISHTI: ", drishti._id.toString());
    console.log("  OWN:     ", own._id.toString());

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});