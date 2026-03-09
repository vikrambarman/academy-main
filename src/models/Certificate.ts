import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
    student: mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    certificateNo: string;
    authority: string;
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
        authority: {
            type: String,
            enum: ["Drishti", "GSDM", "NSDC", "DigiLocker", "Other"],
            default: "Drishti",
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