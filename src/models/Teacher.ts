// src/models/Teacher.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
    user:       mongoose.Types.ObjectId;  // ref: User
    name:       string;
    employeeId: string;
    phone?:     string;
    isActive:   boolean;
    createdAt:  Date;
    updatedAt:  Date;
}

const teacherSchema = new Schema<ITeacher>(
    {
        user:       { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        name:       { type: String, required: true, trim: true },
        employeeId: { type: String, required: true, unique: true, trim: true },
        phone:      { type: String, trim: true },
        isActive:   { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Teacher: Model<ITeacher> =
    mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", teacherSchema);

export default Teacher;