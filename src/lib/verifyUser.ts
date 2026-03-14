import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyUser() {
    try {
        const cookieStore = await cookies();
        const headerList = await headers();

        // 1. टोकन प्राप्त करने के दो तरीके:
        // पहला: सामान्य कुकी से
        // दूसरा: x-access-token हेडर से (जो हमने middleware में रिन्यूअल के समय सेट किया था)
        let token = cookieStore.get("accessToken")?.value || headerList.get("x-access-token");

        // ✅ बिल्ड टाइम या बिना टोकन वाले रिक्वेस्ट के लिए Error थ्रो करने के बजाय null भेजें
        // इससे Prerender Error (AUTH_FAILED) नहीं आएगा।
        if (!token) {
            return null;
        }

        // 2. JWT Verify करें
        let payload;
        try {
            const verified = await jwtVerify(token, accessSecret);
            payload = verified.payload;
        } catch (jwtError) {
            console.error("JWT Verification failed:", jwtError);
            return null; // टोकन गलत या एक्सपायर होने पर null
        }

        // 3. Database connection
        await connectDB();

        // 4. User Fetch करें
        const user = await User.findById(payload.id)
            .select("_id role email isFirstLogin")
            .lean();

        if (!user) {
            return null;
        }

        // 5. Plain Object में कन्वर्ट करें (Next.js Client Components में भेजने के लिए ज़रूरी)
        return JSON.parse(JSON.stringify(user));

    } catch (error) {
        // किसी भी गंभीर एरर की स्थिति में null रिटर्न करें ताकि बिल्ड न रुके
        console.error("VerifyUser Internal Error:", error);
        return null;
    }
}