/**
 * Student Model
 * Academic + Payment System
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/* ================= PAYMENT ================= */

interface IPayment {
    amount: number;
    date: Date;
    remark?: string;
    receiptNo: string;
}

/* ================= STUDENT INTERFACE ================= */

export interface IStudent extends Document {
    studentId: string;

    name: string;
    fatherName?: string;

    email?: string;
    phone?: string;

    dob?: Date;
    gender?: string;
    address?: string;
    qualification?: string;

    admissionDate?: Date;

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

/* ================= PAYMENT SCHEMA ================= */

const paymentSchema = new Schema<IPayment>({
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
});

/* ================= STUDENT SCHEMA ================= */

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

        fatherName: {
            type: String,
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

        dob: Date,

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },

        address: {
            type: String,
            trim: true,
        },

        qualification: {
            type: String,
            trim: true,
        },

        admissionDate: {
            type: Date,
            default: Date.now,
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

        feesPaid: {
            type: Number,
            default: 0,
            min: 0,
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

studentSchema.pre("save", function () {
    if (this.payments?.length) {
        this.feesPaid = this.payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );
    } else {
        this.feesPaid = 0;
    }
});

/* ================= STUDENT ID GENERATOR ================= */

studentSchema.statics.generateStudentId = async function () {
    const year = new Date().getFullYear();

    const lastStudent = await this.findOne({
        studentId: new RegExp(`^SCA-${year}`),
    }).sort({ createdAt: -1 });

    let serial = 1;

    if (lastStudent) {
        const lastSerial = parseInt(lastStudent.studentId.split("-")[2]);
        serial = lastSerial + 1;
    }

    return `SCA-${year}-${String(serial).padStart(4, "0")}`;
};

const Student =
    (mongoose.models.Student as StudentModel) ||
    mongoose.model<IStudent, StudentModel>("Student", studentSchema);

export default Student;