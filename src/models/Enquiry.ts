import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
    name: string;
    mobile: string;
    course: string;
    contactMethod: "Phone" | "WhatsApp";
    message?: string;
    source: "walk-in" | "website" | "phone" | "referral";
    status: "new" | "contacted" | "converted" | "closed";
    isActive: boolean;
}

const enquirySchema = new Schema<IEnquiry>(
    {
        name: { type: String, required: true, trim: true },
        mobile: { type: String, required: true, trim: true },
        course: { type: String, required: true, trim: true },
        contactMethod: { type: String, enum: ["Phone", "WhatsApp"], default: "Phone" },
        message: { type: String, trim: true },
        source: { type: String, enum: ["walk-in", "website", "phone", "referral"], default: "website" },
        status: { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Enquiry: Model<IEnquiry> =
    mongoose.models.Enquiry ||
    mongoose.model<IEnquiry>("Enquiry", enquirySchema);

export default Enquiry;