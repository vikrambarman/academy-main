import mongoose from "mongoose";

const noticeReadSchema = new mongoose.Schema(
    {
        notice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notice",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

noticeReadSchema.index({ notice: 1, student: 1 }, { unique: true });

export default mongoose.models.NoticeRead ||
    mongoose.model("NoticeRead", noticeReadSchema);