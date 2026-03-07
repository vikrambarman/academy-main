/**
 * Course Model (Production Ready Version)
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
}

/**
 * Syllabus Schema
 */
const syllabusSchema = new Schema<ISyllabus>(
    {
        module: {
            type: String,
            trim: true,
        },
        topics: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { _id: false } // prevent unnecessary _id for each module
);

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
            index: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9-]+$/, // SEO safe slug validation
        },

        level: {
            type: String,
            required: true,
            trim: true,
        },

        authority: {
            type: String,
            required: true,
            trim: true,
        },
        
        banner: {
            type: String,
            trim: true
        },

        externalPortalUrl: {
            type: String,
            trim: true,
        },

        externalLoginRequired: {
            type: Boolean,
            default: true,
        },

        verification: {
            type: String,
            trim: true,
        },

        duration: {
            type: String,
            trim: true,
        },

        eligibility: {
            type: String,
            trim: true,
        },

        designedFor: [
            {
                type: String,
                trim: true,
            },
        ],

        careerOpportunities: [
            {
                type: String,
                trim: true,
            },
        ],

        certificate: {
            type: String,
            trim: true,
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