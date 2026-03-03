import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

/**
 * Extend global type for mongoose caching
 */
declare global {
    var mongooseConn: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseConn;

if (!cached) {
    cached = global.mongooseConn = {
        conn: null,
        promise: null,
    };
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // prevent excessive connections
        };

        if (process.env.NODE_ENV !== "production") {
            mongoose.set("debug", false);
        }

        cached!.promise = mongoose
            .connect(MONGODB_URI!, opts)
            .then((mongooseInstance) => {
                console.log("MongoDB Connected");
                return mongooseInstance;
            })
            .catch((error) => {
                console.error("MongoDB Connection Error:", error);
                throw error;
            });
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}