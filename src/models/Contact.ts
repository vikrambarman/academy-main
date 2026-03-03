/**
 * Contact Model (Production Ready Version)
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Contact Interface
 */
export interface IContact extends Document {
    name: string;
    mobile: string;
    email?: string;
    message: string;
    status: "new" | "in-progress" | "resolved";
    isActive: boolean;
}

/**
 * Contact Schema
 */
const contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["new", "in-progress", "resolved"],
            default: "new",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

/**
 * Prevent model overwrite
 */
const Contact: Model<IContact> =
    mongoose.models.Contact ||
    mongoose.model<IContact>("Contact", contactSchema);

export default Contact;