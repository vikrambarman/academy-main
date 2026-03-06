import mongoose, { Schema, Document } from "mongoose";

/* ================= PAYMENT ================= */

interface IPayment {
    amount: number;
    date: Date;
    receiptNo?: string;
    remark?: string;
}

/* ================= ENROLLMENT ================= */

export interface IEnrollment extends Document {

    student: mongoose.Types.ObjectId;

    course: mongoose.Types.ObjectId;

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

/* ================= AUTO CALCULATE FEES ================= */

enrollmentSchema.pre("save", function () {

    if (this.payments?.length) {

        this.feesPaid = this.payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

    } else {

        this.feesPaid = 0;

    }

});

export default
    mongoose.models.Enrollment ||
    mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);