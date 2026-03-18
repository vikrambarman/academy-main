import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Yeh model batata hai:
 * "DCA + GSDM = Medhavi Diploma + ₹4500 fee + [benefits]"
 * "DCA + DRISHTI = Drishti Cert + ₹3800 fee + [benefits]"
 * "Tally Prime + GSDM = NSDC Short Term + ₹2200 fee"
 * "Tally Prime + DRISHTI = Drishti Cert + ₹2000 fee"
 *
 * Admin ek baar set karta hai.
 * Student admission ke waqt admin in configs mein se choose karta hai.
 * Fee auto-fill hoti hai. Certificate type auto-assign hoti hai.
 */
export interface ICourseFranchiseConfig extends Document {
    course: mongoose.Types.ObjectId;
    franchise: mongoose.Types.ObjectId;
    defaultCertType: mongoose.Types.ObjectId;
    availableCertTypes: mongoose.Types.ObjectId[];
    feeStructure: {
        total: number;
        installmentsAllowed: boolean;
        maxInstallments: number;
        minInstallmentAmount: number;
    };
    benefits: string[];
    highlights: string[];
    isActive: boolean;
}

const courseFranchiseConfigSchema = new Schema<ICourseFranchiseConfig>(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        franchise: {
            type: Schema.Types.ObjectId,
            ref: "Franchise",
            required: true,
        },
        defaultCertType: {
            type: Schema.Types.ObjectId,
            ref: "CertificateType",
            required: true,
        },
        availableCertTypes: [
            { type: Schema.Types.ObjectId, ref: "CertificateType" },
        ],
        feeStructure: {
            total: { type: Number, default: 0 },
            installmentsAllowed: { type: Boolean, default: true },
            maxInstallments: { type: Number, default: 3 },
            minInstallmentAmount: { type: Number, default: 500 },
        },
        benefits: [{ type: String, trim: true }],
        highlights: [{ type: String, trim: true }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Unique: ek course + ek franchise = sirf ek config
courseFranchiseConfigSchema.index(
    { course: 1, franchise: 1 },
    { unique: true }
);

const CourseFranchiseConfig: Model<ICourseFranchiseConfig> =
    mongoose.models.CourseFranchiseConfig ||
    mongoose.model<ICourseFranchiseConfig>(
        "CourseFranchiseConfig",
        courseFranchiseConfigSchema
    );

export default CourseFranchiseConfig;