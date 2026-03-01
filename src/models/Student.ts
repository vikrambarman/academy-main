/**
 * Student Model (Academic + Payment System)
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Payment Subdocument Interface
 */
interface IPayment {
    amount: number;
    date: Date;
    remark?: string;
    receiptNo: string;
}

/**
 * Student Interface
 */
export interface IStudent extends Document {
    studentId: string;
    name: string;
    email?: string;
    phone?: string;

    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;

    externalStudentId?: string;
    externalPassword?: string;

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

interface StudentModel extends Model<IStudent> {
    generateStudentId(): Promise<string>;
}

/**
 * Payment Schema
 */
const paymentSchema = new Schema<IPayment>(
    {
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        date: {
            type: Date,
            required: true,
        },
        remark: {
            type: String,
            trim: true,
        },
        receiptNo: {
            type: String,
        },
    },
);

/**
 * Student Schema
 */
const studentSchema = new Schema<IStudent, StudentModel>(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        externalStudentId: {
            type: String,
            trim: true,
        },

        externalPassword: {
            type: String,
            trim: true,
            select: false,
        },

        feesTotal: {
            type: Number,
            default: 0,
            min: 0,
        },

        // 🔥 Auto calculated field
        feesPaid: {
            type: Number,
            default: 0,
            min: 0,
        },

        // 🔥 New Installment System
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

/**
 * 🔥 Auto Recalculate feesPaid Before Save
 */
studentSchema.pre("save", function () {
    if (this.payments && this.payments.length > 0) {
        this.feesPaid = this.payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );
    } else {
        this.feesPaid = 0;
    }
});

/**
 * Student ID Generator
 */
studentSchema.statics.generateStudentId = async function () {
    const year = new Date().getFullYear();

    const lastStudent = await this.findOne({
        studentId: new RegExp(`^SCA-${year}`),
    }).sort({ createdAt: -1 });

    let serial = 1;

    if (lastStudent) {
        const lastSerial = parseInt(
            lastStudent.studentId.split("-")[2]
        );
        serial = lastSerial + 1;
    }

    return `SCA-${year}-${String(serial).padStart(4, "0")}`;
};

const Student =
    (mongoose.models.Student as StudentModel) ||
    mongoose.model<IStudent, StudentModel>("Student", studentSchema);

export default Student;