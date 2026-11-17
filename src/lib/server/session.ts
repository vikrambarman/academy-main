/**
 * Server-side session verification for React Server Components.
 * Access token expired ho to refresh token se fallback (proxy.ts jaisa logic).
 */
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const accessSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = () => new TextEncoder().encode(process.env.REFRESH_SECRET!);

export interface ServerSession {
  id: string;
  role: "admin" | "student" | "teacher";
  isFirstLogin: boolean;
}

export async function getServerSession(): Promise<ServerSession | null> {
  const store = await cookies();

  // 1. Access token try karo
  const access = store.get("accessToken")?.value;
  if (access) {
    try {
      const { payload } = await jwtVerify(access, accessSecret());
      return {
        id: payload.id as string,
        role: payload.role as ServerSession["role"],
        isFirstLogin: Boolean(payload.isFirstLogin),
      };
    } catch {
      // expired — refresh pe fallback
    }
  }

  // 2. Refresh token fallback (7 din valid)
  const refresh = store.get("refreshToken")?.value;
  if (refresh) {
    try {
      const { payload } = await jwtVerify(refresh, refreshSecret());
      return {
        id: payload.id as string,
        role: payload.role as ServerSession["role"],
        isFirstLogin: Boolean(payload.isFirstLogin),
      };
    } catch {
      return null;
    }
  }

  return null;
}