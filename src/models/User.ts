import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    academyId: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "student";
    courseId?: string;
    refreshToken?: string;
    isActive: boolean;
    twoFactorCode?: string;
    twoFactorExpiry?: Date;
    isTwoFactorEnabled: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    isFirstLogin: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        academyId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "student"], required: true },
        courseId: { type: String },
        refreshToken: { type: String },
        isActive: { type: Boolean, default: true },
        isTwoFactorEnabled: { type: Boolean, default: false },
        twoFactorCode: { type: String },
        twoFactorExpiry: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordExpiry: { type: Date },
        isFirstLogin: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);