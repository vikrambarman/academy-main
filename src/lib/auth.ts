import { SignJWT, jwtVerify, JWTPayload } from "jose";

export interface TokenPayload extends JWTPayload {
  id: string;
  role: string;
}

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

/**
 * Generate Access Token (15m)
 * RETURNS string (not Promise) to avoid breaking existing code
 */
export function generateAccessToken(payload: TokenPayload) {

  return SignJWT
    .prototype
    .sign
    .call(
      new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m"),
      accessSecret
    ) as unknown as string;

}

/**
 * Generate Refresh Token (7d)
 */
export function generateRefreshToken(payload: TokenPayload) {

  return SignJWT
    .prototype
    .sign
    .call(
      new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d"),
      refreshSecret
    ) as unknown as string;

}

/**
 * Verify Access Token
 */
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify<TokenPayload>(token, accessSecret);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify<TokenPayload>(token, refreshSecret);
    return payload;
  } catch {
    return null;
  }
}