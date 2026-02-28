import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function verifyUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) throw new Error("Unauthorized");

    return jwt.verify(token, process.env.JWT_SECRET!);
}