// src/models/Attendance.ts
// ONLY inTime, outTime, markedVia ADD kiye hain
// Baaki sab SAME hai - kuch break nahi hoga

import mongoose, { Schema, Document, Model } from "mongoose";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "holiday"
  | "leave";

export interface IAttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  remark?: string;
  // ── NEW FIELDS (backward compatible) ──
  inTime?: string;   // "HH:MM" format, e.g. "10:30"
  outTime?: string;  // "HH:MM" format, e.g. "13:30"
  markedVia?: "qr" | "manual"; // kaise mark hua
}

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "holiday", "leave"],
      required: true,
    },
    remark:    { type: String, trim: true },
    // ── NEW (optional, so old records safe hain) ──
    inTime:    { type: String, trim: true },  // "10:30"
    outTime:   { type: String, trim: true },  // "13:30"
    markedVia: {
      type: String,
      enum: ["qr", "manual"],
      default: "manual",
    },
  },
  { _id: false }
);

const attendanceSchema = new Schema<IAttendance>(
  {
    student:    { type: Schema.Types.ObjectId, ref: "Student",    required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
    course:     { type: Schema.Types.ObjectId, ref: "Course",     required: true },
    records:    { type: [attendanceRecordSchema], default: [] },
  },
  { timestamps: true }
);

// Existing index same rakha
attendanceSchema.index({ student: 1, enrollment: 1 }, { unique: true });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;