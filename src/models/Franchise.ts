import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFranchise extends Document {
    name: string;
    code: string;
    description?: string;
    registeredBodies: string[];
    logoUrl?: string;
    websiteUrl?: string;
    portalUrl?: string;
    portalLoginRequired: boolean;
    isOwn: boolean;
    isActive: boolean;
}

const franchiseSchema = new Schema<IFranchise>(
    {
        name: { type: String, required: true, trim: true },
        code: {
            type: String, required: true, unique: true,
            trim: true, uppercase: true,
        },
        description: { type: String, trim: true },
        registeredBodies: [{ type: String, trim: true }],
        logoUrl:  { type: String, trim: true },
        websiteUrl: { type: String, trim: true },
        portalUrl:  { type: String, trim: true },
        portalLoginRequired: { type: Boolean, default: false },
        isOwn:    { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Franchise: Model<IFranchise> =
    mongoose.models.Franchise ||
    mongoose.model<IFranchise>("Franchise", franchiseSchema);

export default Franchise;