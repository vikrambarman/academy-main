// src/models/HourlyCode.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHourlyCode extends Document {
    date: Date;
    hour: number;
    code: string;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const hourlyCodeSchema = new Schema<IHourlyCode>(
    {
        date: {
            type: Date,
            required: true,
            index: true,
        },
        hour: {
            type: Number,
            required: true,
            min: 0,
            max: 23,
        },
        code: {
            type: String,
            required: true,
            length: 4,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true, // ✅ Index add kiya for TTL
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index for queries
hourlyCodeSchema.index({ date: 1, hour: 1 }, { unique: true });

// ✅ TTL index - expiresAt ke baad delete ho jayega
// MongoDB checks every 60 seconds
hourlyCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const HourlyCode: Model<IHourlyCode> =
    mongoose.models.HourlyCode ||
    mongoose.model<IHourlyCode>("HourlyCode", hourlyCodeSchema);

export default HourlyCode;