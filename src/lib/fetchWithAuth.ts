/**
 * Fetch Wrapper
 * --------------
 * - Automatically refreshes token if access expired
 */

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
) {
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (res.status === 401) {
        // Try refresh
        await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        // Retry original request
        res = await fetch(url, {
            ...options,
            credentials: "include",
        });
    }

    return res;
}