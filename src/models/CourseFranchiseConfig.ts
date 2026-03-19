import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Har cert type ka apna fee structure hota hai:
 * DCA + GSDM:
 *   - NSDC cert:     ₹4500 total, ₹500 registration
 *   - Medhavi cert:  ₹3800 total, ₹300 registration
 *   - Own cert:      ₹2500 total, ₹0 registration
 */

export interface ICertFeeEntry {
    certType: mongoose.Types.ObjectId;
    isDefault: boolean;
    fee: number;   // course fee
    registrationFee: number;   // one-time registration
    installmentsAllowed: boolean;
    maxInstallments: number;
    minInstallmentAmount: number;
}

export interface ICourseFranchiseConfig extends Document {
    course: mongoose.Types.ObjectId;
    franchise: mongoose.Types.ObjectId;
    // Each cert type has its own fee structure
    certEntries: ICertFeeEntry[];
    // Convenience: default cert ObjectId
    defaultCertType: mongoose.Types.ObjectId;
    benefits: string[];
    highlights: string[];
    isActive: boolean;
}

const certFeeEntrySchema = new Schema<ICertFeeEntry>(
    {
        certType: { type: Schema.Types.ObjectId, ref: "CertificateType", required: true },
        isDefault: { type: Boolean, default: false },
        fee: { type: Number, default: 0 },
        registrationFee: { type: Number, default: 0 },
        installmentsAllowed: { type: Boolean, default: true },
        maxInstallments: { type: Number, default: 3 },
        minInstallmentAmount: { type: Number, default: 500 },
    },
    { _id: false }
);

const courseFranchiseConfigSchema = new Schema<ICourseFranchiseConfig>(
    {
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        franchise: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
        certEntries: [certFeeEntrySchema],
        defaultCertType: { type: Schema.Types.ObjectId, ref: "CertificateType", required: true },
        benefits: [{ type: String, trim: true }],
        highlights: [{ type: String, trim: true }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Unique: ek course + ek franchise = sirf ek config
courseFranchiseConfigSchema.index({ course: 1, franchise: 1 }, { unique: true });

// Virtual: backward-compat availableCertTypes array
courseFranchiseConfigSchema.virtual("availableCertTypes").get(function () {
    return this.certEntries?.map(e => e.certType) ?? [];
});

// Virtual: backward-compat feeStructure (default cert ka fee)
courseFranchiseConfigSchema.virtual("feeStructure").get(function () {
    const def = this.certEntries?.find(e => e.isDefault) ?? this.certEntries?.[0];
    return {
        total: def?.fee ?? 0,
        registrationFee: def?.registrationFee ?? 0,
        installmentsAllowed: def?.installmentsAllowed ?? true,
        maxInstallments: def?.maxInstallments ?? 3,
        minInstallmentAmount: def?.minInstallmentAmount ?? 500,
    };
});

courseFranchiseConfigSchema.set("toJSON", { virtuals: true });
courseFranchiseConfigSchema.set("toObject", { virtuals: true });

const CourseFranchiseConfig: Model<ICourseFranchiseConfig> =
    mongoose.models.CourseFranchiseConfig ||
    mongoose.model<ICourseFranchiseConfig>("CourseFranchiseConfig", courseFranchiseConfigSchema);

export default CourseFranchiseConfig;