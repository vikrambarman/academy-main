import mongoose, { Schema, Document } from "mongoose";

/**
 * BACKWARD COMPATIBILITY GUARANTEE:
 * - Naye fields sab optional hain aur default null
 * - Purane enrollments ka koi data lost nahi hoga
 * - franchise = null → legacy mode → course.authority se fallback UI mein
 * - Koi bhi existing query break nahi hogi
 */

interface IPayment {
    amount: number;
    date: Date;
    receiptNo?: string;
    remark?: string;
}

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;

    // ── NEW optional franchise fields (null = legacy enrollment) ──
    franchise?: mongoose.Types.ObjectId | null;
    certType?: mongoose.Types.ObjectId | null;
    courseFranchiseConfig?: mongoose.Types.ObjectId | null;
    externalStudentId?: string | null;
    externalPassword?: string | null;
    franchiseFeeNote?: string | null;

    // ── Existing fields — unchanged ──
    admissionDate: Date;
    feesTotal: number;
    feesPaid: number;
    payments: IPayment[];
    certificateStatus:
    | "Not Applied"
    | "Applied"
    | "Exam Given"
    | "Passed"
    | "Certificate Generated";
    isActive: boolean;
}

const paymentSchema = new Schema<IPayment>({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    receiptNo: String,
    remark: String,
});

const enrollmentSchema = new Schema<IEnrollment>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        // ── NEW FRANCHISE FIELDS ──
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
        courseFranchiseConfig: {
            type: Schema.Types.ObjectId,
            ref: "CourseFranchiseConfig",
            default: null,
        },
        externalStudentId: {
            type: String,
            default: null,
        },
        externalPassword: {
            type: String,
            select: false,
            default: null,
        },
        franchiseFeeNote: {
            type: String,
            default: null,
        },

        // ── EXISTING FIELDS — UNCHANGED ──
        admissionDate: {
            type: Date,
            default: Date.now,
        },
        feesTotal: {
            type: Number,
            default: 0,
        },
        feesPaid: {
            type: Number,
            default: 0,
        },
        payments: [paymentSchema],
        certificateStatus: {
            type: String,
            enum: [
                "Not Applied",
                "Applied",
                "Exam Given",
                "Passed",
                "Certificate Generated",
            ],
            default: "Not Applied",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

enrollmentSchema.pre("save", function () {
    if (this.payments?.length) {
        this.feesPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
    } else {
        this.feesPaid = 0;
    }
});

export default mongoose.models.Enrollment ||
    mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);