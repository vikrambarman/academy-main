/**
 * COURSE MODEL — Updated
 *
 * CHANGE: allowedFranchises[] field added (optional array)
 * Empty array = koi bhi franchise ya direct admission allowed
 * All existing fields unchanged — backward compatible
 */
import mongoose, { Schema, Document, Model } from "mongoose";

interface ISyllabus {
    module: string;
    topics: string[];
}

export interface ICourse extends Document {
    name: string;
    slug: string;
    level: string;
    authority?: string;          // optional — legacy fallback only
    banner?: string;
    externalPortalUrl?: string;
    externalLoginRequired: boolean;
    verification?: string;
    duration?: string;
    eligibility?: string;
    designedFor: string[];
    careerOpportunities: string[];
    certificate?: string;
    syllabus: ISyllabus[];
    isActive: boolean;
    // NEW: which franchises can offer this course (empty = all allowed)
    allowedFranchises: mongoose.Types.ObjectId[];
}

const syllabusSchema = new Schema<ISyllabus>(
    {
        module: { type: String, trim: true },
        topics: [{ type: String, trim: true }],
    },
    { _id: false }
);

const courseSchema = new Schema<ICourse>(
    {
        name: { type: String, required: true, trim: true },
        slug: {
            type: String, unique: true, required: true,
            index: true, lowercase: true, trim: true,
            match: /^[a-z0-9-]+$/,
        },
        level: { type: String, required: true, trim: true },
        authority: { type: String, trim: true },   // optional — legacy fallback only
        banner: { type: String, trim: true },
        externalPortalUrl: { type: String, trim: true },
        externalLoginRequired: { type: Boolean, default: true },
        verification: { type: String, trim: true },
        duration: { type: String, trim: true },
        eligibility: { type: String, trim: true },
        designedFor: [{ type: String, trim: true }],
        careerOpportunities: [{ type: String, trim: true }],
        certificate: { type: String, trim: true },
        syllabus: [syllabusSchema],
        isActive: { type: Boolean, default: true },

        // NEW (optional, backward compat)
        allowedFranchises: [
            {
                type: Schema.Types.ObjectId,
                ref: "Franchise",
            },
        ],
    },
    { timestamps: true }
);

const Course: Model<ICourse> =
    mongoose.models.Course ||
    mongoose.model<ICourse>("Course", courseSchema);

export default Course;