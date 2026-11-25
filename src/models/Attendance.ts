import mongoose, { Schema, Document, Model } from "mongoose";

export type AttendanceStatus =
  | "pending"
  | "present"
  | "absent"
  | "late"        // ← YE ADD KARNA HAI
  | "rejected"
  | "holiday"
  | "leave";

export interface IAttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  remark?: string;
  inTime?: string;
  outTime?: string;
  markedVia?: "qr" | "manual" | "cron";
  
  // ── Verification fields ──
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectedReason?: string;
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
      enum: ["pending", "present", "absent", "late", "rejected", "holiday", "leave"],
      required: true,
      default: "pending",
    },
    remark: { type: String, trim: true },
    inTime: { type: String, trim: true },
    outTime: { type: String, trim: true },
    markedVia: {
      type: String,
      enum: ["qr", "manual", "cron"],
      default: "manual",
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    rejectedReason: { type: String, trim: true },
  },
  { _id: false }
);

const attendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    records: { type: [attendanceRecordSchema], default: [] },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, enrollment: 1 }, { unique: true });
attendanceSchema.index({ "records.date": 1 });
attendanceSchema.index({ "records.status": 1 });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;