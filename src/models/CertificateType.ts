/**
 * CERTIFICATE TYPE MODEL
 *
 * Har franchise ke andar multiple certificate types ho sakte hain:
 *
 * GSDM ke 3 types:
 *   1. GSDM_MEDHAVI  — Diploma via Medhavi Skill University (DigiLocker verified)
 *   2. GSDM_NSDC     — NSDC Short Term (DigiLocker + Skill India verified)
 *   3. GSDM_SELF     — GSDM Self Certificate (GSDM portal verified)
 *
 * DRISHTI ka 1 type:
 *   4. DRISHTI_CERT  — Drishti Computer Education (drishticce.com verified)
 *
 * OWN ka 1 type:
 *   5. OWN_CERT      — Institute Certificate (own portal verified)
 *
 * Future: Add kisi bhi new university/partner ka type — zero code change
 */
import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Har franchise ke multiple cert types ho sakte hain:
 *
 * GSDM ke 3 types:
 *   GSDM_MEDHAVI  — Medhavi Skill University Diploma (DigiLocker verified)
 *   GSDM_NSDC     — NSDC Short Term (DigiLocker + Skill India)
 *   GSDM_SELF     — GSDM Self Certificate
 *
 * DRISHTI ka 1 type:
 *   DRISHTI_CERT  — Drishti Computer Education Certificate
 *
 * OWN ka 1 type:
 *   OWN_CERT      — Institute Certificate
 *
 * Future: kisi bhi new university/partner ka type add karo — zero code change
 */
export interface ICertificateType extends Document {
    franchise: mongoose.Types.ObjectId;
    name: string;
    code: string;
    issuingBody: string;
    verificationMethod: string;
    verificationUrl?: string;
    portalVerificationSteps: string[];
    benefits: string[];
    description?: string;
    applicableLevels: string[];
    defaultFee: number;
    isActive: boolean;
}

const certTypeSchema = new Schema<ICertificateType>(
    {
        franchise: {
            type: Schema.Types.ObjectId,
            ref: "Franchise",
            required: true,
        },
        name: { type: String, required: true, trim: true },
        code: {
            type: String, required: true, unique: true,
            trim: true, uppercase: true,
        },
        issuingBody: { type: String, required: true, trim: true },
        verificationMethod: { type: String, trim: true },
        verificationUrl: { type: String, trim: true },
        portalVerificationSteps: [{ type: String, trim: true }],
        benefits: [{ type: String, trim: true }],
        description: { type: String, trim: true },
        applicableLevels: [{ type: String, trim: true }],
        defaultFee: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const CertificateType: Model<ICertificateType> =
    mongoose.models.CertificateType ||
    mongoose.model<ICertificateType>("CertificateType", certTypeSchema);

export default CertificateType;