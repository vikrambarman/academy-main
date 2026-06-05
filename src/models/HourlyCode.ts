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
            index: true,        // ✅ Single field index - theek hai
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
            // ❌ index: true HATA DIYA - niche schema.index() se handle hoga
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound unique index
hourlyCodeSchema.index({ date: 1, hour: 1 }, { unique: true });

// TTL index - expiresAt ke baad auto delete
hourlyCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const HourlyCode: Model<IHourlyCode> =
    mongoose.models.HourlyCode ||
    mongoose.model<IHourlyCode>("HourlyCode", hourlyCodeSchema);

export default HourlyCode;