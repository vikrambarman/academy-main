/**
 * ADMIN SEED SCRIPT
 * ------------------
 * Creates initial admin user.
 * Run only once.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load env variables from .env.local
dotenv.config({ path: ".env.local" });

// Import User model using relative path with extension
import User from "../src/models/User.js"; // IMPORTANT: .js extension required

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedAdmin() {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI not found in .env.local");
        }

        // Connect DB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected");

        // Check existing admin
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create admin
        const admin = await User.create({
            academyId: "ADMIN001",
            name: "Super Admin",
            email: "admin@shivshakti.com",
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });

        console.log("🎉 Admin created successfully!");
        console.log("Email: admin@shivshakti.com");
        console.log("Password: Admin@123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedAdmin();