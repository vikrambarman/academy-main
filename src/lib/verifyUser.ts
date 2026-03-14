import { cookies } from "next/headers";
import { jwtVerify } from "jose"; // ✅ jose का इस्तेमाल करें, यह Middleware के साथ परफेक्ट काम करता है
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyUser() {
    try {
        const cookieStore = await cookies();
        
        // 1. Check if accessToken exists
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            // अगर यहाँ NO_TOKEN आ रहा है, तो इसका मतलब Middleware ने रिन्यूअल के बाद 
            // टोकन को Headers में इंजेक्ट नहीं किया है।
            console.error("Auth Error: No access token found in cookies");
            throw new Error("NO_TOKEN");
        }

        // 2. Verify using jose (same as middleware)
        let payload;
        try {
            const verified = await jwtVerify(token, accessSecret);
            payload = verified.payload;
        } catch (jwtError) {
            console.error("JWT Verification failed:", jwtError);
            throw new Error("TOKEN_INVALID");
        }

        // 3. Database connection
        await connectDB();

        // 4. Fetch User
        // Note: jose में 'id' सीधा payload में होता है (जैसा आपने SignJWT में सेट किया था)
        const user = await User.findById(payload.id)
            .select("_id role email isFirstLogin")
            .lean();

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        // Return standard user object
        return JSON.parse(JSON.stringify(user));

    } catch (error: any) {
        // Error logging for debugging in Vercel
        console.error("VerifyUser Catch Block:", error.message);
        
        // Rethrow original error or a generic one
        if (error.message === "NO_TOKEN" || error.message === "USER_NOT_FOUND") {
            throw error;
        }
        throw new Error("AUTH_FAILED");
    }
}