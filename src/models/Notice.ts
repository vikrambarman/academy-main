/**
 * Notice Model (Production Ready Version)
 */
import mongoose, { Schema, Document, Model } from "mongoose";
/**
 * Notice Interface
 */
export interface INotice extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: "Admissions" | "Examination" | "General" | "Events";
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    views: number;
    isActive: boolean;
}

/**
 * Notice Schema
 */
const noticeSchema = new Schema<INotice>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9-]+$/,
        },

        excerpt: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: ["Admissions", "Examination", "General", "Events"],
            default: "General",
        },

        metaTitle: {
            type: String,
            trim: true,
        },

        metaDescription: {
            type: String,
            trim: true,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },

        views: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

/**
 * Prevent model overwrite in Next.js dev mode
 */
const Notice: Model<INotice> =
    mongoose.models.Notice ||
    mongoose.model<INotice>("Notice", noticeSchema);

export default Notice;