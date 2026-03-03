/**
 * Enquiry Model (Production Ready Version)
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Enquiry Interface
 */
export interface IEnquiry extends Document {
    name: string;
    mobile: string;
    course: string;
    contactMethod: "Phone" | "WhatsApp";
    message?: string;
    status: "new" | "contacted" | "converted" | "closed";
    isActive: boolean;
}

/**
 * Enquiry Schema
 */
const enquirySchema = new Schema<IEnquiry>(
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

        course: {
            type: String,
            required: true,
            trim: true,
        },

        contactMethod: {
            type: String,
            enum: ["Phone", "WhatsApp"],
            default: "Phone",
        },

        message: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["new", "contacted", "converted", "closed"],
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
const Enquiry: Model<IEnquiry> =
    mongoose.models.Enquiry ||
    mongoose.model<IEnquiry>("Enquiry", enquirySchema);

export default Enquiry;