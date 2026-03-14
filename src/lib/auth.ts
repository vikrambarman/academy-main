import jwt from "jsonwebtoken";

export function generateAccessToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "15m",
        algorithm: "HS256",
    });
}

export function generateRefreshToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.REFRESH_SECRET!, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.REFRESH_SECRET!);
}