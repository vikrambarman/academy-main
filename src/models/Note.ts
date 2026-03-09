/**
 * Note Model
 * ----------
 * Content ab MongoDB mein store hota hai (Vercel safe)
 * filePath field ab optional hai (legacy support ke liye rakha)
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
    title:       string;
    courseSlug:  string;
    moduleSlug:  string;
    moduleName:  string;
    topicSlug:   string;
    topicName:   string;
    content:     string;    // ← NEW: markdown content MongoDB mein
    filePath?:   string;    // ← CHANGED: optional (purane records ke liye)
    order:       number;
    isPublished: boolean;
    createdBy:   mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>(
    {
        title:      { type: String, required: true, trim: true },
        courseSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
        moduleSlug: { type: String, required: true, lowercase: true, trim: true },
        moduleName: { type: String, required: true, trim: true },
        topicSlug:  { type: String, required: true, lowercase: true, trim: true },
        topicName:  { type: String, required: true, trim: true },
        content:    { type: String, default: "" },      // ← NEW
        filePath:   { type: String, trim: true },       // ← optional ab
        order:      { type: Number, default: 0 },
        isPublished:{ type: Boolean, default: false },
        createdBy:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

noteSchema.index({ courseSlug: 1, moduleSlug: 1, topicSlug: 1 }, { unique: true });

const Note: Model<INote> =
    mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;