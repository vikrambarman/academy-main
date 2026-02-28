/**
 * Course Model (Enhanced Version)
 * ---------------------------------
 * - Supports SEO slug
 * - Module-based syllabus
 * - Career & design segmentation
 * - Future notes linking ready
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Syllabus Subdocument Interface
 */
interface ISyllabus {
    module: string;
    topics: string[];
}

/**
 * Main Course Interface
 */
export interface ICourse extends Document {
    name: string;
    slug: string;
    level: string;
    authority: string;
    verification?: string;
    duration?: string;
    eligibility?: string;
    designedFor: string[];
    careerOpportunities: string[];
    certificate?: string;
    syllabus: ISyllabus[];
    isActive: boolean;
}

/**
 * Syllabus Schema
 */
const syllabusSchema = new Schema<ISyllabus>({
    module: {
        type: String,
        required: true,
    },
    topics: [
        {
            type: String,
        },
    ],
});

/**
 * Course Schema
 */
const courseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            required: true,
            index: true, // improves public page fetching
        },

        level: {
            type: String,
            required: true,
        },

        authority: {
            type: String,
            required: true,
        },

        verification: {
            type: String,
        },

        duration: {
            type: String,
        },

        eligibility: {
            type: String,
        },

        designedFor: [
            {
                type: String,
            },
        ],

        careerOpportunities: [
            {
                type: String,
            },
        ],

        certificate: {
            type: String,
        },

        syllabus: [syllabusSchema],

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
const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;