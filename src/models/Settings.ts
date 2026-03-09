import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    googleMapUrl: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    youtube: string;
    logoUrl: string;
    faviconUrl: string;
    notifyOnEnquiry: boolean;
    notifyOnContact: boolean;
    notifyOnEnrollment: boolean;
}

const settingsSchema = new Schema<ISettings>(
    {
        name:        { type: String, default: "" },
        tagline:     { type: String, default: "" },
        address:     { type: String, default: "" },
        phone:       { type: String, default: "" },
        email:       { type: String, default: "" },
        website:     { type: String, default: "" },
        googleMapUrl:{ type: String, default: "" },
        whatsapp:    { type: String, default: "" },
        facebook:    { type: String, default: "" },
        instagram:   { type: String, default: "" },
        youtube:     { type: String, default: "" },
        logoUrl:     { type: String, default: "" },
        faviconUrl:  { type: String, default: "" },
        notifyOnEnquiry:    { type: Boolean, default: true },
        notifyOnContact:    { type: Boolean, default: true },
        notifyOnEnrollment: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Settings ||
    mongoose.model<ISettings>("Settings", settingsSchema);