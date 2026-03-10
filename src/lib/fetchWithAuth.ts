/**
 * Fetch Wrapper
 * --------------
 * - Automatically refreshes access token if expired (401)
 * - Agar refresh bhi fail ho toh role-based login page pe redirect
 */

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
    // Agar pehle se refresh chal rahi hai toh wait karo (multiple simultaneous requests)
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = fetch("/api/auth/refresh", {
        method:      "POST",
        credentials: "include",
    })
        .then(r => r.ok)
        .catch(() => false)
        .finally(() => {
            isRefreshing    = false;
            refreshPromise  = null;
        });

    return refreshPromise;
}

function redirectToLogin() {
    // Current URL se role detect karo
    const path = window.location.pathname;
    if      (path.startsWith("/dashboard/admin"))   window.location.href = "/admin/login";
    else if (path.startsWith("/dashboard/teacher")) window.location.href = "/teacher/login";
    else                                             window.location.href = "/student/login";
}

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    // First attempt
    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status !== 401) return res;

    // Access token expire — refresh try karo
    const refreshed = await tryRefresh();

    if (!refreshed) {
        // Refresh bhi fail — session khatam, login pe bhejo
        redirectToLogin();
        // Ek dummy response return karo taaki caller crash na kare
        return new Response(JSON.stringify({ message: "Session expired" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Cookie set hone ke liye brief wait
    await new Promise(r => setTimeout(r, 100));

    // Naya access token mil gaya — original request retry karo
    res = await fetch(url, { ...options, credentials: "include" });

    // Agar ab bhi 401 aaye (rare case) toh login pe bhejo
    if (res.status === 401) {
        redirectToLogin();
    }

    return res;
}