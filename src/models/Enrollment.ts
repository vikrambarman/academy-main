import mongoose, { Schema, Document } from "mongoose";

interface IPayment {
    amount: number;
    date: Date;
    receiptNo?: string;
    remark?: string;
    // --- NEW FIELDS FOR PHASE 1B ---
    paymentMode?: 'cash' | 'upi' | 'online' | 'card' | 'other';
    receiptPdfUrl?: string;
    transactionId?: string; // Cashfree cf_payment_id or bank UTR
}

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    franchise?: mongoose.Types.ObjectId | null;
    certType?: mongoose.Types.ObjectId | null;
    courseFranchiseConfig?: mongoose.Types.ObjectId | null;
    externalStudentId?: string | null;
    externalPassword?: string | null;
    franchiseFeeNote?: string | null;
    admissionDate: Date;
    feesTotal: number;
    feesPaid: number;
    payments: IPayment[];
    certificateStatus: "Not Applied" | "Applied" | "Exam Given" | "Passed" | "Certificate Generated";
    isActive: boolean;
}

const paymentSchema = new Schema<IPayment>({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    receiptNo: { type: String },
    remark: { type: String },
    paymentMode: { type: String, enum: ['cash', 'upi', 'online', 'card', 'other'], default: 'online' },
    receiptPdfUrl: { type: String, default: null },
    transactionId: { type: String, default: null },
});

const enrollmentSchema = new Schema<IEnrollment>(
    {
        student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        franchise: { type: Schema.Types.ObjectId, ref: "Franchise", default: null },
        certType: { type: Schema.Types.ObjectId, ref: "CertificateType", default: null },
        courseFranchiseConfig: { type: Schema.Types.ObjectId, ref: "CourseFranchiseConfig", default: null },
        externalStudentId: { type: String, default: null },
        externalPassword: { type: String, select: false, default: null },
        franchiseFeeNote: { type: String, default: null },
        admissionDate: { type: Date, default: Date.now },
        feesTotal: { type: Number, default: 0 },
        feesPaid: { type: Number, default: 0 },
        payments: [paymentSchema],
        certificateStatus: {
            type: String,
            enum: ["Not Applied", "Applied", "Exam Given", "Passed", "Certificate Generated"],
            default: "Not Applied",
        },
        isActive: { type: Boolean, default: true },
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

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);