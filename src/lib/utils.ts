/**
 * Simple class merger — newlines aur extra spaces hata deta hai
 * Tailwind hydration mismatch fix karta hai
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}