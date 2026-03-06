import mongoose, { Schema, Document, Model } from "mongoose";

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

    externalStudentId?: string;
    externalPassword?: string;

    isActive: boolean;

}

interface StudentModel extends Model<IStudent> {
    generateStudentId(): Promise<string>;
}

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

        externalStudentId: String,
        externalPassword: {
            type: String,
            select: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true }
);


export default
    mongoose.models.Student ||
    mongoose.model<IStudent, StudentModel>("Student", studentSchema);