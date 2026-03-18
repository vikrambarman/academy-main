import mongoose, { Schema, Document } from "mongoose";

/**
 * CHANGES from original:
 * 1. authority: enum hataya → free String (future franchises support)
 * 2. franchise: optional ref added (null for old records — backward compat)
 * 3. certType: optional ref added (null for old records — backward compat)
 *
 * Purane records safe hain — koi migration nahi chahiye
 */
export interface ICertificate extends Document {
    student: mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    certificateNo: string;
    authority: string;
    // NEW optional fields
    franchise?: mongoose.Types.ObjectId | null;
    certType?: mongoose.Types.ObjectId | null;
    // Existing
    issueDate?: Date;
    expiryDate?: Date;
    verifyUrl?: string;
    status: "issued" | "pending" | "revoked";
    remarks?: string;
}

const certificateSchema = new Schema<ICertificate>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        enrollment: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        certificateNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        // CHANGED: enum removed → free text (supports any franchise)
        authority: {
            type: String,
            trim: true,
            default: "Drishti Computer Education",
        },
        // NEW: optional franchise + certType links
        franchise: {
            type: Schema.Types.ObjectId,
            ref: "Franchise",
            default: null,
        },
        certType: {
            type: Schema.Types.ObjectId,
            ref: "CertificateType",
            default: null,
        },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        verifyUrl: { type: String, trim: true },
        status: {
            type: String,
            enum: ["issued", "pending", "revoked"],
            default: "issued",
        },
        remarks: { type: String, trim: true },
    },
    { timestamps: true }
);

export default mongoose.models.Certificate ||
    mongoose.model<ICertificate>("Certificate", certificateSchema);