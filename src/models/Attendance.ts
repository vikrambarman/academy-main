// models/Attendance.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type AttendanceStatus = "present" | "absent" | "late" | "holiday";

export interface IAttendanceRecord {
    date: Date;
    status: AttendanceStatus;
    remark?: string;
}

export interface IAttendance extends Document {
    student:    mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    course:     mongoose.Types.ObjectId;
    records:    IAttendanceRecord[];
    createdAt:  Date;
    updatedAt:  Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
    {
        date:   { type: Date, required: true },
        status: { type: String, enum: ["present","absent","late","holiday"], required: true },
        remark: { type: String, trim: true },
    },
    { _id: false }
);

const attendanceSchema = new Schema<IAttendance>(
    {
        student:    { type: Schema.Types.ObjectId, ref: "Student",    required: true },
        enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
        course:     { type: Schema.Types.ObjectId, ref: "Course",     required: true },
    },
    { timestamps: true }
);

// One attendance doc per student per enrollment
attendanceSchema.index({ student: 1, enrollment: 1 }, { unique: true });

const Attendance: Model<IAttendance> =
    mongoose.models.Attendance ||
    mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;