import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/auth"

export async function getUserFromToken() {

    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return null

    try {
        return verifyAccessToken(token)
    } catch {
        return null
    }

}