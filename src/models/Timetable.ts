// models/Timetable.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface ISlot {
    day:       WeekDay;
    startTime: string;   // "09:00"
    endTime:   string;   // "10:00"
    subject:   string;
    teacher?:  string;
    room?:     string;
}

export interface ITimetable extends Document {
    course:     mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    student:    mongoose.Types.ObjectId;
    slots:      ISlot[];
    validFrom:  Date;
    validTo?:   Date;
    isActive:   boolean;
    createdAt:  Date;
    updatedAt:  Date;
}

const slotSchema = new Schema<ISlot>(
    {
        day:       { type: String, enum: ["monday","tuesday","wednesday","thursday","friday","saturday"], required: true },
        startTime: { type: String, required: true },
        endTime:   { type: String, required: true },
        subject:   { type: String, required: true, trim: true },
        teacher:   { type: String, trim: true },
        room:      { type: String, trim: true },
    },
    { _id: false }
);

const timetableSchema = new Schema<ITimetable>(
    {
        course:     { type: Schema.Types.ObjectId, ref: "Course",     required: true },
        enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
        student:    { type: Schema.Types.ObjectId, ref: "Student",    required: true },
        slots:      [slotSchema],
        validFrom:  { type: Date, required: true, default: Date.now },
        validTo:    { type: Date },
        isActive:   { type: Boolean, default: true },
    },
    { timestamps: true }
);

timetableSchema.index({ student: 1, enrollment: 1 });
timetableSchema.index({ course: 1 });

const Timetable: Model<ITimetable> =
    mongoose.models.Timetable ||
    mongoose.model<ITimetable>("Timetable", timetableSchema);

export default Timetable;