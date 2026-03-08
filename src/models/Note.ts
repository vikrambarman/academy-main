/**
 * Note Model
 * ----------
 * .md files filesystem pe hain: src/content/notes/{courseSlug}/{moduleSlug}/{topicSlug}.md
 * DB mein sirf metadata store hota hai — course link, visibility, order, etc.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
    title: string;           // Display title (e.g. "Introduction to MS Word")
    courseSlug: string;      // Course ka slug (Course model se match)
    moduleSlug: string;      // Syllabus module ka slugified name
    moduleName: string;      // Original module name (display ke liye)
    topicSlug: string;       // Topic ka slugified name
    topicName: string;       // Original topic name (display ke liye)
    filePath: string;        // Relative path: notes/{courseSlug}/{moduleSlug}/{topicSlug}.md
    order: number;           // Module ke andar ordering
    isPublished: boolean;    // Student ko dikhega ya nahi
    createdBy: mongoose.Types.ObjectId;  // Admin user
}

const noteSchema = new Schema<INote>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        courseSlug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        moduleSlug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        moduleName: {
            type: String,
            required: true,
            trim: true,
        },

        topicSlug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        topicName: {
            type: String,
            required: true,
            trim: true,
        },

        filePath: {
            type: String,
            required: true,
            trim: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Compound index: ek course+module+topic ka ek hi note ho
noteSchema.index({ courseSlug: 1, moduleSlug: 1, topicSlug: 1 }, { unique: true });

const Note: Model<INote> =
    mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;
